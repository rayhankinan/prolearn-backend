import QuestionType from '@quiz/types/question.type';

interface QuizType {
  title: string;
  content: string;
  questions: QuestionType[];
}

export default QuizType;
