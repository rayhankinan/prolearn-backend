import RatingEntity from '@rating/models/rating.model';
import PearsonMatrix from '@recommendation/type/pearson-matrix';
import PearsonTransform from '@recommendation/type/pearson-transform';

const pearsonMap = async (ratings: RatingEntity[]): Promise<PearsonMatrix> => {
  const similarityMatrix: PearsonMatrix = new Map<number, PearsonTransform>();

  for (const currentRating of ratings) {
    const currentUser = await currentRating.user;
    const currentCourse = await currentRating.course;

    if (!similarityMatrix[currentUser.id])
      similarityMatrix[currentUser.id] = new Map<number, number>();

    similarityMatrix[currentUser.id][currentCourse.id] = currentRating.rating;
  }

  return similarityMatrix;
};

export default pearsonMap;
