import type { Article, Section } from './articles';
import type { LessonToolConfig } from '../lib/lesson-tools';

export interface PracticeQuestion { prompt: string; choices: string[]; correct: number; explanation: string }
export interface Lesson {
  sections: Section[];
  mistakes: { title: string; explanation: string }[];
  questions: PracticeQuestion[];
  tool: LessonToolConfig;
  sources: { title: string; url: string }[];
}
const question = (prompt: string, choices: string[], correct: number, explanation: string): PracticeQuestion => ({ prompt, choices, correct, explanation });
const section = (heading: string, paragraph: string, example: string): Section => ({ heading, paragraphs: [paragraph], example });
const field = (name: string, label: string, value: number) => ({ name, label, value: String(value) });
const references = {
  percent: { title: 'OpenStax Prealgebra 2e: percent conversion methods', url: 'https://openstax.org/books/prealgebra-2e/pages/6-key-concepts' },
  decimal: { title: 'OpenStax Prealgebra 2e: decimals and fractions', url: 'https://openstax.org/books/prealgebra-2e/pages/5-3-decimals-and-fractions' },
  equivalent: { title: 'OpenStax Prealgebra 2e: visualize equivalent fractions', url: 'https://openstax.org/books/prealgebra-2e/pages/4-1-visualize-fractions' },
  division: { title: 'OpenStax Intermediate Algebra 2e: dividing polynomials', url: 'https://openstax.org/books/intermediate-algebra-2e/pages/5-4-dividing-polynomials' },
  factor: { title: 'OpenStax Elementary Algebra 2e: common factors and grouping', url: 'https://openstax.org/books/elementary-algebra-2e/pages/7-1-greatest-common-factor-and-factor-by-grouping' },
  polynomial: { title: 'OpenStax Elementary Algebra 2e: polynomial terms and degree', url: 'https://openstax.org/books/elementary-algebra-2e/pages/6-1-add-and-subtract-polynomials' },
  equation: { title: 'OpenStax Elementary Algebra 2e: equation properties and checking solutions', url: 'https://openstax.org/books/elementary-algebra-2e/pages/2-key-concepts' },
  rational: { title: 'OpenStax Elementary Algebra 2e: simplify rational expressions', url: 'https://openstax.org/books/elementary-algebra-2e/pages/8-1-simplify-rational-expressions' },
};

interface FractionExtension { strategy: Section; application: Section; caution: string; practice: PracticeQuestion }
const percentExtensions: Record<string, FractionExtension> = {
  '1/4': {
    strategy: section('Another method: count hundredths', 'Four equal shares of 100 contain 25 each. Scaling the denominator to 100 therefore gives the percentage directly, without first using decimal division.', '1/4 = 25/100 = 25%'),
    application: section('Put it to work: a quarter of an hour', 'An hour has 60 minutes. One quarter is 15 minutes, so 15 minutes is 25% of an hour. The whole must stay the same when you compare the fraction and percentage.', '60 × 1/4 = 15; 15/60 = 1/4'),
    caution: '0.25 is the decimal, while 25% is the percentage. Writing 0.25% would mean only 0.0025 of the whole.',
    practice: question('A 60-minute session is one quarter complete. How many minutes have passed?', ['15 minutes', '25 minutes', '45 minutes'], 0, 'Split 60 into four equal groups: 60 ÷ 4 = 15. The number 25 describes a percentage, not the number of minutes.'),
  },
  '7/10': {
    strategy: section('Another method: use place value', 'A tenth occupies the first place after the decimal point. Seven tenths is 0.7; writing 0.70 makes the equivalent seventy hundredths visible.', '7/10 = 0.7 = 0.70 = 70/100'),
    application: section('Put it to work: seven of ten targets', 'If you meet 7 of 10 targets, your completion rate is 70%. At the same rate across 20 equally weighted targets, you would complete 14. Doubling the whole doubles the completed count, but leaves the rate unchanged.', '7/10 = 14/20; 20 × 0.7 = 14'),
    caution: 'Keep the denominator attached to its numerator: 7 completed targets out of 20 is 35%, not 70%.',
    practice: question('At a completion rate of 7/10, how many of 20 equal tasks are complete?', ['7', '14', '17'], 1, 'The total doubles from 10 to 20, so the completed count also doubles: 7 × 2 = 14.'),
  },
  '6/7': {
    strategy: section('Another method: subtract the missing seventh', 'Six sevenths is one whole minus one seventh. This is useful for estimating: 1/7 is a little more than 14%, leaving a little less than 86%. Keep the exact fraction until the final rounding step.', '6/7 = 1 − 1/7 = (600/7)% = (85 5/7)%'),
    application: section('Put it to work: a weekly habit', 'Completing a habit on 6 of 7 days gives this success rate. Repeating that pattern for six weeks means 36 successful days out of 42; dividing the larger counts gives the same result.', '36/42 = 6/7 ≈ 85.7143%'),
    caution: '86% is a whole-percent approximation. It is not exactly equal to 6/7, and 0.857143 should not be treated as the complete repeating decimal.',
    practice: question('Which statement about 6/7 is exact?', ['6/7 = 86%', '6/7 = 0.857143', '6/7 = 1 − 1/7'], 2, 'The complement identity uses exact fractions. Both finite decimal displays are rounded.'),
  },
  '5/6': {
    strategy: section('Another method: split the numerator', 'Write five sixths as three sixths plus two sixths. These reduce to one half and one third, connecting the unfamiliar fraction to two useful benchmarks.', '5/6 = 3/6 + 2/6 = 1/2 + 1/3; 50% + 33 1/3% = 83 1/3%'),
    application: section('Put it to work: completed practice questions', 'Finishing 25 of 30 questions is the same share as finishing 5 of 6. Five questions remain, which is one sixth of the total, not one fifth.', '25/30 = 5/6; remaining share = 5/30 = 1/6'),
    caution: 'The repeating digit begins after the first decimal place: 5/6 = 0.8333… . Rounding 0.833333 to two decimal places gives 0.83, while rounding its percentage gives 83.33%.',
    practice: question('After completing 25 of 30 questions, what fraction remains?', ['1/5', '1/6', '5/6'], 1, 'There are 5 questions left out of the original 30. Reduce 5/30 by dividing both parts by 5.'),
  },
  '1/3': {
    strategy: section('Another method: reason from three equal shares', 'Three thirds make exactly one whole. If each share were exactly 0.33, the total would only be 0.99. The continuing threes are essential; the dots mean the digits do not stop.', '1/3 = 0.333…; 3 × (1/3) = 1'),
    application: section('Put it to work: sharing a group', 'Dividing a group of 90 into three equal groups gives 30 in each group. Using the exact fraction produces an exact headcount; using 33% would produce 29.7.', '90 × 1/3 = 30; 90 × 33/100 = 29.7'),
    caution: '33% is not an exact replacement for one third. Keep 1/3 when an exact count is needed, and only round a reported percentage at the end.',
    practice: question('What is exactly one third of 90?', ['29.7', '30', '33'], 1, 'Use the exact fraction: 90 ÷ 3 = 30. The result 29.7 comes from replacing one third with the rounded value 33%.'),
  },
  '1/2': {
    strategy: section('Another method: halve one hundred', 'Percent asks how many parts out of 100. Half of 100 is 50, so one half is 50%. This benchmark is also useful when estimating less familiar fractions.', '1/2 = 50/100 = 0.5 = 50%'),
    application: section('Put it to work: halfway through a distance', 'Traveling 45 km of a 90 km route means half the route is complete. Neither distance needs to be 100 for its ratio to be expressed as a percentage.', '45/90 = 1/2; 90 − 45 = 45 km remaining'),
    caution: '0.5 and 0.50 are equal decimals. Adding a trailing zero does not make the value smaller; shifting the decimal point to 0.05 does.',
    practice: question('Which decimal is equal to one half?', ['0.05', '0.50', '0.005'], 1, 'Five tenths and fifty hundredths name the same value: 0.5 = 0.50.'),
  },
  '7/8': {
    strategy: section('Another method: use the complement', 'Seven eighths is one eighth short of a whole. One eighth is 12.5%, so subtracting 12.5 percentage points from 100% gives 87.5%.', '7/8 = 1 − 1/8; 100% − 12.5% = 87.5%'),
    application: section('Put it to work: a batch of forty', 'If 35 of 40 items pass a check, divide both counts by 5 to get 7/8. The five remaining items account for the other eighth.', '35/40 = 7/8; 5/40 = 1/8; 35 + 5 = 40'),
    caution: '87.5% is exact here. Rounding it to 88% may be useful for a summary, but that rounded value should not replace the original fraction in later calculations.',
    practice: question('If 7/8 of a batch of 40 passes a check, how many items do not pass?', ['5', '7', '8'], 0, 'The remaining share is 1/8, and 40 ÷ 8 = 5.'),
  },
  '5/8': {
    strategy: section('Another method: add a half and an eighth', 'Four eighths make one half. Adding one more eighth gives five eighths, so you can add the familiar percentages 50% and 12.5%.', '5/8 = 4/8 + 1/8 = 1/2 + 1/8; 50% + 12.5% = 62.5%'),
    application: section('Put it to work: a partly filled container', 'A 24-litre container that is five eighths full holds 15 litres. First find the size of one eighth, then count five of those equal shares.', '24 ÷ 8 = 3 litres; 5 × 3 = 15 litres'),
    caution: 'Five eighths is greater than one half because 5 > 4 when both numerators use denominator 8. A decimal answer below 0.5 signals a mistake.',
    practice: question('How many litres are in a 24-litre container that is 5/8 full?', ['12', '15', '19'], 1, 'Each eighth is 24 ÷ 8 = 3 litres. Five eighths therefore hold 5 × 3 = 15 litres.'),
  },
  '3/5': {
    strategy: section('Another method: turn fifths into tenths', 'Multiply both parts by 2. Six tenths can be read immediately as 0.6; multiplying both parts of the original fraction by 20 instead gives 60 hundredths.', '3/5 = 6/10 = 60/100 = 60%'),
    application: section('Put it to work: a reading target', 'Reading 30 pages of a 50-page target represents three fifths of the target. The remaining 20 pages account for two fifths, or 40%.', '30/50 = 3/5; 20/50 = 2/5; 60% + 40% = 100%'),
    caution: 'Dividing 5 by 3 reverses the ratio and gives a value above 1. Since three fifths is a proper fraction, its decimal must lie between 0 and 1.',
    practice: question('After reading 3/5 of a 50-page target, how many pages remain?', ['20', '30', '40'], 0, 'Two fifths remain: 50 ÷ 5 × 2 = 20 pages.'),
  },
  '1/5': {
    strategy: section('Another method: one of five equal percentages', 'Five equal shares must add to 100%. Divide 100 by 5 to see that each share is 20%, then divide that percentage by 100 to get the decimal.', '100% ÷ 5 = 20%; 20/100 = 0.2'),
    application: section('Put it to work: grouping cards', 'One fifth of 35 cards is 7 cards. If 7 cards are selected, the ratio is 7/35, which simplifies back to 1/5.', '35 ÷ 5 = 7; 7/35 = 1/5'),
    caution: '0.2 is two tenths, not two hundredths. The decimal 0.02 represents 2%, which is ten times smaller than 20%.',
    practice: question('Which percentage matches 0.2?', ['2%', '20%', '200%'], 1, 'Multiply the decimal by 100: 0.2 × 100 = 20.'),
  },
  '3/4': {
    strategy: section('Another method: subtract a quarter', 'Three quarters is one whole minus one quarter. Once you know a quarter is 25%, subtraction gives the result without performing long division.', '3/4 = 1 − 1/4; 100% − 25% = 75%'),
    application: section('Put it to work: forty-five minutes', 'Forty-five minutes is three quarters of a 60-minute hour. Reducing 45/60 by a factor of 15 reveals the fraction; the missing 15 minutes is the last quarter.', '45/60 = 3/4; 60 × 3/4 = 45'),
    caution: 'To convert 0.75 to a percentage, multiply by 100 once. Multiplying twice would incorrectly give 7,500%.',
    practice: question('What fraction of an hour is 45 minutes?', ['3/5', '3/4', '4/5'], 1, 'Use 60 minutes as the whole, then reduce 45/60 by dividing both parts by 15.'),
  },
  '1/8': {
    strategy: section('Another method: halve three times', 'An eighth comes from halving a whole, then halving the half, then halving the quarter. The same sequence works with decimals and percentages.', '1 → 0.5 → 0.25 → 0.125; 100% → 50% → 25% → 12.5%'),
    application: section('Put it to work: equal lengths', 'Cutting a 24 cm strip into eight equal pieces gives pieces 3 cm long. Each 3 cm piece is 12.5% of the original length, even though its length is not 12.5 cm.', '24 ÷ 8 = 3 cm; 3/24 = 1/8'),
    caution: '1/8 is not 0.18: the digits of the numerator and denominator do not become decimal places. Check by multiplying 0.125 by 8 to recover 1.',
    practice: question('Which multiplication checks the decimal for 1/8?', ['0.18 × 8 = 1', '0.125 × 8 = 1', '0.8 × 8 = 1'], 1, 'Division and multiplication undo one another. The correct quotient must multiply by 8 to produce 1.'),
  },
};

const equivalentContexts: Record<string, { title: string; text: string; factor: number; target: number; mistake: string }> = {
  '13/17': { title: 'Preserve a score when the scale doubles', text: 'A score of 13 out of 17 can be written as 26 out of 34 on a doubled scale. Both the achieved score and the maximum must be scaled; changing only the maximum would describe a different performance.', factor: 2, target: 51, mistake: '13/17 is already simplified. Neither number shares a factor above 1, so reducing it does not produce a smaller integer pair.' },
  '11/17': { title: 'Scale a small sample to a larger comparison', text: 'Suppose 11 of 17 equally sized samples meet a condition. A mathematically equivalent ratio with three times as many parts is 33 of 51. This scales the ratio; it does not predict what a new real-world sample will contain.', factor: 3, target: 68, mistake: '11/17 and 13/17 have the same denominator but different numerators. They are different shares, not equivalent forms.' },
  '11/13': { title: 'Read the missing share as well', text: 'When 11 of 13 parts are selected, 2 parts remain. On a scale four times as large, 44 of 52 are selected and 8 remain. Both the selected and missing shares stay consistent.', factor: 4, target: 39, mistake: 'Changing 11/13 to 12/14 by adding one changes the share. The new cross-products are 154 and 156, which do not match.' },
  '8/9': { title: 'Compare near-whole quantities', text: 'Eight ninths is only one ninth short of a whole. On a scale with five times as many pieces, 40 of 45 pieces are selected and five are missing. Bigger numerator and denominator values do not imply a bigger fraction.', factor: 5, target: 27, mistake: '40/45 is not greater than 8/9. Each of its pieces is smaller, and the selected proportion is unchanged.' },
  '4/7': { title: 'Keep a mixture ratio while scaling', text: 'If four of seven equal measures in a mixture are one ingredient, a batch three times as large uses 12 of 21 measures of that ingredient. The denominator counts the whole mixture, including every ingredient.', factor: 3, target: 35, mistake: 'Four measures of one ingredient plus seven of another give a share of 4/11, not 4/7. Identify the whole before scaling.' },
  '1/7': { title: 'Split one day into smaller units', text: 'One day out of a seven-day week is one seventh. Counting half-days instead gives 2 out of 14. Counting quarter-days gives 4 out of 28. The chosen duration stays fixed while the unit becomes smaller.', factor: 2, target: 28, mistake: '1/7 has a repeating decimal. Comparing rounded decimal displays can hide a small difference; integer cross-products provide an exact check.' },
  '7/9': { title: 'Change the unit without changing the length', text: 'A strip with seven of nine equal sections shaded can be subdivided into four smaller pieces per section. There are then 28 shaded pieces out of 36, with the same shaded length.', factor: 4, target: 27, mistake: '7/9 and 9/7 are reciprocals. Reversing the two numbers changes a proper fraction into a value greater than one.' },
  '2/9': { title: 'Find a useful shared scale', text: 'Writing two ninths using 45 equal parts makes it easy to compare with a fraction whose denominator is 45. Each ninth contains five of these smaller parts, so two ninths contain ten.', factor: 5, target: 27, mistake: 'Do not add the scale factor to the numerator: moving from denominator 9 to 45 requires multiplying by 5, not adding 5.' },
  '3/4': { title: 'Match a measuring cup scale', text: 'A three-quarter-cup amount can be read as six eighths of a cup. If your scale uses twelfths, the same amount is nine twelfths. Choose the equivalent form that matches the available markings.', factor: 2, target: 12, mistake: '3/4 and 6/8 both exceed one half by the same amount. Counting the larger numerator alone gives the wrong comparison.' },
  '5/7': { title: 'Use equivalent fractions when adding', text: 'To add five sevenths and one third, rewrite both with denominator 21. Five sevenths becomes 15/21 and one third becomes 7/21. Equivalence prepares the fractions for addition without altering either value.', factor: 3, target: 28, mistake: 'Adding 5/7 and 1/3 does not give 6/10. Once the denominators match, add the numerators and keep the common denominator.' },
  '2/3': { title: 'Connect thirds to a twelve-piece model', text: 'If each third is split into four smaller pieces, a whole contains twelve pieces and two thirds covers eight of them. This gives a visual reason why 2/3 and 8/12 have the same value.', factor: 4, target: 15, mistake: '2/3 and 4/9 are not equivalent: the numerator was doubled while the denominator was tripled. Both parts need the same factor.' },
  '1/3': { title: 'Use an exact fraction for three equal shares', text: 'A third of a fifteen-piece set contains five pieces. The exact ratio is 5/15. Three of these groups recover the full set, avoiding the shortfall produced by treating a third as exactly 33%.', factor: 5, target: 12, mistake: '0.33 is close to 1/3 but is not an exact equivalent. A finite rounded decimal should not replace an exact fraction in an equivalence proof.' },
};

function fractionLesson(article: Article): Lesson {
  const n = article.numerator!, d = article.denominator!;
  const key = `${n}/${d}`;
  if (article.kind === 'percent') {
    const extension = percentExtensions[key];
    if (!extension) throw new Error(`Missing conversion lesson: ${key}`);
    return {
      sections: [extension.strategy, extension.application],
      mistakes: [{ title: 'Watch the units and rounding', explanation: extension.caution }, { title: 'Check against a whole', explanation: `${n}/${d} is positive and less than 1, so its decimal must lie between 0 and 1 and its percentage between 0% and 100%. This quick bound catches reversed division and misplaced decimal points.` }],
      questions: [extension.practice, question(`Which calculation converts ${n}/${d} directly to a percentage?`, [`(${n} ÷ ${d}) ÷ 100`, `(${n} ÷ ${d}) × 100`, `(${d} ÷ ${n}) × 100`], 1, `Divide the selected parts by the total parts, then scale that ratio to 100. Work from ${n}/${d} itself so a rounded intermediate decimal does not change the answer.`)],
      tool: { kind: 'conversion', title: 'Try this fraction yourself', description: 'The starting values match this guide. Change either whole number to update the decimal, percentage and method immediately.', fields: [field('n', 'Numerator', n), field('d', 'Denominator', d)], toolLink: `/tools/percentage-calculator/?${new URLSearchParams({ mode: 'ratio', first: String(n), second: String(d) })}#calculator` },
      sources: [references.decimal, references.percent],
    };
  }
  const context = equivalentContexts[key];
  if (!context) throw new Error(`Missing equivalent-fraction lesson: ${key}`);
  const factor = context.target / d, targetNumerator = n * factor;
  return {
    sections: [section(context.title, context.text, `${n}/${d} = (${n} × ${context.factor}) / (${d} × ${context.factor}) = ${n * context.factor}/${d * context.factor}`), section(`Another method: solve for a denominator of ${context.target}`, `Start from the requested denominator instead of guessing multipliers. Divide ${context.target} by ${d} to find the scale factor ${factor}, then apply it to the numerator. You can check the result in reverse by dividing both parts of the new fraction by ${factor}.`, `${context.target} ÷ ${d} = ${factor}; ${n} × ${factor} = ${targetNumerator}; ${targetNumerator}/${context.target} = ${n}/${d}`)],
    mistakes: [{ title: 'An error to watch for in this example', explanation: context.mistake }, { title: 'Zero is not a valid multiplier', explanation: 'Multiplying both parts by zero produces 0/0, which is undefined. Negative multipliers are mathematically valid, but the generator uses positive multipliers to keep denominators easy to read.' }],
    questions: [question(`Complete the equivalent fraction: ${n}/${d} = ?/${context.target}.`, [String(n + factor), String(targetNumerator), String(n)], 1, `The denominator is multiplied by ${factor}, so the numerator must be ${n} × ${factor} = ${targetNumerator}.`), question(`Is ${n + 1}/${d + 1} equivalent to ${n}/${d}?`, ['Yes, because both numbers increased by one.', 'No, because the cross-products differ.', 'Only when the numerator is smaller.'], 1, `${n} × ${d + 1} = ${n * (d + 1)}, while ${n + 1} × ${d} = ${(n + 1) * d}. Since the products differ, the fractions differ.`)],
    tool: { kind: 'equivalent', title: 'Generate and compare equivalent fractions', description: 'Start with the fraction in this guide, then change either part or the number of examples. Results update immediately.', fields: [field('n', 'Numerator', n), field('d', 'Denominator', d), field('count', 'Examples (1–10)', 3)], toolLink: `/tools/equivalent-fractions/?${new URLSearchParams({ numerator: String(n), denominator: String(d), count: '3' })}#calculator` },
    sources: [references.equivalent],
  };
}

const quadraticFields = (a: number, b: number, c: number) => [field('a', 'a: coefficient of x²', a), field('b', 'b: coefficient of x', b), field('c', 'c: constant', c)];
const algebraLessons: Record<string, Lesson> = {
  'remainder-theorem': {
    sections: [
      section('A sign-sensitive example: divide by x + 3', 'The theorem uses a divisor written as x − r. For x + 3, the value of r is −3. With P(x) = 2x² − x + 4, substitute the negative value using parentheses, then evaluate the square before the other operations.', 'P(−3) = 2(−3)² − (−3) + 4 = 18 + 3 + 4 = 25'),
      section('A second method: use synthetic division', 'Use the coefficients 2, −1, 4 and the value −3. Bring down 2, multiply by −3 and add to −1 to obtain −7. Multiply −7 by −3 and add to 4 to obtain 25. The last number is the remainder; the first two form the quotient.', '2x² − x + 4 = (x + 3)(2x − 7) + 25'),
    ],
    mistakes: [{ title: 'Using the sign printed in the divisor', explanation: 'For x + 3, evaluate P(−3), not P(3). Find the value that makes the divisor zero.' }, { title: 'Confusing a remainder with a root', explanation: 'P(r) is always the remainder for division by x − r. It identifies a root only when that remainder is zero.' }],
    questions: [question('For P(x) = x² + 3x + 2, what is the remainder after division by x − 2?', ['0', '8', '12'], 2, 'Substitute 2: 2² + 3(2) + 2 = 4 + 6 + 2 = 12.'), question('Which value should you substitute when the divisor is x + 4?', ['4', '−4', '0'], 1, 'Write x + 4 as x − (−4). The divisor is zero at x = −4.')],
    tool: { kind: 'division', title: 'Explore a quadratic remainder', description: 'For P(x) = ax² + bx + c divided by x − r, change the integer coefficients or r. This example shows both synthetic division and the substitution check.', fields: [...quadraticFields(1, 3, 2), field('x', 'r in the divisor x − r', 2)] },
    sources: [references.division],
  },
  'dividing-polynomials-by-binomials': {
    sections: [section('Work an example with a nonzero remainder', 'Divide 2x² − x + 4 by x + 3. The leading quotient term is 2x. Subtract 2x(x + 3) to leave −7x + 4, then subtract −7(x + 3). A constant 25 remains, which has lower degree than the divisor.', '(2x² − x + 4)/(x + 3) = 2x − 7 + 25/(x + 3), for x ≠ −3'), section('A second method: synthetic division', 'For a monic divisor x − r, synthetic division performs the same coefficient operations more compactly. Here r = −3. It gives quotient coefficients 2 and −7, with remainder 25. Multiplying the result back is an algebraic check, not just a numerical spot check.', '(x + 3)(2x − 7) + 25 = 2x² − x + 4')],
    mistakes: [{ title: 'Dropping the remainder', explanation: 'The quotient alone is not the whole rational expression when the remainder is nonzero. Include remainder/divisor.' }, { title: 'Subtracting only the leading term', explanation: 'Distribute the subtraction across the entire product. Subtracting 2x² + 6x means subtracting both 2x² and 6x.' }],
    questions: [question('What is the quotient of (x² + 5x + 6) ÷ (x + 2)?', ['x + 2', 'x + 3', 'x + 6'], 1, 'Expand (x + 2)(x + 3) to recover x² + 5x + 6.'), question('If P(x) = (x − 1)(x + 4) + 3, what is the remainder when dividing by x − 1?', ['1', '3', '4'], 1, 'The identity already has the form dividend = divisor × quotient + remainder. The final constant is 3.')],
    tool: { kind: 'division', title: 'Try the division with different coefficients', description: 'Enter a quadratic dividend ax² + bx + c and a monic divisor x − r. Whole-number inputs are supported from −10,000 to 10,000.', fields: [...quadraticFields(1, 5, 6), field('x', 'r in the divisor x − r', -2)] },
    sources: [references.division],
  },
  'factor-polynomials': {
    sections: [section('Choose the method before guessing factors', 'For 2x² − 18, a common factor of 2 comes first. The expression inside the brackets is then a difference of squares. Factoring in this order makes the pattern visible and ensures the constant factor is retained.', '2x² − 18 = 2(x² − 9) = 2(x − 3)(x + 3)'), section('A second route for a quadratic: split and group', 'For x² − x − 6, the desired pair has product −6 and sum −1. The pair is 2 and −3. Split the middle term, then group terms that share the same bracket. Expanding the final factors checks both the sign and the constant.', 'x² + 2x − 3x − 6 = x(x + 2) − 3(x + 2) = (x − 3)(x + 2)')],
    mistakes: [{ title: 'Matching only the product', explanation: 'A pair must satisfy both conditions. For x² + 5x + 6, 1 and 6 multiply to 6 but add to 7, so they do not work.' }, { title: 'Assuming every quadratic has integer factors', explanation: 'x² + x + 1 has no integer factor pair. State the number system and method instead of inventing factors.' }],
    questions: [question('Which factorization is correct for x² − x − 6?', ['(x − 2)(x + 3)', '(x − 3)(x + 2)', '(x − 6)(x + 1)'], 1, 'The constants must sum to −1 and multiply to −6: −3 + 2 = −1 and (−3)(2) = −6.'), question('What should you take out first from 6x² + 9x?', ['3x', '6x', '9'], 0, '3x divides both terms: 6x² + 9x = 3x(2x + 3).')],
    tool: { kind: 'factor', title: 'Find integer factors of a monic quadratic', description: 'Explore x² + bx + c. Change b and c to see whether an integer factor pair exists. This example does not factor arbitrary higher-degree polynomials.', fields: [field('b', 'b: coefficient of x', 5), field('c', 'c: constant', 6)] },
    sources: [references.factor, references.polynomial],
  },
  'polynomial-definition-and-example-types-of-polynomial': {
    sections: [section('Simplify before naming the polynomial', 'Terms that cancel should not be counted. In 3x² + 2x − 3x² + 7, the quadratic terms cancel, leaving two terms and degree one. Classifying the unsimplified list would give the wrong degree.', '3x² + 2x − 3x² + 7 = 2x + 7: a linear binomial'), section('A second check: inspect the exponents', 'The number of terms and the degree answer different questions. x⁴ + 1 has two terms but degree four. A nonzero constant has degree zero; the zero polynomial has no highest nonzero power, so this guide treats its degree as undefined.', 'x⁴ + 1: 2 terms, degree 4; 7: 1 term, degree 0; 0: degree undefined')],
    mistakes: [{ title: 'Reading a coefficient as the degree', explanation: 'In 9x², the coefficient is 9 and the degree is 2. Degree comes from the power of the variable.' }, { title: 'Counting a zero term', explanation: '0x² + 3x + 1 has degree 1. Writing a zero coefficient does not create a quadratic term.' }],
    questions: [question('What is the degree of 0x² + 3x + 1?', ['0', '1', '2'], 1, 'The x² coefficient is zero. The highest surviving power is x¹.'), question('Which expression is not a polynomial in x?', ['x² + 1', '7', '1/x + 2'], 2, '1/x is x to the power −1. Polynomial powers must be nonnegative integers.')],
    tool: { kind: 'classify', title: 'Change the coefficients, then classify', description: 'Explore ax² + bx + c. Try setting a coefficient to zero and watch the term count and degree change.', fields: quadraticFields(3, -2, 7) },
    sources: [references.polynomial],
  },
  'basic-algebra-formula': {
    sections: [section('Work backward through an equation', 'For 3(x + 2) = 21, divide both sides by 3 before subtracting 2. This reverses the order in which the operations were applied to x. Each operation affects both sides, so equality is preserved.', '3(x + 2) = 21 → x + 2 = 7 → x = 5'), section('A second method: expand first', 'Distribute 3 to every term to get 3x + 6 = 21. Subtract 6 from both sides, then divide by 3. This route reaches the same solution and provides an opportunity to check the expansion rule.', '3x + 6 = 21 → 3x = 15 → x = 5; check: 3(5 + 2) = 21')],
    mistakes: [{ title: 'Omitting the middle term of a square', explanation: '(x + 3)² is x² + 6x + 9. The product contains two cross-terms, each equal to 3x.' }, { title: 'Dividing by a coefficient that might be zero', explanation: 'The formula x = (c − b)/a assumes a ≠ 0. When a is zero, check whether the remaining statement is true or false.' }],
    questions: [question('Solve 4x + 3 = 19.', ['x = 4', 'x = 5.5', 'x = 16'], 0, 'Subtract 3 to obtain 4x = 16, then divide by 4.'), question('Which expansion of (x + 3)² is correct?', ['x² + 9', 'x² + 3x + 9', 'x² + 6x + 9'], 2, 'Multiply (x + 3)(x + 3): the two 3x terms add to 6x.')],
    tool: { kind: 'linear', title: 'Solve and check your own linear equation', description: 'The starting equation matches this guide. Edit it to immediately update the algebra steps and substitution check. Use one variable x to the first power.', fields: [{ name: 'equation', label: 'Equation in x', value: '4x + 3 = 19', equation: true }], toolLink: `/tools/equation-solver/?${new URLSearchParams({ equation: '4x + 3 = 19' })}#calculator` },
    sources: [references.equation],
  },
  'algebraic-fractions': {
    sections: [section('Keep the original domain after cancellation', 'The expression (x² − 9)/(x + 3) factors into (x − 3)(x + 3)/(x + 3). Cancelling the common factor gives x − 3 only when x is not −3. At that excluded value, the original expression is still undefined.', '(x² − 9)/(x + 3) = x − 3, for x ≠ −3'), section('A second check: substitute an allowed value', 'At x = 5, the original expression is (25 − 9)/8 = 2 and the simplified expression is 5 − 3 = 2. This checks the arithmetic at one value. The factorization, rather than a single numerical match, is what proves equality throughout the permitted domain.', 'At x = 5: 16/8 = 2. At x = −3: the original denominator is 0.')],
    mistakes: [{ title: 'Cancelling across addition', explanation: '(x + 3)/x is not 3. The x in the numerator is a term, not a factor of the entire numerator.' }, { title: 'Forgetting restrictions when dividing', explanation: 'A divisor fraction must itself be nonzero. Keep restrictions from the original denominators as well as any new restriction created by taking a reciprocal.' }],
    questions: [question('Simplify (x² − 4)/(x + 2), keeping the original restriction.', ['x − 2, with x ≠ −2', 'x − 2 for every x', 'x + 2, with x ≠ 2'], 0, 'Factor x² − 4 as (x − 2)(x + 2), and keep x ≠ −2 from the original denominator.'), question('Does checking one allowed value prove two expressions are identical?', ['Yes', 'No; a general algebraic argument is also needed.', 'Only if that value is positive.'], 1, 'Two different expressions can coincide at one value. Factorization or another general identity is needed for proof.')],
    tool: { kind: 'rational', title: 'Compare before and after cancellation', description: 'Explore (x² − k²)/(x + k) at an integer value of x. Try x = −k to see why the original restriction matters.', fields: [field('k', 'k in (x² − k²)/(x + k)', 2), field('x', 'Value of x', 5)] },
    sources: [references.rational],
  },
  'algebraic-expressions-types-operations-and-examples': {
    sections: [section('Substitute a negative value carefully', 'For P(x) = 2x² − 3x + 1 at x = −2, put parentheses around each substituted value. The square of −2 is positive, and multiplying −3 by −2 also gives a positive number.', 'P(−2) = 2(−2)² − 3(−2) + 1 = 8 + 6 + 1 = 15'), section('A second method: use a nested expression', 'The same polynomial can be written as (2x − 3)x + 1. Substituting −2 gives (−4 − 3)(−2) + 1, again 15. This form offers a separate arithmetic route without changing the polynomial.', '2x² − 3x + 1 = (2x − 3)x + 1; (−7)(−2) + 1 = 15')],
    mistakes: [{ title: 'Dropping parentheses around a negative value', explanation: '(−2)² is 4, whereas −2² means −(2²), or −4. Parentheses preserve the value being substituted.' }, { title: 'Adding unlike powers', explanation: '3x² + 2x cannot be combined into 5x³. Only terms with the same variable part and exponent combine by addition.' }],
    questions: [question('Evaluate x² + 2x at x = −3.', ['−15', '3', '15'], 1, 'Use (−3)² + 2(−3) = 9 − 6 = 3.'), question('Simplify 4x + 3y − x + 2y.', ['3x + 5y', '8xy', '5x + 3y'], 0, 'Combine x terms separately from y terms: (4 − 1)x + (3 + 2)y.')],
    tool: { kind: 'evaluate', title: 'Substitute a value into a quadratic expression', description: 'Change a, b, c or x in ax² + bx + c. Compare direct substitution with the nested form. Inputs are whole numbers between −10,000 and 10,000.', fields: [...quadraticFields(1, 2, 0), field('x', 'Value of x', -3)] },
    sources: [references.polynomial],
  },
};

export function getLesson(article: Article): Lesson {
  if (article.kind !== 'algebra') return fractionLesson(article);
  const lesson = algebraLessons[article.slug];
  if (!lesson) throw new Error(`Missing algebra lesson: ${article.slug}`);
  return lesson;
}
