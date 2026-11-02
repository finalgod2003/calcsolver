import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateLesson } from '../src/lib/lesson-tools.ts';
import { articles } from '../src/data/articles.ts';
import { getLesson } from '../src/data/lessons.ts';
import { correctionUrl } from '../src/data/editorial.ts';

test('fraction lessons show exact context alongside rounded conversions', () => {
  assert.equal(calculateLesson('conversion', { n: '1', d: '4' }).answer, '0.25 · 25%');
  const repeating = calculateLesson('conversion', { n: '1', d: '3' });
  assert.equal(repeating.answer, '0.333333333333 · 33.3333333333%');
  assert.match(repeating.summary, /Exact fraction: 1\/3/);
  assert.equal(calculateLesson('conversion', { n: '1', d: '-8' }).answer, '-0.125 · -12.5%');
  assert.equal(calculateLesson('conversion', { n: '0', d: '5' }).answer, '0 · 0%');
  assert.throws(() => calculateLesson('conversion', { n: '1', d: '0' }), /zero/);
});

test('division distinguishes the divisor sign, quotient and remainder', () => {
  const negativeRoot = calculateLesson('division', { a: '2', b: '-1', c: '4', x: '-3' });
  assert.equal(negativeRoot.answer, 'Q(x) = 2x − 7; R = 25');
  assert.match(negativeRoot.summary, /\(x \+ 3\)/);
  assert.equal(calculateLesson('division', { a: '1', b: '5', c: '6', x: '-2' }).answer, 'Q(x) = x + 3; R = 0');
  assert.equal(calculateLesson('division', { a: '0', b: '0', c: '-5', x: '2' }).answer, 'Q(x) = 0; R = -5');
});

test('integer factoring handles signed, repeated and absent factor pairs', () => {
  assert.equal(calculateLesson('factor', { b: '-1', c: '-6' }).answer, '(x + 2)(x − 3)');
  assert.equal(calculateLesson('factor', { b: '-4', c: '4' }).answer, '(x − 2)(x − 2)');
  assert.equal(calculateLesson('factor', { b: '0', c: '0' }).answer, '(x)(x)');
  assert.equal(calculateLesson('factor', { b: '1', c: '1' }).answer, 'No integer factor pair');
  assert.equal(calculateLesson('factor', { b: '0', c: '-2' }).answer, 'No integer factor pair');
});

test('classification ignores zero coefficients and handles the zero polynomial', () => {
  assert.equal(calculateLesson('classify', { a: '3', b: '-2', c: '7' }).answer, 'Trinomial · degree 2');
  assert.equal(calculateLesson('classify', { a: '0', b: '3', c: '1' }).answer, 'Binomial · degree 1');
  assert.equal(calculateLesson('classify', { a: '0', b: '0', c: '7' }).answer, 'Monomial · degree 0');
  assert.equal(calculateLesson('classify', { a: '0', b: '0', c: '0' }).answer, 'Zero polynomial · degree undefined');
});

test('rational cancellation preserves the original domain including k = 0 and negative k', () => {
  assert.equal(calculateLesson('rational', { k: '3', x: '5' }).answer, '2 = 2');
  assert.equal(calculateLesson('rational', { k: '-2', x: '-3' }).answer, '-1 = -1');
  for (const [k, x] of [['3', '-3'], ['-2', '2'], ['0', '0']]) {
    assert.throws(() => calculateLesson('rational', { k, x }), /excluded even after cancelling/);
  }
});

test('substitution respects negative values and the stated integer limits', () => {
  assert.equal(calculateLesson('evaluate', { a: '2', b: '-3', c: '1', x: '-2' }).answer, '15');
  assert.equal(calculateLesson('evaluate', { a: '10000', b: '10000', c: '10000', x: '10000' }).answer, '1000100010000');
  for (const invalid of ['', '1.5', '1e3', 'Infinity', '10001', '-10001']) {
    assert.throws(() => calculateLesson('evaluate', { a: '1', b: '0', c: '0', x: invalid }), /whole number between/);
  }
});

test('every guide has a working example, explained practice and source references', () => {
  for (const article of articles) {
    const lesson = getLesson(article);
    assert.ok(lesson.sections.length >= 2, article.slug);
    assert.ok(lesson.mistakes.length >= 2, article.slug);
    assert.equal(lesson.questions.length, 2, article.slug);
    for (const question of lesson.questions) {
      assert.equal(new Set(question.choices).size, question.choices.length, article.slug);
      assert.ok(question.choices[question.correct] && question.explanation, article.slug);
    }
    assert.ok(lesson.sources.length && lesson.sources.every(source => new URL(source.url).protocol === 'https:'), article.slug);
    const values = Object.fromEntries(lesson.tool.fields.map(field => [field.name, field.value]));
    assert.ok(calculateLesson(lesson.tool.kind, values).answer, article.slug);
  }
});

test('article correction drafts keep the correct page and a readable reporting template', () => {
  const page = { title: '1/3 as a Percent & Decimal', url: 'https://calcsolver.info/1-3-as-a-percent-and-decimal/' };
  const link = new URL(correctionUrl(page));
  assert.equal(link.origin + link.pathname, 'https://github.com/finalgod2003/calcsolver/issues/new');
  assert.equal(link.searchParams.get('title'), `Math correction: ${page.title}`);
  assert.ok(link.searchParams.get('body')!.startsWith(`Page: ${page.url}\n\n`));
  assert.match(link.searchParams.get('body')!, /Expected result and reasoning/);
});
