export const mathTools = [
  {
    slug: 'fraction-calculator', name: 'Fraction calculator', symbol: 'a/b',
    description: 'Add, subtract, multiply and divide fractions with steps. Get simplified exact answers, decimal results, worked examples and help with negative fractions.',
    hint: 'Enter whole-number numerators and nonzero denominators. Negative and improper fractions work, too.',
  },
  {
    slug: 'equivalent-fractions', name: 'Equivalent fractions generator', symbol: '≡',
    description: 'Find equivalent fractions and the simplest form of any fraction. Generate up to 10 equivalents with multipliers, examples and cross-multiplication checks.',
    hint: 'Enter a fraction, then choose how many equivalents to generate. Each uses a different whole-number multiplier.',
  },
  {
    slug: 'percentage-calculator', name: 'Percentage calculator', symbol: '%',
    description: 'Calculate percentages, percentage change, increases and discounts. Compare five formulas with steps and examples, including percent vs. percentage points.',
    hint: 'Choose your calculation and enter two values. Decimals and negative values are supported where the formula allows them.',
  },
  {
    slug: 'equation-solver', name: 'Linear equation solver with steps', symbol: 'x =',
    description: 'Solve linear equations in x with steps, exact fraction answers and a substitution check. Supports parentheses, decimals and variables on both sides.',
    hint: 'Supports one-variable linear equations, parentheses, decimals and fraction coefficients. Use x to the first power; keep x out of denominators.',
  },
] as const;

export type MathToolSlug = typeof mathTools[number]['slug'];
