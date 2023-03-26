const quizTypeSchema = {
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    questions: {
      elements: {
        properties: {
          content: { type: 'string' },
          options: {
            elements: {
              properties: {
                content: { type: 'string' },
                isCorrect: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  },
};

export default quizTypeSchema;
