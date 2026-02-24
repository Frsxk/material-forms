import { Form, FormStats } from './types';

export const MOCK_FORMS: Form[] = [
  {
    id: 'demo',
    title: 'Quarterly Performance Review',
    description: 'Evaluate team performance and satisfaction for Q4 2025.',
    status: 'published',
    responseCount: 142,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2026-02-20T14:30:00Z',
    themeColor: '#6750A4',
    questions: [
      {
        id: 'q-001',
        type: 'multiple_choice',
        title: 'How would you rate your team\'s velocity this sprint?',
        required: true,
        options: [
          { id: 'o1', label: 'Exceptional — Above targets' },
          { id: 'o2', label: 'Stable — Meeting all targets' },
          { id: 'o3', label: 'Below expectations' },
          { id: 'o4', label: 'Significantly behind' },
        ],
      },
      {
        id: 'q-002',
        type: 'long_text',
        title: 'Describe the primary blockers encountered.',
        required: true,
        placeholder: 'Share specific blockers, challenges, and context...',
      },
      {
        id: 'q-003',
        type: 'scale',
        title: 'Work-life balance satisfaction?',
        required: false,
        scaleMin: 1,
        scaleMax: 5,
        scaleMinLabel: 'Very unsatisfied',
        scaleMaxLabel: 'Very satisfied',
      },
      {
        id: 'q-004',
        type: 'short_text',
        title: 'What is your primary role in the team?',
        required: true,
        placeholder: 'e.g. Frontend Engineer',
      },
      {
        id: 'q-005',
        type: 'rating',
        title: 'Rate the overall team communication.',
        required: false,
        ratingMax: 5,
      },
      {
        id: 'q-006',
        type: 'checkbox',
        title: 'Which tools does your team use regularly?',
        required: false,
        options: [
          { id: 'c1', label: 'Slack' },
          { id: 'c2', label: 'Jira' },
          { id: 'c3', label: 'Figma' },
          { id: 'c4', label: 'GitHub' },
          { id: 'c5', label: 'Notion' },
        ],
      },
    ],
  },
  {
    id: 'feedback-2',
    title: 'Customer Satisfaction Survey',
    description: 'Collect feedback on our latest product launch.',
    status: 'published',
    responseCount: 89,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-02-18T11:00:00Z',
    themeColor: '#006A6A',
    questions: [
      {
        id: 'q-101',
        type: 'rating',
        title: 'How satisfied are you with the product?',
        required: true,
        ratingMax: 5,
      },
      {
        id: 'q-102',
        type: 'long_text',
        title: 'Any additional comments?',
        required: false,
        placeholder: 'Tell us what you think...',
      },
    ],
  },
  {
    id: 'event-3',
    title: 'Team Offsite RSVP',
    description: 'RSVP and preferences for the Q1 team retreat.',
    status: 'closed',
    responseCount: 34,
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-02-01T16:00:00Z',
    themeColor: '#984061',
    questions: [
      {
        id: 'q-201',
        type: 'multiple_choice',
        title: 'Will you be attending?',
        required: true,
        options: [
          { id: 'a1', label: 'Yes, I will attend' },
          { id: 'a2', label: 'No, I cannot make it' },
          { id: 'a3', label: 'Maybe — need to confirm' },
        ],
      },
      {
        id: 'q-202',
        type: 'dropdown',
        title: 'Dietary preference',
        required: false,
        options: [
          { id: 'd1', label: 'No restrictions' },
          { id: 'd2', label: 'Vegetarian' },
          { id: 'd3', label: 'Vegan' },
          { id: 'd4', label: 'Halal' },
          { id: 'd5', label: 'Gluten-free' },
        ],
      },
    ],
  },
  {
    id: 'onboarding-4',
    title: 'New Hire Onboarding Feedback',
    description: 'Help us improve the onboarding experience.',
    status: 'draft',
    responseCount: 0,
    createdAt: '2026-02-15T12:00:00Z',
    updatedAt: '2026-02-22T09:00:00Z',
    themeColor: '#6750A4',
    questions: [
      {
        id: 'q-301',
        type: 'scale',
        title: 'How smooth was your onboarding process?',
        required: true,
        scaleMin: 1,
        scaleMax: 10,
        scaleMinLabel: 'Very rough',
        scaleMaxLabel: 'Seamless',
      },
    ],
  },
];

export const MOCK_STATS: FormStats = {
  formId: 'demo',
  totalResponses: 142,
  completionRate: 87.3,
  averageTimeSeconds: 245,
  questionStats: [
    {
      questionId: 'q-001',
      questionTitle: 'How would you rate your team\'s velocity this sprint?',
      questionType: 'multiple_choice',
      totalAnswers: 142,
      distribution: {
        'Exceptional — Above targets': 38,
        'Stable — Meeting all targets': 64,
        'Below expectations': 28,
        'Significantly behind': 12,
      },
    },
    {
      questionId: 'q-002',
      questionTitle: 'Describe the primary blockers encountered.',
      questionType: 'long_text',
      totalAnswers: 124,
    },
    {
      questionId: 'q-003',
      questionTitle: 'Work-life balance satisfaction?',
      questionType: 'scale',
      totalAnswers: 138,
      averageValue: 3.6,
      distribution: { '1': 8, '2': 18, '3': 34, '4': 48, '5': 30 },
    },
    {
      questionId: 'q-005',
      questionTitle: 'Rate the overall team communication.',
      questionType: 'rating',
      totalAnswers: 130,
      averageValue: 4.1,
      distribution: { '1': 3, '2': 8, '3': 22, '4': 45, '5': 52 },
    },
    {
      questionId: 'q-006',
      questionTitle: 'Which tools does your team use regularly?',
      questionType: 'checkbox',
      totalAnswers: 140,
      distribution: { 'Slack': 132, 'Jira': 98, 'Figma': 76, 'GitHub': 120, 'Notion': 88 },
    },
  ],
  responsesOverTime: [
    { date: '2026-02-14', count: 12 },
    { date: '2026-02-15', count: 28 },
    { date: '2026-02-16', count: 35 },
    { date: '2026-02-17', count: 22 },
    { date: '2026-02-18', count: 18 },
    { date: '2026-02-19', count: 14 },
    { date: '2026-02-20', count: 8 },
    { date: '2026-02-21', count: 5 },
  ],
};

export function getFormById(id: string): Form | undefined {
  return MOCK_FORMS.find((f) => f.id === id);
}

export function getStatsForForm(id: string): FormStats | undefined {
  if (id === 'demo') return MOCK_STATS;
  return undefined;
}
