import { calculateLesson, type LessonToolKind } from '../lib/lesson-tools';

document.querySelectorAll<HTMLElement>('[data-lesson-tool]').forEach(tool => {
  const form = tool.querySelector<HTMLFormElement>('form')!;
  const resultPanel = tool.querySelector<HTMLElement>('[data-lesson-result]')!;
  const error = tool.querySelector<HTMLElement>('[data-lesson-error]')!;
  const status = tool.querySelector<HTMLElement>('[data-lesson-status]')!;
  const fields = Array.from(form.querySelectorAll<HTMLInputElement>('input'));
  function calculate() {
    try {
      const result = calculateLesson(tool.dataset.lessonTool as LessonToolKind, Object.fromEntries(fields.map(field => [field.name, field.value])));
      tool.querySelector('[data-result-label]')!.textContent = result.label;
      tool.querySelector('[data-result-answer]')!.textContent = result.answer;
      tool.querySelector('[data-result-summary]')!.textContent = result.summary;
      tool.querySelector('[data-steps-title]')!.textContent = result.stepsTitle ?? 'Step by step';
      tool.querySelector('[data-result-steps]')!.replaceChildren(...result.steps.map(step => {
        const item = document.createElement('li');
        const label = document.createElement('span');
        const expression = document.createElement('code');
        label.textContent = step.label;
        expression.textContent = step.expression;
        item.append(label, expression);
        return item;
      }));
      error.hidden = true;
      resultPanel.hidden = false;
      status.textContent = `${result.label}: ${result.answer}`;
    } catch (exception) {
      resultPanel.hidden = true;
      error.textContent = exception instanceof Error ? exception.message : 'Check the values and try again.';
      error.hidden = false;
      status.textContent = error.textContent;
    }
  }
  form.addEventListener('input', calculate);
  form.addEventListener('submit', event => { event.preventDefault(); calculate(); });
  form.querySelector('[data-reset-lesson]')!.addEventListener('click', () => { form.reset(); calculate(); });
  form.querySelector('fieldset')!.disabled = false;
});

document.querySelectorAll<HTMLFormElement>('[data-practice-question]').forEach(form => {
  const feedback = form.querySelector<HTMLElement>('.practice-feedback')!;
  const answer = form.querySelector<HTMLDetailsElement>('details')!;
  function check() {
    const selected = form.querySelector<HTMLInputElement>('input:checked');
    if (!selected) {
      feedback.textContent = 'Choose an answer first.';
      feedback.removeAttribute('data-correct');
      return;
    }
    const correct = selected.value === form.dataset.correct;
    feedback.textContent = correct ? 'Correct. Here is the reasoning.' : 'Not quite. Compare your answer with the reasoning below, then try again.';
    feedback.dataset.correct = String(correct);
    answer.open = true;
  }
  form.addEventListener('submit', event => { event.preventDefault(); check(); });
  form.querySelector('button')!.addEventListener('click', check);
  form.addEventListener('change', () => { feedback.textContent = ''; feedback.removeAttribute('data-correct'); answer.open = false; });
  form.querySelector('fieldset')!.disabled = false;
});
