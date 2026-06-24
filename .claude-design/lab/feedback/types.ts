export interface FeedbackComment {
  id: string;
  variantId: string;
  selector: string;
  elementDescription: string;
  comment: string;
}

export interface LabFeedback {
  targetName: string;
  comments: FeedbackComment[];
  overallDirection: string;
}
