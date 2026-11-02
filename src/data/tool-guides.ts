import type { MathToolSlug } from './tools';

interface ToolGuide {
  seoTitle: string;
  introduction: string;
  instructions: string[];
  formulas: { name: string; expression: string; note: string }[];
  examples: { title: string; steps: string[]; explanation: string }[];
  limits: string;
  questions: { question: string; answer: string }[];
  related: { title: string; path: string }[];
}

export const toolGuides: Record<MathToolSlug, ToolGuide> = {
  'fraction-calculator': {
    seoTitle: 'Fraction Calculator with Steps | CalcSolver',
    introduction: 'Use this fraction calculator to add, subtract, multiply or divide two fractions. Compare an exact answer in simplest form with its decimal value, and follow the method one step at a time.',
    instructions: [
      'Enter the numerator (top number) and denominator (bottom number) of each fraction.',
      'Choose addition, subtraction, multiplication or division, then select Calculate.',
      'Read the simplified fraction first. Use the decimal for an approximation, and the steps to check your work.',
    ],
    formulas: [
      { name: 'Add fractions', expression: 'a/b + c/d = (ad + bc) / bd', note: 'A common denominator gives the parts the same size. The calculator uses the least common denominator to keep intermediate numbers smaller.' },
      { name: 'Subtract fractions', expression: 'a/b − c/d = (ad − bc) / bd', note: 'Keep the common denominator and subtract the numerators in order.' },
      { name: 'Multiply fractions', expression: '(a/b) × (c/d) = ac / bd', note: 'Multiply the numerators together and the denominators together, then simplify.' },
      { name: 'Divide fractions', expression: '(a/b) ÷ (c/d) = (a/b) × (d/c)', note: 'Multiply by the reciprocal of the second fraction. Both denominators and the second numerator must be nonzero.' },
    ],
    examples: [
      { title: 'Adding fractions with different denominators', steps: ['1/2 + 1/3 = 3/6 + 2/6', '3/6 + 2/6 = 5/6'], explanation: 'Six is the least common denominator. Five sixths is already simplified because 5 and 6 share no factor greater than 1.' },
      { title: 'Dividing by a fraction', steps: ['3/4 ÷ 2/5 = 3/4 × 5/2', '3/4 × 5/2 = 15/8 = 1.875'], explanation: 'The exact answer is an improper fraction. As a mixed number, 15/8 is 1 7/8; a fraction can be greater than one.' },
      { title: 'Multiplying a negative fraction', steps: ['−2/3 × 9/4 = −18/12', '−18/12 = −3/2 = −1.5'], explanation: 'A negative times a positive is negative. Divide the numerator and denominator by their greatest common factor, 6.' },
    ],
    limits: 'Enter signed integers with up to 30 digits in each field. Denominators cannot be zero. Fraction answers are exact; decimal displays are rounded to 12 significant digits. Convert mixed numbers to improper fractions before entering them.',
    questions: [
      { question: 'Can I enter mixed numbers?', answer: 'Use an improper fraction. For example, 1 2/3 becomes (1 × 3 + 2)/3 = 5/3, so enter 5 as the numerator and 3 as the denominator. To enter −1 2/3, use −5/3.' },
      { question: 'How do I simplify a fraction?', answer: 'Divide the numerator and denominator by their greatest common factor. For example, 18/24 becomes 3/4 after dividing both by 6. This calculator simplifies the final answer automatically.' },
      { question: 'Why can I not divide by a zero fraction?', answer: 'A fraction such as 0/5 equals zero. Dividing by it would require a reciprocal with zero in the denominator, which is undefined.' },
      { question: 'Is the decimal result exact?', answer: 'The simplified fraction is exact. A decimal such as 5/6 = 0.8333… repeats indefinitely, so its displayed decimal is rounded. Keep the fraction when you need an exact result.' },
    ],
    related: [
      { title: 'Equivalent fractions for 3/4', path: '/what-is-equivalent-to-3-4-fraction/' },
      { title: '5/6 as a decimal and percent', path: '/5-6-as-a-percent-and-decimal/' },
    ],
  },
  'equivalent-fractions': {
    seoTitle: 'Equivalent Fractions Calculator & Generator | CalcSolver',
    introduction: 'Find equivalent fractions for any whole-number numerator and nonzero denominator. This calculator shows the simplest form and generates a list of equal fractions using a different multiplier for each one.',
    instructions: [
      'Enter the numerator and denominator of your fraction, such as 2 and 3.',
      'Choose between 1 and 10 equivalent fractions and select Generate fractions.',
      'Compare the simplest form with the generated list. Each line shows the multiplier applied to your original fraction.',
    ],
    formulas: [
      { name: 'Generate an equivalent fraction', expression: 'a/b = (a × k) / (b × k)', note: 'The denominator b and multiplier k must be nonzero. This generator uses whole-number multipliers from 2 onward.' },
      { name: 'Simplify a fraction', expression: 'a/b = (a ÷ g) / (b ÷ g)', note: 'Choose g as the greatest common factor of the numerator and denominator to get the simplest form.' },
      { name: 'Check two fractions', expression: 'a/b = c/d when a × d = b × c', note: 'Cross-multiplication checks equivalence exactly, provided neither denominator is zero.' },
    ],
    examples: [
      { title: 'Find three fractions equivalent to 2/3', steps: ['2/3 = (2 × 2)/(3 × 2) = 4/6', '2/3 = (2 × 3)/(3 × 3) = 6/9', '2/3 = (2 × 4)/(3 × 4) = 8/12'], explanation: 'Multiplying both parts by the same number is multiplying the value by 1. All four fractions represent the same share.' },
      { title: 'Start with a fraction that can be reduced', steps: ['6/8 = (6 ÷ 2)/(8 ÷ 2) = 3/4', '6/8 = 12/16 = 18/24 = 24/32'], explanation: 'The simplest form is 3/4. The generated list starts from the entered 6/8, so you can follow each multiplication without silently changing the starting pair.' },
      { title: 'Check whether 4/6 and 2/3 are equivalent', steps: ['4 × 3 = 12', '6 × 2 = 12'], explanation: 'The cross-products match, so the fractions are equivalent. Adding the same amount to both parts does not generally preserve a fraction: 2/3 and 3/4 are different.' },
    ],
    limits: 'Numerators and denominators accept signed integers with up to 30 digits. The denominator must be nonzero. The list contains 1 to 10 fractions, using multipliers 2 through 11 at most. Negative denominators are normalized so that the sign appears in the numerator.',
    questions: [
      { question: 'What are equivalent fractions?', answer: 'Equivalent fractions have the same value even though their numerators and denominators differ. For example, 1/2, 2/4 and 3/6 all represent one half.' },
      { question: 'Can I generate equivalent fractions for zero or a negative number?', answer: 'Yes. For example, 0/7 = 0/14 and −1/2 = −2/4. A zero denominator is never allowed.' },
      { question: 'How many equivalent fractions does a fraction have?', answer: 'Infinitely many: you can keep multiplying both parts by larger positive integers. This tool displays up to 10 at a time to keep the list readable.' },
      { question: 'Why does adding the same number not work?', answer: 'Multiplying both parts by the same nonzero number preserves their ratio. Adding 1 changes 2/3 into 3/4, and the cross-products, 8 and 9, do not match.' },
    ],
    related: [
      { title: 'Fractions equivalent to 2/3', path: '/what-is-equivalent-to-2-3-fraction/' },
      { title: 'Fractions equivalent to 1/3', path: '/what-is-equivalent-to-1-3-fraction/' },
      { title: 'Equivalent fractions guides', path: '/category/equivalent-fractions/' },
    ],
  },
  'percentage-calculator': {
    seoTitle: 'Percentage Calculator: Change, Increase & Decrease | CalcSolver',
    introduction: 'Calculate a percentage of a number, find what percent one number is of another, measure percentage change, or apply an increase or discount. Choose the question you want to answer before entering your values.',
    instructions: [
      'Choose one of the five calculation modes. The field labels change to match the question.',
      'Enter the two values without a percent sign or thousands separators. For 15%, enter 15; use a decimal point for values such as 2.5.',
      'Select Calculate to see the result and substituted formula. A percentage change returns a rate; Increase and Decrease return the adjusted amount.',
    ],
    formulas: [
      { name: 'A percentage of a number', expression: 'amount = (percentage / 100) × number', note: 'Use this to find the size of a discount, a share or a portion of a total.' },
      { name: 'A is what percent of B?', expression: 'percentage = (part / whole) × 100', note: 'Use this to express a score or a completed portion as a percentage. The whole cannot be zero.' },
      { name: 'Percentage change', expression: 'change (%) = (new − starting) / starting × 100', note: 'The starting value must be positive. Positive results show an increase; negative results show a decrease.' },
      { name: 'Increase by a percentage', expression: 'new amount = starting × (1 + percentage / 100)', note: 'The result includes the original amount plus the increase. Enter a nonnegative percentage.' },
      { name: 'Decrease by a percentage', expression: 'new amount = starting × (1 − percentage / 100)', note: 'The result is the amount left after the decrease. Enter a nonnegative percentage.' },
    ],
    examples: [
      { title: 'What is 15% of 200?', steps: ['15 / 100 × 200 = 30'], explanation: 'The answer is an amount, 30. If 30 out of 200 items are complete, the reverse calculation is 30 / 200 × 100 = 15%.' },
      { title: 'What is the percentage increase from 80 to 100?', steps: ['(100 − 80) / 80 × 100 = 25%'], explanation: 'The increase is 20 relative to a starting value of 80. In the reverse direction, from 100 to 80, the change is −20%, because the starting value is different.' },
      { title: 'What is the final amount after 20% off 150?', steps: ['150 × (1 − 20/100) = 120', 'Discount amount: 150 − 120 = 30'], explanation: 'Choose Decrease to get the final amount, 120. Choose A percentage of a number if you want only the discount amount, 30.' },
      { title: 'Increase 200 by 10%', steps: ['200 × (1 + 10/100) = 220'], explanation: 'The increase adds 20 to the starting amount. A later 10% decrease would use 220 as its base and give 198, so equal percentage increases and decreases do not cancel.' },
    ],
    limits: 'Values accept ordinary decimal notation, up to 40 characters. Do not include %, commas or scientific notation. Percentage change requires a positive starting value; ratio calculations require a nonzero whole. Decimal results are rounded to 12 significant digits.',
    questions: [
      { question: 'What is the difference between percent change and percentage points?', answer: 'Moving from 20% to 25% is an increase of 5 percentage points. Relative to the original rate, it is a 25% increase: (25 − 20) / 20 × 100 = 25%.' },
      { question: 'Can I calculate percentage change from zero?', answer: 'No. The usual formula divides by the starting value, so a starting value of zero makes it undefined. Report the absolute change instead.' },
      { question: 'Which mode should I use for a discount?', answer: 'Choose Decrease to find the amount after the discount. Choose A percentage of a number to find the amount saved. For 20% off 150, those answers are 120 and 30 respectively.' },
      { question: 'Can a percentage be greater than 100?', answer: 'Yes. For example, 150% of 200 is 300, and increasing 200 by 150% gives 500. A decrease greater than 100% produces a negative amount; check whether that makes sense for your situation.' },
    ],
    related: [
      { title: '1/4 as a decimal and percent', path: '/1-4-as-a-percent-and-decimal/' },
      { title: '3/5 as a decimal and percent', path: '/3-5-as-a-percent-and-decimal/' },
      { title: 'Fraction, decimal and percent guides', path: '/category/percent-and-decimal/' },
    ],
  },
  'equation-solver': {
    seoTitle: 'Linear Equation Solver with Steps | CalcSolver',
    introduction: 'Solve a linear equation in one variable, x, with exact fractional answers and a substitution check. Enter x on either or both sides, including parentheses, decimal coefficients and division by constants.',
    instructions: [
      'Enter both sides with one equals sign, such as 3(x − 2) = x + 8.',
      'Use x for the variable. Multiplication can be written as 2x, 2*x or 2(x + 1); write fractional coefficients as x/3 or (2/3)*x.',
      'Select Solve equation. Follow the simplification and balancing steps, then check that substituting the answer gives equal values on both sides.',
    ],
    formulas: [
      { name: 'Collect variable terms and constants', expression: 'ax + b = cx + d → (a − c)x = d − b', note: 'Expand parentheses first, combine like terms and perform the same operation on both sides.' },
      { name: 'Find a unique solution', expression: 'x = (d − b) / (a − c), when a ≠ c', note: 'Divide both sides by the remaining coefficient of x. The result may be an exact fraction.' },
      { name: 'Recognize special cases', expression: '0x = 0: every real x; 0x = nonzero: no solution', note: 'When the variable terms cancel, check whether the remaining statement is true or false.' },
    ],
    examples: [
      { title: 'Solve with x on both sides', steps: ['3(x − 2) = x + 8', '3x − 6 = x + 8', '2x = 14', 'x = 7; check: 3(7 − 2) = 7 + 8 = 15'], explanation: 'Expand the left side, subtract x from both sides, add 6 to both sides, then divide by 2.' },
      { title: 'Solve an equation with fractional coefficients', steps: ['x/2 + 1/3 = 5/6', 'x/2 = 5/6 − 1/3 = 1/2', 'x = 1; check: 1/2 + 1/3 = 5/6'], explanation: 'Keep the fractions exact while subtracting 1/3, then multiply both sides by 2. Enter (2/3)*x if the entire coefficient 2/3 multiplies x.' },
      { title: 'Identify an equation with no solution', steps: ['2(x + 1) = 2x + 3', '2x + 2 = 2x + 3', '0 = 1'], explanation: 'The final statement is false for every x, so there is no solution. Replacing the 3 with 2 would give 0 = 0 and infinitely many solutions.' },
    ],
    limits: 'Supports linear equations in x only, up to 240 characters. Powers such as x^2, multiple variables, inequalities, functions and x in a denominator are not supported. Use explicit parentheses to group fractional coefficients. Exact answers are retained; decimal displays are rounded to 12 significant digits.',
    questions: [
      { question: 'Can this solve quadratic equations or systems of equations?', answer: 'No. This tool handles one linear equation in x. Expressions such as x^2, products of variable terms, and equations with x and y need a different method.' },
      { question: 'What does infinitely many solutions mean?', answer: 'Both sides are equal for every real value of x. For example, 2(x + 1) = 2x + 2 simplifies to the same expression on both sides, leaving 0 = 0.' },
      { question: 'Why is x not allowed in a denominator?', answer: 'A denominator containing x can be zero for some values and changes the equation’s domain. This solver deliberately rejects those equations instead of losing their restrictions during simplification.' },
      { question: 'How do I check the answer?', answer: 'Substitute the reported value of x into both sides of the original equation. The calculator includes this check for a unique solution. For 2x + 3 = 11 and x = 4, both sides equal 11.' },
    ],
    related: [
      { title: 'Basic algebra formulas', path: '/basic-algebra-formula/' },
      { title: 'Algebraic expressions and like terms', path: '/algebraic-expressions-types-operations-and-examples/' },
      { title: 'Working with algebraic fractions', path: '/algebraic-fractions/' },
    ],
  },
};
