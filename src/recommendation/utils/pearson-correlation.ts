import PearsonTransform from '@recommendation/type/pearson-transform';
import RatingBound from '@rating/type/rating-bound';

const pearsonCorrelation = (
  pearsonTransformA: PearsonTransform,
  pearsonTransformB: PearsonTransform,
): number => {
  const average = (RatingBound.MIN + RatingBound.MAX) / 2;

  let xy = 0;
  for (const keyA in pearsonTransformA) {
    for (const keyB in pearsonTransformB) {
      xy +=
        keyA === keyB
          ? (pearsonTransformA[keyA] - average) *
            (pearsonTransformB[keyB] - average)
          : 0;
    }
  }

  let x2 = 0;
  for (const keyA in pearsonTransformA) {
    x2 += (pearsonTransformA[keyA] - average) ** 2;
  }

  let y2 = 0;
  for (const keyB in pearsonTransformB) {
    y2 += (pearsonTransformB[keyB] - average) ** 2;
  }

  const correlation = x2 * y2 !== 0 ? xy / (x2 ** 0.5 * y2 ** 0.5) : 0;

  return correlation;
};

export default pearsonCorrelation;
