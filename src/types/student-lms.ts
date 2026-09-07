/**
 * The Law Kaksha - Full-Stack Student LMS & Mentorship Data Models
 * Mongoose Schemas, Redis Caching Keys, and Socket.io Event Contracts
 */

// =========================================================================
// 1. DATA MODELS & SCHEMAS (Mongoose / TypeScript)
// =========================================================================

export interface IUserModel {
  _id: string;
  name: string;
  email: string;
  rollNumber: string; // e.g. CRO-0689421
  phone?: string;
  targetExam: string;
  streakDays: number;
  lastActiveAt: Date;
  onboardingCompleted: boolean;
  avatarUrl?: string;
  role: "student" | "faculty" | "admin";
  createdAt: Date;
}

export interface IStudentProgressModel {
  userId: string;
  courseId: string;
  overallPercentage: number;
  totalMinutesSpent: number;
  lastWatchedLecture: {
    lectureId: string;
    chapterId: string;
    title: string;
    timestampSeconds: number;
    updatedAt: Date;
  };
  completedLectures: Array<{
    lectureId: string;
    completedAt: Date;
  }>;
  submittedAssignmentsCount: number;
  totalAssignmentsCount: number;
  refundEligibility: {
    isEligible: boolean;
    streakDaysMet: boolean;
    draftsSubmittedCount: number;
    targetDraftsCount: number;
    mcqAccuracyPercentage: number;
    examCountdownDays: number;
    claimStatus: "in_progress" | "eligible" | "claimed" | "ineligible";
  };
}

export interface IAssignmentSubmissionModel {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  assignmentId: string;
  title: string;
  chapterRef: string;
  problemStatement: string;
  submittedFileUrl: string;
  submittedFileName: string;
  submittedAt: Date;
  status: "pending_evaluation" | "evaluated" | "resubmission_requested";
  score?: number;
  maxScore: number;
  evaluatorName?: string;
  evaluatorComments?: string;
  audioFeedbackUrl?: string;
  rubricScores?: Array<{
    criterion: string;
    score: number;
    maxScore: number;
    comment: string;
  }>;
}

export interface ILegalClinicMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "mentor" | "system";
  text: string;
  statuteRef?: string;
  timestamp: Date;
  isDelivered?: boolean;
}

export interface ILegalClinicTicketModel {
  id: string;
  ticketNumber: string; // e.g. TKT-CA-LAW-8941
  studentId: string;
  studentName: string;
  subject: string;
  chapterRef: string;
  queryDetails: string;
  attachmentName?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "assigned" | "resolved";
  assignedMentor?: string;
  resolutionSummary?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface IInternshipJobModel {
  id: string;
  firmName: string;
  logoInitial: string;
  role: string;
  location: string;
  stipend: string;
  duration: string;
  requiredCompletionPercentage: number;
  isUnlocked: boolean;
  tags: string[];
  description: string;
  deadline: string;
  openings: number;
}

export interface ICertificateModel {
  certificateId: string; // e.g. LK-CERT-2026-CA-8921
  studentName: string;
  rollNumber: string;
  courseTitle: string;
  issueDate: string;
  grade: string;
  scorePercentage: number;
  verificationUrl: string;
  academicDirector: string;
  seniorFaculty: string;
}

// =========================================================================
// 2. REDIS CACHING KEY PATTERNS & TTL SPECS
// =========================================================================

export const REDIS_CACHE_KEYS = {
  userProgress: (userId: string) => `user:progress:${userId}`, // TTL: 900s (15 mins)
  refundStatus: (userId: string) => `user:refund_status:${userId}`, // TTL: 1800s (30 mins)
  liveAnnouncements: "announcements:feed:live", // TTL: 300s (5 mins)
  onlineMentors: "clinic:online_mentors", // TTL: 60s (1 min)
  internshipList: "career:internships:active", // TTL: 3600s (1 hr)
};

// =========================================================================
// 3. SOCKET.IO REAL-TIME EVENT CONTRACTS
// =========================================================================

export interface SocketEvents {
  // Client to Server
  join_clinic_room: (data: { studentId: string; studentName: string }) => void;
  send_doubt_message: (data: { studentId: string; message: string; statuteRef?: string }) => void;
  typing_start: (data: { studentId: string }) => void;
  typing_stop: (data: { studentId: string }) => void;
  submit_ticket: (ticket: Partial<ILegalClinicTicketModel>) => void;

  // Server to Client
  receive_doubt_message: (message: ILegalClinicMessage) => void;
  mentor_typing: (data: { mentorName: string; isTyping: boolean }) => void;
  ticket_status_updated: (data: { ticketId: string; newStatus: string }) => void;
  announcement_broadcast: (announcement: { id: string; title: string; type: string }) => void;
}
