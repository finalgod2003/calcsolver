import { calculateFractions, generateEquivalentFractions, calculatePercentage, solveLinearEquation } from '../lib/math-tools';
import type { FractionOperation, PercentageMode, ToolResult } from '../lib/math-tools';

const tool = document.querySelector<HTMLElement>('[data-math-tool]');
if (tool) {
  const form = tool.querySelector<HTMLFormElement>('form')!;
  const error = tool.querySelector<HTMLElement>('#tool-error')!;
  const output = tool.querySelector<HTMLElement>('#tool-output')!;
  const status = tool.querySelector<HTMLElement>('#tool-status')!;
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
    status.textContent = 'Values changed. Submit to update the result.';
  });
  tool.querySelectorAll<HTMLButtonElement>('[data-tool-example]').forEach(button => button.addEventListener('click', () => {
    const values = JSON.parse(button.dataset.toolExample!) as Record<string, string>;
    for (const [name, input] of Object.entries(values)) field(name).value = input;
    updatePercentageLabels();
    calculate();
  }));
  calculate(false);
}
