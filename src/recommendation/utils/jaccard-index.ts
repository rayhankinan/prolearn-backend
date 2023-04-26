import * as _ from 'lodash';

const jaccardIndex = (A: number[], B: number[]): number => {
  const intersection = _.intersection(A, B);
  const union = _.union(A, B);

  return intersection.length / union.length;
};

export default jaccardIndex;
