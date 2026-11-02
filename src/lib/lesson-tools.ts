import { convertFraction, generateEquivalentFractions, solveLinearEquation, type ToolResult } from './math-tools.ts';

export type LessonToolKind = 'conversion' | 'equivalent' | 'linear' | 'division' | 'factor' | 'classify' | 'rational' | 'evaluate';
export interface LessonToolConfig {
  kind: LessonToolKind;
  title: string;
  description: string;
  fields: { name: string; label: string; value: string; equation?: boolean }[];
  toolLink?: string;
}

function integer(text: string, label: string): number {
  if (!/^[+-]?\d+$/.test(text.trim()) || Math.abs(Number(text)) > 10000) throw new Error(`${label}: enter a whole number between −10,000 and 10,000.`);
  return Number(text);
}
function polynomial(a: number, b: number, c: number): string {
  const terms = [[a, 'x²'], [b, 'x'], [c, '']] as const;
  let text = '';
  for (const [coefficient, variable] of terms) {
    if (!coefficient) continue;
    const amount = variable && Math.abs(coefficient) === 1 ? '' : Math.abs(coefficient);
    text += `${text ? coefficient < 0 ? ' − ' : ' + ' : coefficient < 0 ? '−' : ''}${amount}${variable}`;
  }
  return text || '0';
}
const bracket = (constant: number) => `(x${constant ? ` ${constant < 0 ? '−' : '+'} ${Math.abs(constant)}` : ''})`;

export function calculateLesson(kind: LessonToolKind, values: Record<string, string>): ToolResult {
  if (kind === 'conversion') return convertFraction(values.n, values.d);
  if (kind === 'equivalent') return generateEquivalentFractions(values.n, values.d, values.count);
  if (kind === 'linear') return solveLinearEquation(values.equation);
  const read = (name: string) => integer(values[name] ?? '', name);
  if (kind === 'rational') {
    const k = read('k'), x = read('x');
    if (x === -k) throw new Error(`The original denominator is zero at x = ${x}. This value is excluded even after cancelling.`);
    const numerator = x * x - k * k, denominator = x + k;
    return {
      label: 'Original and simplified values', answer: `${x - k} = ${x - k}`,
      summary: `For (x² − k²)/(x + k), keep x ≠ ${-k}. This example compares values; the factorization establishes the identity.`,
      steps: [
        { label: 'Factor the numerator as a difference of squares', expression: `x² − (${k})² = ${bracket(-k)}${bracket(k)}` },
        { label: 'Cancel the common factor only on the original domain', expression: `${bracket(-k)}${bracket(k)} / ${bracket(k)} = ${polynomial(0, 1, -k)}, x ≠ ${-k}` },
        { label: `Compare both expressions at x = ${x}`, expression: `${numerator}/${denominator} = ${x} − (${k}) = ${x - k}` },
      ],
    };
  }
  if (kind === 'factor') {
    const b = read('b'), c = read('c');
    const discriminant = b * b - 4 * c;
    const root = Math.sqrt(discriminant);
    if (discriminant < 0 || !Number.isInteger(root) || (b + root) % 2 !== 0) {
      return { label: 'Integer factor pairs', answer: 'No integer factor pair', summary: 'This example factors monic quadratics over the integers. A lack of integer factors does not rule out real or complex roots.', steps: [{ label: 'The two integers must add to b and multiply to c', expression: `p + q = ${b}; p × q = ${c}` }, { label: 'Check the discriminant', expression: `b² − 4c = ${discriminant}; no suitable integer pair` }] };
    }
    const p = (b + root) / 2, q = (b - root) / 2;
    return { label: 'Factored form', answer: `${bracket(p)}${bracket(q)}`, summary: 'For monic quadratics x² + bx + c with integer coefficients.', steps: [{ label: 'Find two integers with the required sum and product', expression: `${p} + (${q}) = ${b}; ${p} × (${q}) = ${c}` }, { label: 'Expand to check every coefficient', expression: `${bracket(p)}${bracket(q)} = ${polynomial(1, b, c)}` }] };
  }
  const a = read('a'), b = read('b'), c = read('c');
  const expression = polynomial(a, b, c);
  if (kind === 'classify') {
    const count = [a, b, c].filter(value => value !== 0).length;
    const degree = a ? 2 : b ? 1 : c ? 0 : null;
    const name = count ? ['', 'Monomial', 'Binomial', 'Trinomial'][count] : 'Zero polynomial';
    return { label: 'Type and degree', answer: `${name} · ${degree === null ? 'degree undefined' : `degree ${degree}`}`, summary: `After removing zero terms: ${expression}.`, steps: [{ label: 'Count the nonzero terms', expression: `${count} nonzero term${count === 1 ? '' : 's'}` }, { label: 'Look for the highest power with a nonzero coefficient', expression: degree === null ? 'The zero polynomial has no highest nonzero power.' : `Highest power: ${degree}` }] };
  }
  const x = read('x');
  const result = (a * x + b) * x + c;
  if (kind === 'evaluate') {
    return { label: `Value at x = ${x}`, answer: String(result), summary: `P(x) = ${expression}. Changing x changes the value, not the expression.`, steps: [{ label: 'Substitute with parentheses around the value', expression: `${a}(${x})² + (${b})(${x}) + (${c})` }, { label: 'Calculate powers before multiplying and adding', expression: `${a * x * x} + (${b * x}) + (${c}) = ${result}` }, { label: 'Check with the nested form (ax + b)x + c', expression: `((${a})(${x}) + (${b}))(${x}) + (${c}) = ${result}` }] };
  }
  const next = a * x + b;
  const quotient = polynomial(0, a, next);
  return { label: 'Quotient and remainder', answer: `Q(x) = ${quotient}; R = ${result}`, summary: `Divide P(x) = ${expression} by ${bracket(-x)}. Here the entered value is r in x − r.`, steps: [{ label: 'Bring down the leading coefficient', expression: `First quotient coefficient: ${a}` }, { label: 'Multiply by r, then add the next coefficient', expression: `(${a})(${x}) + (${b}) = ${next}` }, { label: 'Repeat to obtain the remainder', expression: `(${next})(${x}) + (${c}) = ${result}` }, { label: 'Check the polynomial identity', expression: `${expression} = ${bracket(-x)}(${quotient}) + (${result})` }, { label: 'Confirm with the remainder theorem', expression: `P(${x}) = ${result}` }] };
}
