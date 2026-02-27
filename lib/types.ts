// ─── Question Types ───
export type QuestionType =
  | 'multiple_choice'
  | 'checkbox'
  | 'short_text'
  | 'long_text'
  | 'scale'
  | 'dropdown'
  | 'date'
  | 'rating';

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options?: QuestionOption[];
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  ratingMax?: number;
  placeholder?: string;
}

// ─── Form ───
export type FormStatus = 'draft' | 'published' | 'closed';

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  status: FormStatus;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
  themeColor: string;
}

// ─── Responses / Stats ───
export interface FormResponse {
  id: string;
  formId: string;
  answers: Record<string, string | string[]>;
  submittedAt: string;
}

export interface QuestionStats {
  questionId: string;
  questionTitle: string;
  questionType: QuestionType;
  totalAnswers: number;
  distribution?: Record<string, number>;
  averageValue?: number;
}

export interface FormStats {
  formId: string;
  formTitle: string;
  totalResponses: number;
  completionRate: number;
  averageTimeSeconds: number;
  questionStats: QuestionStats[];
  responsesOverTime: { date: string; count: number }[];
}
