import PearsonTransform from '@recommendation/type/pearson-transform';

const pearsonCorrelation = (
  pearsonTransformA: PearsonTransform,
  pearsonTransformB: PearsonTransform,
): number => {
  const valuesA = Array.from(pearsonTransformA.values());
  const avgA =
    valuesA.length !== 0
      ? valuesA.reduce((total, value) => total + value, 0) / valuesA.length
      : 0;

  const valuesB = Array.from(pearsonTransformB.values());
  const avgB =
    valuesB.length !== 0
      ? valuesB.reduce((total, value) => total + value, 0) / valuesB.length
      : 0;

  let xy = 0;
  for (const keyA in pearsonTransformA) {
    for (const keyB in pearsonTransformA) {
      xy +=
        keyA === keyB
          ? (pearsonTransformA[keyA] - avgA) * (pearsonTransformA[keyB] - avgB)
          : 0;
    }
  }

  const x2 = valuesA.reduce((total, value) => total + (value - avgA) ** 2, 0);
  const y2 = valuesB.reduce((total, value) => total + (value - avgB) ** 2, 0);

  const correlation = x2 * y2 !== 0 ? xy / (x2 ** 0.5 * y2 ** 0.5) : 0;

  return correlation;
};

export default pearsonCorrelation;
