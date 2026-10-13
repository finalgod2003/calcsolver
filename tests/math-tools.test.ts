import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateFractions, generateEquivalentFractions, calculatePercentage, solveLinearEquation } from '../src/lib/math-tools.ts';

test('fraction operations return exact reduced answers, including large and signed values', () => {
  assert.equal(calculateFractions('1', '2', 'add', '1', '3').answer, '5/6');
  assert.equal(calculateFractions('1', '6', 'subtract', '5', '6').answer, '-2/3');
  assert.equal(calculateFractions('-2', '3', 'multiply', '9', '4').answer, '-3/2');
  assert.equal(calculateFractions('3', '4', 'divide', '2', '5').answer, '15/8');
  assert.equal(calculateFractions('1', '-2', 'add', '1', '2').answer, '0');
  assert.equal(calculateFractions('999999999999999999999999999999', '3', 'multiply', '3', '1').answer, '999999999999999999999999999999');
  assert.match(calculateFractions('1', '4', 'add', '1', '6').steps[0].expression, /3\/12 \+ \(2\/12\)/);
});

test('fractions reject zero denominators, division by zero and non-integers', () => {
  assert.throws(() => calculateFractions('1', '0', 'add', '1', '2'), /zero/i);
  assert.throws(() => calculateFractions('1', '2', 'divide', '0', '3'), /zero fraction/i);
  assert.throws(() => calculateFractions('1.2', '3', 'add', '1', '2'), /whole number/i);
  assert.throws(() => calculateFractions('', '3', 'add', '1', '2'), /whole number/i);
});

test('equivalents preserve the entered fraction and normalize a negative denominator', () => {
  const result = generateEquivalentFractions('6', '8', '3');
  assert.equal(result.answer, '3/4');
  assert.deepEqual(result.steps.map(step => step.expression), ['6/8 = 12/16', '6/8 = 18/24', '6/8 = 24/32']);
  assert.equal(generateEquivalentFractions('1', '-2', '1').steps[0].expression, '-1/2 = -2/4');
  assert.equal(generateEquivalentFractions('0', '7', '1').steps[0].expression, '0/7 = 0/14');
  for (const count of ['0', '11', '1.5', '']) assert.throws(() => generateEquivalentFractions('1', '2', count), /between 1 and 10/);
  assert.throws(() => generateEquivalentFractions('1', '0', '5'), /zero/i);
});

test('percentage tools distinguish amounts, ratios, changes and adjusted values', () => {
  assert.equal(calculatePercentage('of', '15', '200').answer, '30');
  assert.equal(calculatePercentage('ratio', '30', '200').answer, '15%');
  assert.equal(calculatePercentage('change', '80', '100').answer, '25%');
  assert.equal(calculatePercentage('change', '100', '80').answer, '-20%');
  assert.equal(calculatePercentage('change', '100', '100').answer, '0%');
  assert.equal(calculatePercentage('increase', '200', '10').answer, '220');
  assert.equal(calculatePercentage('decrease', '150', '20').answer, '120');
  assert.equal(calculatePercentage('of', '0.1', '0.2').answer, '0.0002');
  assert.equal(calculatePercentage('ratio', '1', '3').answer, '33.3333333333%');
});

test('percentage tools explain undefined and ambiguous inputs', () => {
  assert.throws(() => calculatePercentage('ratio', '5', '0'), /whole cannot be zero/i);
  for (const base of ['0', '-10']) assert.throws(() => calculatePercentage('change', base, '20'), /positive starting/i);
  assert.throws(() => calculatePercentage('decrease', '100', '-20'), /nonnegative/i);
  for (const invalid of ['', 'Infinity', '5%', '1e309']) assert.throws(() => calculatePercentage('of', invalid, '20'), /must be a number/i);
});

test('linear equations handle brackets, variables on both sides and exact fractional coefficients', () => {
  const cases = [
    ['2x + 3 = 11', 'x = 4'],
    ['3(x - 2) = x + 8', 'x = 7'],
    ['x/2 + 1/3 = 5/6', 'x = 1'],
    ['0.1x + 0.2 = 0.3', 'x = 1'],
    ['3x = 1', 'x = 1/3'],
    ['-(x + 2) = 4', 'x = -6'],
    ['2 × (X − 3) = 8', 'x = 7'],
    ['x/-2 = 3', 'x = -6'],
    ['2*(3x + (x-1)/2) = 20', 'x = 3'],
  ];
  for (const [equation, answer] of cases) {
    const result = solveLinearEquation(equation);
    assert.equal(result.answer, answer, equation);
    const [left, right] = result.steps.at(-1)!.expression.split(' = ');
    assert.equal(left, right, `Substitution check for ${equation}`);
  }
});

test('linear equations distinguish identities from contradictions', () => {
  assert.equal(solveLinearEquation('2(x + 1) = 2x + 2').answer, 'Infinitely many solutions');
  assert.equal(solveLinearEquation('2(x + 1) = 2x + 3').answer, 'No solution');
  assert.equal(solveLinearEquation('0x = 0').answer, 'Infinitely many solutions');
  assert.equal(solveLinearEquation('0x = 5').answer, 'No solution');
});

test('equation solver rejects unsupported syntax and preserves denominator restrictions', () => {
  for (const equation of ['x*x = 4', 'x^2 = 4', '1/x = 2', 'x/(x-x+2) = 1', 'y + 1 = 2', '2 3x = 6', 'x/0 = 2', 'x + = 2', '2(x+1 = 4', 'x = 1 = 2', '=2', 'x=', 'alert(1)=2']) {
    assert.throws(() => solveLinearEquation(equation), Error, equation);
  }
  assert.throws(() => solveLinearEquation('('.repeat(33) + 'x' + ')'.repeat(33) + '=1'), /nested/i);
  assert.throws(() => solveLinearEquation('x'.repeat(241)), /240/);
});
