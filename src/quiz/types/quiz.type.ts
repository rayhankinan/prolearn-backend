import QuestionType from '@quiz/types/question.type';

type QuizType = {
  title: string;
  content: string;
  questions: QuestionType[];
};

export default QuizType;
