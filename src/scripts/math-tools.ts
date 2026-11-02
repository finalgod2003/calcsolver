import { calculateFractions, generateEquivalentFractions, calculatePercentage, solveLinearEquation } from '../lib/math-tools';
import type { FractionOperation, PercentageMode, ToolResult } from '../lib/math-tools';

const tool = document.querySelector<HTMLElement>('[data-math-tool]');
if (tool) {
  const form = tool.querySelector<HTMLFormElement>('form')!;
  const error = tool.querySelector<HTMLElement>('#tool-error')!;
  const output = tool.querySelector<HTMLElement>('#tool-output')!;
  const status = tool.querySelector<HTMLElement>('#tool-status')!;
  const copyStatus = tool.querySelector<HTMLElement>('#copy-status')!;
  const copyButton = tool.querySelector<HTMLButtonElement>('[data-copy-result]')!;
  const resetButton = tool.querySelector<HTMLButtonElement>('[data-reset-tool]')!;
  let resultToCopy = '';
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  const value = (name: string) => field(name).value;

  function updatePercentageLabels() {
    if (tool!.dataset.mathTool !== 'percentage-calculator') return;
    const labels: Record<PercentageMode, [string, string, string]> = {
      of: ['Percentage (%)', 'Number', 'Find the amount represented by this percentage.'],
      ratio: ['Part (A)', 'Whole (B)', 'The whole must be nonzero.'],
      change: ['Starting value', 'New value', 'Use a positive starting value. A negative result means a decrease.'],
      increase: ['Starting value', 'Increase (%)', 'Add this percentage of the starting value.'],
      decrease: ['Starting value', 'Decrease (%)', 'Subtract this percentage of the starting value.'],
    };
    const [first, second, hint] = labels[value('mode') as PercentageMode];
    tool!.querySelector('#first-label')!.textContent = first;
    tool!.querySelector('#second-label')!.textContent = second;
    tool!.querySelector('#percentage-hint')!.textContent = hint;
  }

  function calculate(announce = true) {
    error.hidden = true;
    status.textContent = '';
    copyStatus.textContent = '';
    resultToCopy = '';
    try {
      let result: ToolResult;
      switch (tool!.dataset.mathTool) {
        case 'fraction-calculator': result = calculateFractions(value('an'), value('ad'), value('operation') as FractionOperation, value('bn'), value('bd')); break;
        case 'equivalent-fractions': result = generateEquivalentFractions(value('numerator'), value('denominator'), value('count')); break;
        case 'percentage-calculator': result = calculatePercentage(value('mode') as PercentageMode, value('first'), value('second')); break;
        case 'equation-solver': result = solveLinearEquation(value('equation')); break;
        default: return;
      }
      tool!.querySelector('#result-label')!.textContent = result.label;
      tool!.querySelector('#result-answer')!.textContent = result.answer;
      tool!.querySelector('#result-summary')!.textContent = result.summary;
      tool!.querySelector('#steps-title')!.textContent = result.stepsTitle ?? 'Step by step';
      tool!.querySelector('#result-steps')!.replaceChildren(...result.steps.map(step => {
        const item = document.createElement('li');
        const label = document.createElement('span');
        const expression = document.createElement('code');
        label.textContent = step.label;
        expression.textContent = step.expression;
        item.append(label, expression);
        return item;
      }));
      output.hidden = false;
      resultToCopy = [`${result.label}: ${result.answer}`, result.summary, ...result.steps.map((step, index) => `${index + 1}. ${step.label}\n${step.expression}`)].join('\n\n');
      if (announce) status.textContent = `${result.label}: ${result.answer}. Steps are shown below.`;
    } catch (exception) {
      output.hidden = true;
      error.textContent = exception instanceof Error ? exception.message : 'Check your values and try again.';
      error.hidden = false;
    }
  }

  form.addEventListener('submit', event => { event.preventDefault(); calculate(); });
  form.addEventListener('input', () => {
    updatePercentageLabels();
    output.hidden = true;
    error.hidden = true;
    resultToCopy = '';
    copyStatus.textContent = '';
    status.textContent = 'Values changed. Submit to update the result.';
  });
  tool.querySelectorAll<HTMLButtonElement>('[data-tool-example]').forEach(button => button.addEventListener('click', () => {
    const values = JSON.parse(button.dataset.toolExample!) as Record<string, string>;
    for (const [name, input] of Object.entries(values)) field(name).value = input;
    updatePercentageLabels();
    calculate();
  }));
  resetButton.hidden = false;
  resetButton.addEventListener('click', () => {
    form.reset();
    updatePercentageLabels();
    calculate();
    status.textContent = 'Example values and result restored.';
  });
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    if (!resultToCopy) return;
    const copiedResult = resultToCopy;
    try {
      await navigator.clipboard.writeText(copiedResult);
      if (resultToCopy === copiedResult) copyStatus.textContent = 'Answer and steps copied.';
    } catch {
      if (resultToCopy === copiedResult) copyStatus.textContent = 'Copy is unavailable. Select the answer and steps to copy them manually.';
    }
  });
  const presetFields: Record<string, string[]> = {
    'equivalent-fractions': ['numerator', 'denominator', 'count'],
    'percentage-calculator': ['mode', 'first', 'second'],
    'equation-solver': ['equation'],
  };
  const params = new URLSearchParams(window.location.search);
  for (const name of presetFields[tool.dataset.mathTool!] ?? []) {
    const preset = params.get(name);
    const input = field(name);
    if (preset === null) continue;
    if (input instanceof HTMLSelectElement) {
      if (Array.from(input.options).some(option => option.value === preset)) input.value = preset;
    } else if (preset.length <= input.maxLength) {
      input.value = preset;
    }
  }
  updatePercentageLabels();
  calculate(false);
}
