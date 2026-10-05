/**
 * The Law Kaksha - Quizzes & Platform Leaderboard API Routes
 * Endpoints for quiz retrieval, timed evaluations, candidate submissions, and leaderboard rankings
 */

const express = require("express");
const router = express.Router();
const Database = require("../db/database");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

// -----------------------------------------------------------------------------
// Public / Student Endpoints
// -----------------------------------------------------------------------------

/**
 * GET /api/quizzes
 * Retrieve all active quizzes (Free challenges for all candidates + Enrolled mocks)
 */
router.get("/quizzes", (req, res) => {
  try {
    const quizzesTable = Database.table("quizzes");
    const { level, is_free } = req.query;

    let quizzes = quizzesTable.find((q) => q.status === "ACTIVE" || q.status === "UPCOMING");

    if (level) {
      quizzes = quizzes.filter((q) => (q.level || "").toLowerCase().includes(level.toLowerCase()));
    }

    if (is_free !== undefined) {
      const isFreeNum = is_free === "true" || is_free === "1" ? 1 : 0;
      quizzes = quizzes.filter((q) => q.is_free === isFreeNum);
    }

    // Sanitize questions to avoid leaking correct answers in list view
    const sanitized = quizzes.map((q) => {
      const { questions, ...meta } = q;
      return {
        ...meta,
        question_count: Array.isArray(questions) ? questions.length : 0,
      };
    });

    res.status(200).json({
      success: true,
      count: sanitized.length,
      quizzes: sanitized,
    });
  } catch (err) {
    console.error("[Quiz API] Error fetching quizzes:", err);
    res.status(500).json({ success: false, message: "Internal server error fetching quizzes." });
  }
});

/**
 * GET /api/quizzes/:id
 * Retrieve a single quiz with questions for taking the test
 */
router.get("/quizzes/:id", (req, res) => {
  try {
    const quizzesTable = Database.table("quizzes");
    const quiz = quizzesTable.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }

    // Hide correct_option_index and statutory explanations until submitted
    const safeQuestions = (quiz.questions || []).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      marks: q.marks || quiz.positive_marks || 2,
    }));

    res.status(200).json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        subtitle: quiz.subtitle,
        level: quiz.level,
        subject: quiz.subject,
        chapter: quiz.chapter,
        time_limit_minutes: quiz.time_limit_minutes,
        total_marks: quiz.total_marks,
        positive_marks: quiz.positive_marks || 2,
        negative_marks: quiz.negative_marks || 0.5,
        is_free: quiz.is_free,
        status: quiz.status,
        question_count: safeQuestions.length,
        questions: safeQuestions,
      },
    });
  } catch (err) {
    console.error("[Quiz API] Error fetching quiz details:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

/**
 * POST /api/quizzes/:id/submit
 * Evaluate candidate answers, compute score, save attempt and return breakdown
 */
router.post("/quizzes/:id/submit", (req, res) => {
  try {
    const quizzesTable = Database.table("quizzes");
    const attemptsTable = Database.table("quiz_attempts");
    const usersTable = Database.table("users");

    const quiz = quizzesTable.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }

    const { answers = {}, candidate_name, student_id, user_id, time_taken_seconds = 0 } = req.body;

    const positiveMarks = Number(quiz.positive_marks) || 2;
    const negativeMarks = Number(quiz.negative_marks) || 0.5;

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;

    const questionBreakdown = (quiz.questions || []).map((q) => {
      const selectedOption = answers[q.id];
      const isAttempted = selectedOption !== undefined && selectedOption !== null && selectedOption !== "";
      const isCorrect = isAttempted && Number(selectedOption) === Number(q.correct_option_index);

      let marksAwarded = 0;
      if (!isAttempted) {
        unattemptedCount++;
        marksAwarded = 0;
      } else if (isCorrect) {
        correctCount++;
        marksAwarded = positiveMarks;
      } else {
        incorrectCount++;
        marksAwarded = -negativeMarks;
      }

      totalScore += marksAwarded;

      return {
        id: q.id,
        question: q.question,
        options: q.options,
        selected_option: isAttempted ? Number(selectedOption) : null,
        correct_option: Number(q.correct_option_index),
        is_correct: isCorrect,
        is_attempted: isAttempted,
        marks_awarded: marksAwarded,
        bare_act_citation: q.bare_act_citation || "Companies Act, 2013 Statutory Framework",
        explanation: q.explanation || "Official answer determined according to statutory provisions.",
      };
    });

    // Score can't be negative in aggregate
    const finalScore = Math.max(0, Number(totalScore.toFixed(2)));
    const totalPossibleMarks = Number(quiz.total_marks) || (quiz.questions.length * positiveMarks);
    const accuracy = correctCount + incorrectCount > 0
      ? Number(((correctCount / (correctCount + incorrectCount)) * 100).toFixed(1))
      : 0;

    const resolvedName = candidate_name || (user_id ? usersTable.findById(user_id)?.name : "Candidate") || "Candidate";
    const resolvedStudentId = student_id || (user_id ? usersTable.findById(user_id)?.student_id : "LK-CANDIDATE") || "LK-CANDIDATE";

    // Create attempt record
    const attemptRecord = attemptsTable.insert({
      id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      quiz_id: quiz.id,
      quiz_title: quiz.title,
      user_id: user_id || "usr-guest",
      candidate_name: resolvedName,
      student_id: resolvedStudentId,
      score: finalScore,
      total_marks: totalPossibleMarks,
      accuracy: accuracy,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      unattempted_count: unattemptedCount,
      time_taken_seconds: Number(time_taken_seconds) || 0,
      answers: answers,
      created_at: new Date().toISOString(),
    });

    // Compute percentile ranking among all attempts for this quiz
    const allAttemptsForQuiz = attemptsTable.find((a) => a.quiz_id === quiz.id);
    const totalTakers = allAttemptsForQuiz.length;
    const lowerScores = allAttemptsForQuiz.filter((a) => a.score < finalScore).length;
    const percentile = totalTakers > 1
      ? Number(((lowerScores / (totalTakers - 1)) * 100).toFixed(1))
      : 99.0;

    res.status(200).json({
      success: true,
      result: {
        attempt_id: attemptRecord.id,
        quiz_id: quiz.id,
        quiz_title: quiz.title,
        score: finalScore,
        total_marks: totalPossibleMarks,
        accuracy: accuracy,
        percentile: Math.min(99.9, Math.max(10, percentile)),
        correct_count: correctCount,
        incorrect_count: incorrectCount,
        unattempted_count: unattemptedCount,
        time_taken_seconds: Number(time_taken_seconds) || 0,
        question_breakdown: questionBreakdown,
      },
    });
  } catch (err) {
    console.error("[Quiz API] Error evaluating quiz submission:", err);
    res.status(500).json({ success: false, message: "Internal server error evaluating quiz." });
  }
});

/**
 * GET /api/leaderboard
 * Platform Leaderboard Standings across daily challenges & practice tests
 */
router.get("/leaderboard", (req, res) => {
  try {
    const attemptsTable = Database.table("quiz_attempts");
    const quizzesTable = Database.table("quizzes");
    const { quiz_id, limit = 20 } = req.query;

    let attempts = attemptsTable.find();

    if (quiz_id) {
      attempts = attempts.filter((a) => a.quiz_id === quiz_id);
    }

    // Sort by Score DESC, then Time Taken ASC (faster completion wins tie-breakers)
    attempts.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.time_taken_seconds || 9999) - (b.time_taken_seconds || 9999);
    });

    const topRankers = attempts.slice(0, Number(limit)).map((item, index) => {
      const rank = index + 1;
      let badge = "Ranker";
      if (rank === 1) badge = "Rank #1 (Gold)";
      else if (rank === 2) badge = "Rank #2 (Silver)";
      else if (rank === 3) badge = "Rank #3 (Bronze)";
      else if (rank <= 10) badge = "Top 10 Platform";
      else if (rank <= 50) badge = "Exemption Tier";

      return {
        rank: rank,
        badge: badge,
        attempt_id: item.id,
        quiz_id: item.quiz_id,
        quiz_title: item.quiz_title || "Daily Legal Challenge",
        candidate_name: item.candidate_name,
        student_id: item.student_id,
        score: item.score,
        total_marks: item.total_marks,
        accuracy: item.accuracy,
        time_taken_seconds: item.time_taken_seconds,
        created_at: item.created_at,
      };
    });

    const totalParticipants = attempts.length;
    const averageScore = totalParticipants > 0
      ? Number((attempts.reduce((sum, a) => sum + a.score, 0) / totalParticipants).toFixed(1))
      : 0;
    const highestScore = totalParticipants > 0 ? attempts[0].score : 0;

    res.status(200).json({
      success: true,
      stats: {
        total_participants: totalParticipants,
        average_score: averageScore,
        highest_score: highestScore,
      },
      leaderboard: topRankers,
    });
  } catch (err) {
    console.error("[Leaderboard API] Error fetching leaderboard:", err);
    res.status(500).json({ success: false, message: "Internal server error fetching leaderboard." });
  }
});

// -----------------------------------------------------------------------------
// Admin Management Endpoints
// -----------------------------------------------------------------------------

/**
 * GET /api/admin/quizzes
 * Retrieve all quizzes with full question details and metrics
 */
router.get("/admin/quizzes", (req, res) => {
  try {
    const quizzesTable = Database.table("quizzes");
    const attemptsTable = Database.table("quiz_attempts");

    const quizzes = quizzesTable.find();
    const withStats = quizzes.map((q) => {
      const attempts = attemptsTable.find((a) => a.quiz_id === q.id);
      const avgScore = attempts.length > 0
        ? Number((attempts.reduce((s, a) => s + a.score, 0) / attempts.length).toFixed(1))
        : 0;

      return {
        ...q,
        attempts_count: attempts.length,
        average_score: avgScore,
      };
    });

    res.status(200).json({
      success: true,
      count: withStats.length,
      quizzes: withStats,
    });
  } catch (err) {
    console.error("[Admin Quiz API] Error listing quizzes:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

/**
 * POST /api/admin/quizzes
 * Create a new statutory quiz
 */
router.post("/admin/quizzes", (req, res) => {
  try {
    const quizzesTable = Database.table("quizzes");
    const {
      title,
      subtitle,
      level = "CA Intermediate Paper 2",
      subject = "Corporate & Other Laws",
      chapter = "Companies Act, 2013",
      time_limit_minutes = 15,
      positive_marks = 2,
      negative_marks = 0.5,
      is_free = 1,
      status = "ACTIVE",
      questions = [],
    } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one question are required.",
      });
    }

    const totalMarks = questions.length * Number(positive_marks);

    const newQuiz = quizzesTable.insert({
      id: `quiz-${Date.now()}`,
      title,
      subtitle: subtitle || `${questions.length} Objective Practice Questions with Bare Act citations`,
      level,
      subject,
      chapter,
      time_limit_minutes: Number(time_limit_minutes),
      total_marks: totalMarks,
      positive_marks: Number(positive_marks),
      negative_marks: Number(negative_marks),
      is_free: Number(is_free),
      status: status,
      questions: questions.map((q, idx) => ({
        id: q.id || `q-${idx + 1}`,
        question: q.question,
        options: q.options,
        correct_option_index: Number(q.correct_option_index),
        bare_act_citation: q.bare_act_citation || "Statutory Law Provision",
        explanation: q.explanation || "Correct answer derived according to model answers.",
      })),
      created_at: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      message: "Quiz created successfully.",
      quiz: newQuiz,
    });
  } catch (err) {
    console.error("[Admin Quiz API] Error creating quiz:", err);
    res.status(500).json({ success: false, message: "Internal server error creating quiz." });
  }
});

/**
 * PUT /api/admin/quizzes/:id
 * Update an existing quiz
 */
router.put("/admin/quizzes/:id", (req, res) => {
  try {
    const quizzesTable = Database.table("quizzes");
    const quiz = quizzesTable.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }

    const updates = { ...req.body };
    if (updates.questions && Array.isArray(updates.questions)) {
      const posMarks = updates.positive_marks ? Number(updates.positive_marks) : (quiz.positive_marks || 2);
      updates.total_marks = updates.questions.length * posMarks;
    }

    const updated = quizzesTable.update(quiz.id, updates);

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully.",
      quiz: updated,
    });
  } catch (err) {
    console.error("[Admin Quiz API] Error updating quiz:", err);
    res.status(500).json({ success: false, message: "Internal server error updating quiz." });
  }
});

/**
 * DELETE /api/admin/quizzes/:id
 * Delete a quiz
 */
router.delete("/admin/quizzes/:id", (req, res) => {
  try {
    const quizzesTable = Database.table("quizzes");
    const deleted = quizzesTable.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully.",
    });
  } catch (err) {
    console.error("[Admin Quiz API] Error deleting quiz:", err);
    res.status(500).json({ success: false, message: "Internal server error deleting quiz." });
  }
});

/**
 * GET /api/admin/attempts
 * List all student quiz attempts
 */
router.get("/admin/attempts", (req, res) => {
  try {
    const attemptsTable = Database.table("quiz_attempts");
    const attempts = attemptsTable.find();
    attempts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts: attempts,
    });
  } catch (err) {
    console.error("[Admin Quiz API] Error listing attempts:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
