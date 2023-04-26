import RatingEntity from '@rating/models/rating.model';
import PearsonMatrix from '@recommendation/type/pearson-matrix';

const pearsonMap = async (ratings: RatingEntity[]): Promise<PearsonMatrix> => {
  const similarityMatrix: PearsonMatrix = new Map();

  for (const currentRating of ratings) {
    const currentUser = await currentRating.user;
    const currentCourse = await currentRating.course;

    similarityMatrix[currentUser.id][currentCourse.id] = currentRating.rating;
  }

  return similarityMatrix;
};

export default pearsonMap;
