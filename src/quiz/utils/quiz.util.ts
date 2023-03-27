import quizTypeSchema from '@quiz/schema/quiz.schema';
import QuizType from '@quiz/types/quiz.type';
import Ajv from 'ajv/dist/jtd';

const parseQuiz = (quizContent: string) => {
  const ajv = new Ajv();
  const parse = ajv.compileParser<QuizType>(quizTypeSchema);
  const quizType = parse(quizContent);

  if (quizType === undefined) {
    throw new Error(`Error at position ${parse.position}: ${parse.message}`);
  }

  return quizType;
};

export default parseQuiz;
