export interface ToolResult {
  label: string;
  answer: string;
  summary: string;
  steps: { label: string; expression: string }[];
  stepsTitle?: string;
}

interface Fraction { n: bigint; d: bigint }
export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide';
export type PercentageMode = 'of' | 'ratio' | 'change' | 'increase' | 'decrease';

const abs = (value: bigint) => value < 0n ? -value : value;
function gcd(a: bigint, b: bigint): bigint {
  a = abs(a); b = abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
function fraction(n: bigint, d = 1n): Fraction {
  if (!d) throw new Error('Cannot divide by zero. Use a nonzero denominator.');
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  n /= divisor; d /= divisor;
  if (abs(n).toString().length > 200 || d.toString().length > 200) {
    throw new Error('These numbers are too large. Try smaller values.');
  }
  return { n, d };
}
const add = (a: Fraction, b: Fraction) => fraction(a.n * b.d + b.n * a.d, a.d * b.d);
const subtract = (a: Fraction, b: Fraction) => fraction(a.n * b.d - b.n * a.d, a.d * b.d);
const multiply = (a: Fraction, b: Fraction) => fraction(a.n * b.n, a.d * b.d);
const divide = (a: Fraction, b: Fraction) => fraction(a.n * b.d, a.d * b.n);
const exact = (value: Fraction) => value.d === 1n ? String(value.n) : `${value.n}/${value.d}`;
const decimal = (value: Fraction) => String(Number((Number(value.n) / Number(value.d)).toPrecision(12)));
const zero = fraction(0n);
const one = fraction(1n);
const hundred = fraction(100n);

function integer(value: string, label: string): bigint {
  if (!/^[+-]?\d{1,30}$/.test(value.trim())) throw new Error(`${label} must be a whole number with up to 30 digits.`);
  return BigInt(value.trim());
}
function number(value: string, label: string): Fraction {
  const text = value.trim();
  if (text.length > 40 || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) {
    throw new Error(`${label} must be a number, such as 12, -3 or 0.5 (up to 40 characters).`);
  }
  const places = text.split('.')[1]?.length ?? 0;
  return fraction(BigInt(text.replace('.', '')), 10n ** BigInt(places));
}

export function calculateFractions(an: string, ad: string, operation: FractionOperation, bn: string, bd: string): ToolResult {
  const a = fraction(integer(an, 'First numerator'), integer(ad, 'First denominator'));
  const b = fraction(integer(bn, 'Second numerator'), integer(bd, 'Second denominator'));
  const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
  const steps: ToolResult['steps'] = [];
  let result: Fraction;
  if (operation === 'add' || operation === 'subtract') {
    const common = a.d / gcd(a.d, b.d) * b.d;
    const left = a.n * (common / a.d), right = b.n * (common / b.d);
    const numerator = operation === 'add' ? left + right : left - right;
    result = fraction(numerator, common);
    steps.push(
      { label: 'Use the least common denominator', expression: `${left}/${common} ${symbols[operation]} (${right}/${common})` },
      { label: 'Combine the numerators', expression: `(${left} ${symbols[operation]} (${right})) / ${common} = ${numerator}/${common}` },
    );
  } else if (operation === 'multiply') {
    result = multiply(a, b);
    steps.push({ label: 'Multiply the numerators and denominators', expression: `(${a.n} × ${b.n}) / (${a.d} × ${b.d}) = ${a.n * b.n}/${a.d * b.d}` });
  } else if (operation === 'divide') {
    if (!b.n) throw new Error('Cannot divide by a zero fraction. Change the second numerator.');
    result = divide(a, b);
    steps.push({ label: 'Multiply by the reciprocal of the second fraction', expression: `${exact(a)} × (${b.d}/${b.n}) = ${a.n * b.d}/${a.d * b.n}` });
  } else throw new Error('Choose an operation.');
  steps.push({ label: 'Reduce to simplest form', expression: `${exact(a)} ${symbols[operation]} (${exact(b)}) = ${exact(result)}` });
  return { label: 'Simplified answer', answer: exact(result), summary: `Decimal: ${decimal(result)} (rounded to 12 significant digits).`, steps };
}

export function generateEquivalentFractions(numerator: string, denominator: string, count: string): ToolResult {
  let n = integer(numerator, 'Numerator'), d = integer(denominator, 'Denominator');
  const simplest = fraction(n, d);
  if (d < 0n) { n = -n; d = -d; }
  if (!/^\d{1,2}$/.test(count) || Number(count) < 1 || Number(count) > 10) throw new Error('Choose between 1 and 10 equivalent fractions.');
  const steps = Array.from({ length: Number(count) }, (_, index) => {
    const factor = BigInt(index + 2);
    return { label: `Multiply the numerator and denominator by ${factor}`, expression: `${n}/${d} = ${n * factor}/${d * factor}` };
  });
  return { label: 'Simplest form', answer: exact(simplest), summary: `Each fraction below has the same value as ${n}/${d}.`, stepsTitle: `${count} equivalent fractions`, steps };
}

export function calculatePercentage(mode: PercentageMode, first: string, second: string): ToolResult {
  const a = number(first, 'First value'), b = number(second, 'Second value');
  let result: Fraction;
  let expression: string;
  let label = 'Answer';
  let suffix = '';
  if (mode === 'of') {
    result = divide(multiply(a, b), hundred);
    expression = `(${exact(a)} / 100) × (${exact(b)})`;
    label = `${decimal(a)}% of ${decimal(b)}`;
  } else if (mode === 'ratio') {
    if (!b.n) throw new Error('The whole cannot be zero when finding a percentage.');
    result = multiply(divide(a, b), hundred);
    expression = `(${exact(a)}) / (${exact(b)}) × 100`;
    label = 'Percentage'; suffix = '%';
  } else if (mode === 'change') {
    if (a.n <= 0n) throw new Error('Use a positive starting value for percentage change.');
    result = multiply(divide(subtract(b, a), a), hundred);
    expression = `((${exact(b)}) − (${exact(a)})) / (${exact(a)}) × 100`;
    label = result.n < 0n ? 'Percentage decrease' : result.n > 0n ? 'Percentage increase' : 'No change'; suffix = '%';
  } else if (mode === 'increase' || mode === 'decrease') {
    if (b.n < 0n) throw new Error('Use a nonnegative percentage; choose Increase or Decrease for the direction.');
    const rate = divide(b, hundred);
    result = multiply(a, mode === 'increase' ? add(one, rate) : subtract(one, rate));
    expression = `(${exact(a)}) × (1 ${mode === 'increase' ? '+' : '−'} (${exact(b)}) / 100)`;
    label = `Value after ${mode}`;
  } else throw new Error('Choose a percentage calculation.');
  return {
    label, answer: `${decimal(result)}${suffix}`, summary: 'Decimal results are rounded to 12 significant digits.',
    steps: [{ label: 'Substitute your values into the formula', expression }, { label: 'Calculate the result', expression: `${expression} = ${exact(result)}${suffix}` }],
  };
}

interface Linear { a: Fraction; b: Fraction }
const linearAdd = (left: Linear, right: Linear): Linear => ({ a: add(left.a, right.a), b: add(left.b, right.b) });
const scale = (value: Linear, factor: Fraction): Linear => ({ a: multiply(value.a, factor), b: multiply(value.b, factor) });

// Parse only arithmetic in x. Products of variable terms and variable denominators
// are rejected instead of silently changing an equation's domain.
function parseLinear(expression: string): Linear {
  const tokens: string[] = [];
  const pattern = /\s*(\d+(?:\.\d*)?|\.\d+|x|[()+\-*/])/y;
  let position = 0;
  while (position < expression.length) {
    if (!expression.slice(position).trim()) break;
    pattern.lastIndex = position;
    const match = pattern.exec(expression);
    if (!match) throw new Error('Use numbers, x, +, −, ×, ÷ and parentheses. Powers and other variables are not supported.');
    tokens.push(match[1]); position = pattern.lastIndex;
  }
  let cursor = 0;
  let depth = 0;
  const peek = () => tokens[cursor];
  function primary(): Linear {
    if (++depth > 32) throw new Error('Too many nested parentheses or signs. Simplify the equation.');
    try {
      const token = tokens[cursor++];
      if (token === '+' || token === '-') return scale(primary(), fraction(token === '-' ? -1n : 1n));
      if (token === '(') {
        const value = sum();
        if (tokens[cursor++] !== ')') throw new Error('Close every opening parenthesis.');
        return value;
      }
      if (token === 'x') return { a: one, b: zero };
      if (token && /^(?:\d|\.)/.test(token)) return { a: zero, b: number(token, 'Coefficient') };
      throw new Error('An expression is incomplete. Check the numbers, operators and parentheses.');
    } finally { depth--; }
  }
  function product(): Linear {
    let value = primary();
    while (peek() === '*' || peek() === '/' || peek() === '(' || peek() === 'x') {
      const operator = peek() === '*' || peek() === '/' ? tokens[cursor++] : '*';
      const start = cursor;
      const next = primary();
      if (operator === '/') {
        if (tokens.slice(start, cursor).includes('x')) throw new Error('Keep x out of denominators. This tool solves linear equations only.');
        value = scale(value, divide(one, next.b));
      } else {
        if (value.a.n && next.a.n) throw new Error('This is not a linear equation. Use x to the first power only.');
        value = linearAdd(scale(value, next.b), { a: multiply(value.b, next.a), b: zero });
      }
    }
    return value;
  }
  function sum(): Linear {
    let value = product();
    while (peek() === '+' || peek() === '-') {
      const operator = tokens[cursor++];
      value = linearAdd(value, scale(product(), fraction(operator === '+' ? 1n : -1n)));
    }
    return value;
  }
  const value = sum();
  if (cursor !== tokens.length) throw new Error('Check the expression. Separate numbers with an operator and balance parentheses.');
  return value;
}

function linearText(value: Linear): string {
  if (!value.a.n) return exact(value.b);
  const coefficient = value.a.n === value.a.d ? '' : value.a.n === -value.a.d ? '−' : exact(value.a);
  const constant = value.b.n ? ` ${value.b.n < 0n ? '−' : '+'} ${exact(fraction(abs(value.b.n), value.b.d))}` : '';
  return `${coefficient}x${constant}`;
}

export function solveLinearEquation(input: string): ToolResult {
  if (input.length > 240) throw new Error('Keep the equation under 240 characters.');
  const normalized = input.trim().toLowerCase().replaceAll('−', '-').replaceAll('×', '*').replaceAll('÷', '/');
  const sides = normalized.split('=');
  if (sides.length !== 2 || sides.some(side => !side.trim())) throw new Error('Enter both sides with one equals sign, for example 2x + 3 = 11.');
  const left = parseLinear(sides[0]), right = parseLinear(sides[1]);
  const coefficient = subtract(left.a, right.a), constant = subtract(right.b, left.b);
  const steps: ToolResult['steps'] = [
    { label: 'Expand brackets and combine like terms on each side', expression: `${linearText(left)} = ${linearText(right)}` },
    { label: `Subtract (${exact(right.a)})x from both sides`, expression: `${linearText({ a: coefficient, b: left.b })} = ${exact(right.b)}` },
    { label: `Subtract (${exact(left.b)}) from both sides`, expression: `${linearText({ a: coefficient, b: zero })} = ${exact(constant)}` },
  ];
  if (!coefficient.n) {
    return {
      label: 'Solution', answer: constant.n ? 'No solution' : 'Infinitely many solutions',
      summary: constant.n ? 'The equation reduces to a false statement.' : 'Both sides are equal for every real value of x.', steps,
    };
  }
  const solution = divide(constant, coefficient);
  const checkLeft = add(multiply(left.a, solution), left.b), checkRight = add(multiply(right.a, solution), right.b);
  steps.push(
    { label: `Divide both sides by ${exact(coefficient)}`, expression: `x = (${exact(constant)}) / (${exact(coefficient)}) = ${exact(solution)}` },
    { label: `Check by substituting x = ${exact(solution)} into both sides`, expression: `${exact(checkLeft)} = ${exact(checkRight)}` },
  );
  return { label: 'Solution for x', answer: `x = ${exact(solution)}`, summary: `Decimal value of x: ${decimal(solution)} (rounded to 12 significant digits).`, steps };
}
