/**
 * IMPORTANT — read before wiring this up:
 *
 * This scoring curve is a simplified approximation I built for a 20-question
 * demo test. It is NOT derived from a real normed population sample, the way
 * an actual psychometric IQ test (e.g. WAIS, Raven's) would be. Treat any
 * score this produces as "for entertainment / self-insight", exactly like
 * the disclaimer already on your landing page says — not a clinical or
 * scientifically valid measurement.
 *
 * The curve assumes a standard IQ distribution (mean 100, SD 15) and maps
 * "9-10 correct out of 20" to roughly average (IQ ~100), scaling outward
 * from there. Percentiles are approximate, derived from that same
 * assumed normal distribution.
 */
 
export interface ScoreResult {
  correctAnswers: number;
  totalQuestions: number;
  iq: number;
  percentile: number;
  label: string;
}
 
/** Index `i` = score for someone who got exactly `i` answers correct (out of 20). */
const SCORE_TABLE: { iq: number; percentile: number }[] = [
  { iq: 70, percentile: 2 },    // 0 correct
  { iq: 74, percentile: 4 },    // 1
  { iq: 78, percentile: 7 },    // 2
  { iq: 82, percentile: 11 },   // 3
  { iq: 85, percentile: 16 },   // 4
  { iq: 88, percentile: 21 },   // 5
  { iq: 91, percentile: 27 },   // 6
  { iq: 94, percentile: 34 },   // 7
  { iq: 97, percentile: 42 },   // 8
  { iq: 100, percentile: 50 },  // 9
  { iq: 103, percentile: 58 },  // 10
  { iq: 106, percentile: 66 },  // 11
  { iq: 109, percentile: 73 },  // 12
  { iq: 112, percentile: 79 },  // 13
  { iq: 115, percentile: 84 },  // 14
  { iq: 118, percentile: 88 },  // 15
  { iq: 121, percentile: 92 },  // 16
  { iq: 125, percentile: 95 },  // 17
  { iq: 129, percentile: 97 },  // 18
  { iq: 134, percentile: 99 },  // 19
  { iq: 140, percentile: 99.6 }, // 20
];
 
function getLabel(iq: number): string {
  if (iq < 85) return 'Below Average';
  if (iq < 95) return 'Low Average';
  if (iq < 105) return 'Average';
  if (iq < 115) return 'High Average';
  if (iq < 125) return 'Above Average';
  if (iq < 135) return 'Superior';
  return 'Exceptional';
}
 
/**
 * Converts a raw correct-answer count into the demo IQ score, percentile,
 * and category label used on the results screen.
 */
export function scoreTest(correctAnswers: number, totalQuestions = 20): ScoreResult {
  const clamped = Math.max(0, Math.min(Math.round(correctAnswers), totalQuestions));
  const entry = SCORE_TABLE[clamped];
 
  return {
    correctAnswers: clamped,
    totalQuestions,
    iq: entry.iq,
    percentile: entry.percentile,
    label: getLabel(entry.iq),
  };
}
