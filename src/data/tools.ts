export const mathTools = [
  {
    slug: 'fraction-calculator', name: 'Fraction calculator', symbol: 'a/b',
    description: 'Add, subtract, multiply or divide fractions. Get an exact, simplified answer with the steps shown.',
    hint: 'Enter whole-number numerators and nonzero denominators. Negative and improper fractions work, too.',
  },
  {
    slug: 'equivalent-fractions', name: 'Equivalent fractions generator', symbol: '≡',
    description: 'Generate fractions with the same value and see how multiplying both parts keeps them equivalent.',
    hint: 'Enter a fraction, then choose how many equivalents to generate. Each uses a different whole-number multiplier.',
  },
  {
    slug: 'percentage-calculator', name: 'Percentage calculator', symbol: '%',
    description: 'Find a percentage of a number, compare two values, or work out percentage changes, increases and decreases.',
    hint: 'Choose your calculation and enter two values. Decimals and negative values are supported where the formula allows them.',
  },
  {
    slug: 'equation-solver', name: 'Step-by-step equation solver', symbol: 'x =',
    description: 'Solve a linear equation in x with exact answers, clear algebra steps and a substitution check.',
    hint: 'Supports one-variable linear equations, parentheses, decimals and fraction coefficients. Use x to the first power; keep x out of denominators.',
  },
] as const;

export type MathToolSlug = typeof mathTools[number]['slug'];
