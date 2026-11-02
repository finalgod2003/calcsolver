export const editorial = {
  author: 'CalcSolver',
  updated: '2026-10-13',
  updatedLabel: 'October 13, 2026',
  repository: 'https://github.com/finalgod2003/calcsolver',
  issues: 'https://github.com/finalgod2003/calcsolver/issues',
};

export function correctionUrl(page?: { title: string; url: string }): string {
  const query = new URLSearchParams({
    title: page ? `Math correction: ${page.title}` : 'CalcSolver feedback',
    body: [
      `Page: ${page?.url ?? '(paste the page URL)'}`,
      '',
      'Expression or passage:',
      '',
      'Expected result and reasoning (or a reference):',
      '',
      'Actual result or suggested correction:',
      '',
      'Steps to reproduce, device and browser (if relevant):',
      '',
      'Please keep personal or sensitive information out of this public report.',
    ].join('\n'),
  });
  return `${editorial.issues}/new?${query}`;
}
