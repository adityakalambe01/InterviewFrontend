export const ChallengeEnum = {
  status: {
    default: 'Not-Assigned',
    started: 'In-Progress',
    ended: 'Completed',
    options: ['Not-Assigned', 'In-Progress', 'Completed'],
  },
  score: {
    default: 'Not Attempted',
    options: [
      'Not Attempted',
      'Partial Solution',
      'Completed',
      'Outstanding',
      'Excellent',
    ],
  },
};
