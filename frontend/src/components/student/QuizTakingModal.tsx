"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  ChevronLeft,
  ChevronRight,
  Shield,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  X,
  Flame,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  marks: number;
}

interface QuizData {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  subject: string;
  chapter: string;
  time_limit_minutes: number;
  total_marks: number;
  positive_marks: number;
  negative_marks: number;
  is_free: number;
  question_count: number;
  questions: QuestionItem[];
}

interface QuestionBreakdown {
  id: string;
  question: string;
  options: string[];
  selected_option: number | null;
  correct_option: number;
  is_correct: boolean;
  is_attempted: boolean;
  marks_awarded: number;
  bare_act_citation: string;
  explanation: string;
}

export interface QuizResult {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  score: number;
  total_marks: number;
  accuracy: number;
  percentile: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  time_taken_seconds: number;
  question_breakdown: QuestionBreakdown[];
}

interface QuizTakingModalProps {
  quizId: string;
  candidateName: string;
  studentId: string;
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (result?: QuizResult) => void;
}

export function QuizTakingModal({
  quizId,
  candidateName,
  studentId,
  userId,
  isOpen,
  onClose,
  onComplete,
}: QuizTakingModalProps) {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [viewingSolution, setViewingSolution] = useState(false);

  // Fetch quiz details on open
  useEffect(() => {
    if (!isOpen || !quizId) return;

    let isMounted = true;
    setLoading(true);
    setResult(null);
    setAnswers({});
    setMarkedForReview({});
    setCurrentIndex(0);
    setViewingSolution(false);

    apiRequest(`/api/quizzes/${quizId}`).then((res) => {
      if (isMounted && res.success && res.data?.quiz) {
        setQuiz(res.data.quiz);
        setSecondsRemaining((res.data.quiz.time_limit_minutes || 15) * 60);
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, quizId]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || loading || result || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, loading, result, secondsRemaining]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (result) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const toggleMarkForReview = (questionId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting || !quiz) return;
    setIsSubmitting(true);

    const totalSeconds = (quiz.time_limit_minutes || 15) * 60;
    const timeTaken = totalSeconds - secondsRemaining;

    try {
      const res = await apiRequest(`/api/quizzes/${quiz.id}/submit`, {
        method: "POST",
        body: JSON.stringify({
          answers,
          candidate_name: candidateName,
          student_id: studentId,
          user_id: userId,
          time_taken_seconds: timeTaken,
        }),
      });

      if (res.success && res.data?.result) {
        setResult(res.data.result);
        if (onComplete) onComplete();
      }
    } catch (e) {
      console.error("Error submitting quiz:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = quiz?.questions[currentIndex];
  const isLastQuestion = quiz ? currentIndex === quiz.questions.length - 1 : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A192F]/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden flex flex-col text-[#0A192F]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0A192F] to-[#1E3A8A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold tracking-tight">
                {quiz?.title || "Statutory Legal Quiz"}
              </h3>
              <p className="text-xs text-blue-200">
                {quiz?.chapter || "Corporate & Other Laws"} • {quiz?.level || "CA Inter"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!result && !loading && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border ${
                  secondsRemaining < 120
                    ? "bg-rose-500/20 text-rose-300 border-rose-400/30 animate-pulse"
                    : "bg-white/10 text-emerald-300 border-white/20"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Loading statutory questions...</p>
            </div>
          ) : result && !viewingSolution ? (
            /* Result Screen */
            <div className="py-6 px-4 max-w-2xl mx-auto text-center space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Award className="w-10 h-10 text-amber-300" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 mb-2">
                  Platform Quiz Result
                </span>
                <h2 className="text-2xl font-black tracking-tight text-[#0A192F]">
                  Quiz Evaluation Completed!
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Candidate: <strong className="text-slate-800">{candidateName}</strong> ({studentId})
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">Score</p>
                  <p className="text-2xl font-black text-blue-900 mt-1">
                    {result.score} <span className="text-xs text-slate-400 font-normal">/ {result.total_marks}</span>
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Accuracy</p>
                  <p className="text-2xl font-black text-emerald-900 mt-1">{result.accuracy}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100">
                  <p className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">Percentile</p>
                  <p className="text-2xl font-black text-purple-900 mt-1">{result.percentile}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Time Taken</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{formatTime(result.time_taken_seconds)}</p>
                </div>
              </div>

              {/* Breakdown counts */}
              <div className="flex items-center justify-center gap-6 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle className="w-4 h-4" /> {result.correct_count} Correct (+{result.correct_count * (quiz?.positive_marks || 2)})
                </span>
                <span className="flex items-center gap-1.5 text-rose-600">
                  <XCircle className="w-4 h-4" /> {result.incorrect_count} Incorrect (-{(result.incorrect_count * (quiz?.negative_marks || 0.5)).toFixed(1)})
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <HelpCircle className="w-4 h-4" /> {result.unattempted_count} Unattempted
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => setViewingSolution(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0A192F] text-white text-xs font-bold hover:bg-[#1E3A8A] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Review Bare Act Solutions & Citations</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : viewingSolution && result ? (
            /* Solution Review View */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h4 className="text-base font-bold text-[#0A192F]">Statutory Bare Act Review & Model Solutions</h4>
                  <p className="text-xs text-slate-500">Detailed legal reasoning for each multiple choice option</p>
                </div>
                <button
                  onClick={() => setViewingSolution(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  Back to Summary
                </button>
              </div>

              <div className="space-y-6">
                {result.question_breakdown.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      q.is_correct
                        ? "bg-emerald-50/50 border-emerald-200"
                        : q.is_attempted
                        ? "bg-rose-50/50 border-rose-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0A192F] text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            q.is_correct
                              ? "bg-emerald-100 text-emerald-800"
                              : q.is_attempted
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {q.is_correct ? "Correct (+2.0)" : q.is_attempted ? "Incorrect (-0.5)" : "Unattempted (0.0)"}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {q.bare_act_citation}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-[#0A192F] leading-relaxed mb-4">
                      {q.question}
                    </p>

                    <div className="space-y-2 mb-4">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = q.selected_option === optIdx;
                        const isCorrect = q.correct_option === optIdx;

                        let style = "bg-white border-slate-200 text-slate-700";
                        if (isCorrect) {
                          style = "bg-emerald-100/70 border-emerald-400 text-emerald-950 font-semibold";
                        } else if (isChosen && !isCorrect) {
                          style = "bg-rose-100/70 border-rose-400 text-rose-950";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${style}`}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center text-[10px] font-bold">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </span>
                            {isCorrect && (
                              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Correct Answer
                              </span>
                            )}
                            {isChosen && !isCorrect && (
                              <span className="text-[11px] text-rose-700 font-bold flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" /> Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                      <p className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Statutory Rationale & Bare Act Analysis:
                      </p>
                      <p className="leading-relaxed text-slate-600">{q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : quiz && currentQ ? (
            /* Active Test Taking View */
            <div className="space-y-6">
              {/* Question Navigation Palette */}
              <div className="flex items-center gap-1.5 flex-wrap pb-4 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 mr-2">Question Palette:</span>
                {quiz.questions.map((q, idx) => {
                  const isAnswered = answers[q.id] !== undefined;
                  const isMarked = markedForReview[q.id];
                  const isCurrent = currentIndex === idx;

                  let btnBg = "bg-slate-100 text-slate-600 border-slate-200";
                  if (isCurrent) {
                    btnBg = "bg-[#0A192F] text-white border-[#0A192F] ring-2 ring-blue-500/30 font-bold";
                  } else if (isMarked) {
                    btnBg = "bg-amber-100 text-amber-800 border-amber-300 font-bold";
                  } else if (isAnswered) {
                    btnBg = "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-mono border transition-all ${btnBg}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Card */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Question {currentIndex + 1} of {quiz.questions.length}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Marks: <strong className="text-emerald-600">+{quiz.positive_marks}</strong> /{" "}
                    <strong className="text-rose-600">-{quiz.negative_marks}</strong>
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <p className="text-sm sm:text-base font-semibold text-[#0A192F] leading-relaxed">
                    {currentQ.question}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQ.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(currentQ.id, optIdx)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50 border-blue-600 text-blue-950 shadow-sm ring-1 ring-blue-600"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        {!result && quiz && currentQ && !loading && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              onClick={() => toggleMarkForReview(currentQ.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                markedForReview[currentQ.id]
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
              }`}
            >
              {markedForReview[currentQ.id] ? "Marked for Review" : "Mark for Review"}
            </button>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-full bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-60"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? "Evaluating..." : "Submit Quiz"}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                  className="px-5 py-2 rounded-full bg-[#0A192F] hover:bg-[#1E3A8A] text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
