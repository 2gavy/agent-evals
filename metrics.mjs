// Pure calculations. Relevance labels and claim judgements come from fixtures, not an LLM.
export function retrievalMetrics(grades, relevantTotal, idealGrades, k = 3) {
  const top = grades.slice(0, k);
  const dcg = values => values.reduce((sum, grade, i) => sum + (2 ** grade - 1) / Math.log2(i + 2), 0);
  const ideal = dcg([...idealGrades].sort((a,b) => b-a).slice(0,k));
  const first = top.findIndex(g => g >= 2);
  return { ndcg: ideal ? dcg(top)/ideal : null, rr: first < 0 ? 0 : 1/(first+1),
    recall: relevantTotal ? top.filter(g => g >= 2).length/relevantTotal : null,
    precision: top.length ? top.filter(g => g >= 2).length/top.length : null };
}
export function ratio(checks) { return { passed: checks.filter(Boolean).length, total: checks.length,
  value: checks.length ? checks.filter(Boolean).length/checks.length : null }; }
export function answerMetrics(answer) {
  return { completeness: ratio(answer.requirements.map(x => x.pass)),
    correctness: ratio(answer.claims.map(x => x.correct)),
    groundedness: ratio(answer.claims.map(x => x.supported)),
    citationSupport: ratio(answer.claims.flatMap(x => x.citations.map(c => c.supports))),
    citationCoverage: ratio(answer.claims.map(x => x.citations.some(c => c.supports))),
    citationValidity: ratio(answer.claims.flatMap(x => x.citations.map(c => c.valid))) };
}
