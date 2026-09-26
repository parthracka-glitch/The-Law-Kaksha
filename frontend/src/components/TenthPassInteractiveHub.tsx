"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  BookOpen,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Brain,
  ShieldAlert,
  Award,
  Zap,
  ChevronRight,
  Flame,
  Scale,
  Users,
  Building,
  Check,
  X,
  Smile,
  Compass,
} from "lucide-react";
import { EnhancedSampleChapterModal } from "./EnhancedSampleChapterModal";

// =========================================================================
// 1. DATA: 5-STAGE ROADMAP FROM CLASS 10 TO CHARTERED ACCOUNTANT
// =========================================================================
interface RoadmapStage {
  step: number;
  stageName: string;
  ageRange: string;
  standardTitle: string;
  shortDesc: string;
  whatYouDo: string[];
  salaryOrStipend: string;
  mythBusted: string;
  kakshaSecret: string;
  badge: string;
  color: string;
}

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    step: 1,
    stageName: "Step 1",
    ageRange: "Age 15–16",
    standardTitle: "Class 10 Board Passed & Provisional ICAI Entry",
    shortDesc: "You don't have to wait for graduation! ICAI allows provisional CA Foundation registration right after your 10th board results.",
    whatYouDo: [
      "Register provisionally on the official ICAI portal with your 10th marksheet.",
      "Spend just 30 minutes/week exploring basic commercial & business concepts.",
      "Get familiar with everyday contracts (ordering food, buying phones, movie tickets).",
    ],
    salaryOrStipend: "Preparation Phase (Zero pressure, high curiosity)",
    mythBusted: "Myth: 'Do I need 95% in 10th math?' -> NO! CA Foundation math is simple business arithmetic, not complex calculus. Law requires logical thinking, not trigonometry!",
    kakshaSecret: "Our 'Junior Legal Eagle' visual comic guides decode laws as stories so 10th graders understand them before even starting Class 11.",
    badge: "Foundation Spark",
    color: "from-sky-500 to-blue-600",
  },
  {
    step: 2,
    stageName: "Step 2",
    ageRange: "Age 16–18",
    standardTitle: "Class 11 & 12 Commerce + CA Foundation Prep",
    shortDesc: "Double benefit: Your Class 11 & 12 school subjects (Accountancy, Economics & Business Studies) overlap 60% with CA Foundation!",
    whatYouDo: [
      "Master Indian Contract Act 1872 & Sale of Goods Act alongside school studies.",
      "Learn the art of solving real-life boardroom case scenarios.",
      "Practice 1-page visual flowcharts instead of memorizing 500-page books.",
    ],
    salaryOrStipend: "Foundation Stage (Building a 75+ exemption foundation)",
    mythBusted: "Myth: 'Will school grades drop if I start CA early?' -> Actually, students preparing for CA score HIGHER in 12th Commerce boards because their fundamentals become rock solid!",
    kakshaSecret: "All Law Kaksha Foundation notes use 1-page visual decision trees so you revise in 15 minutes before school exams.",
    badge: "School Synergy",
    color: "from-emerald-500 to-teal-600",
  },
  {
    step: 3,
    stageName: "Step 3",
    ageRange: "Age 18",
    standardTitle: "Clear CA Foundation (Right After 12th Boards)",
    shortDesc: "Appear in the June or December cycle right after your Class 12 boards. 4 papers, 400 marks total.",
    whatYouDo: [
      "Paper 1: Accounting (100 Marks)",
      "Paper 2: Business Laws (100 Marks) — Master with The Law Kaksha",
      "Paper 3: Quantitative Aptitude (100 Marks)",
      "Paper 4: Business Economics (100 Marks)",
    ],
    salaryOrStipend: "Qualified for CA Intermediate Direct Entry",
    mythBusted: "Myth: 'Is Paper 2 Law hard for beginners?' -> It's the most scoring paper if you write answers using the 5-Pillar Rule (Facts -> Law Section -> Analysis -> Verdict).",
    kakshaSecret: "Students using our 5-Pillar Model Answers average 68+ marks in Paper 2.",
    badge: "Milestone Cleared",
    color: "from-indigo-500 to-violet-600",
  },
  {
    step: 4,
    stageName: "Step 4",
    ageRange: "Age 19–21",
    standardTitle: "CA Intermediate & 2-Year Practical Articleship",
    shortDesc: "Clear 6 papers, then join top CA firms or Big 4 (EY, Deloitte, PwC, KPMG) to audit real multinational companies and earn monthly stipends!",
    whatYouDo: [
      "Master Corporate Law (Companies Act 2013 Sections 1–148) & Other Laws.",
      "Conduct real corporate audits, inspect secretarial board minutes, and analyze balance sheets.",
      "Earn a monthly articleship stipend (₹10,000 – ₹25,000/month) while studying!",
    ],
    salaryOrStipend: "₹1,20,000 – ₹3,00,000 / year (Articleship Stipend)",
    mythBusted: "Myth: 'Articleship is boring paperwork.' -> You are inside boardroom meetings analyzing multi-crore transactions and catching real fraud!",
    kakshaSecret: "Our Volume 1 & 2 Master Codices include past 10-attempt solved questions and ROC circulars for guaranteed corporate law exemptions.",
    badge: "Big 4 Exposure",
    color: "from-amber-500 to-orange-600",
  },
  {
    step: 5,
    stageName: "Step 5",
    ageRange: "Age 22–23",
    standardTitle: "CA Final Qualified & Convocation: Welcome to the Elite Club!",
    shortDesc: "Prefix 'CA' proudly before your name. One of India's most prestigious, recession-proof qualifications with global signing authority.",
    whatYouDo: [
      "Sign financial statements with statutory legal authority across India.",
      "Work as Chief Financial Officer (CFO), Investment Banker, Corporate Legal Advisor, or Forensic Auditor.",
      "Or launch your independent consultancy practice with corporate clients.",
    ],
    salaryOrStipend: "₹12,00,000 – ₹28,00,000+ Average Starting CTC",
    mythBusted: "Myth: 'Does it take 10 years to become a CA?' -> If you start right after 10th/12th, you can be a fully qualified Chartered Accountant by age 22 or 23!",
    kakshaSecret: "Lifetime alumni mentorship and direct corporate referral network for The Law Kaksha rankers.",
    badge: "Chartered Accountant 🏆",
    color: "from-emerald-600 to-cyan-600",
  },
];

// =========================================================================
// 2. DATA: "CRACK THE CASE" 1-MINUTE DETECTIVE GAME
// =========================================================================
interface CaseGame {
  id: string;
  title: string;
  act: string;
  sectionCode: string;
  story: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const CASES_DATA: CaseGame[] = [
  {
    id: "case-1",
    title: "Case 1: The ₹75,000 Gaming Laptop on Credit",
    act: "Indian Contract Act, 1872",
    sectionCode: "Section 11 (Capacity to Contract)",
    story: "16-year-old high school student Kabir buys a high-end gaming laptop worth ₹75,000 on credit from TechZone Store. Kabir signs an agreement promising to pay in full when he turns 18. Upon turning 18, Kabir refuses to pay, saying 'I spent all my money on games!' TechZone files a legal police complaint to recover ₹75,000.",
    question: "You are the Corporate Legal Advisor. Can TechZone legally enforce this contract against Kabir in an Indian court?",
    options: [
      {
        id: "A",
        text: "Yes! A promise is a promise, and Kabir signed the agreement.",
        isCorrect: false,
        explanation: "Incorrect! In Indian law, a minor's signature has zero legal value on commercial debt contracts.",
      },
      {
        id: "B",
        text: "No! An agreement with a minor is 'Void Ab Initio' (dead from the start) under Section 11 & the famous Mohori Bibee ruling.",
        isCorrect: true,
        explanation: "BULLSEYE! 🎉 You cracked it! Under Indian Contract Act 1872 (Section 11), minors cannot enter valid contracts. The landmark 1903 Privy Council case 'Mohori Bibee v. Dharmodas Ghose' established that minor contracts are void-from-the-beginning.",
      },
      {
        id: "C",
        text: "Only Kabir's school principal must pay the ₹75,000.",
        isCorrect: false,
        explanation: "Incorrect! School principals have no personal liability for a student's private gadget purchases.",
      },
    ],
  },
  {
    id: "case-2",
    title: "Case 2: The 30-Minute Free Pizza Challenge",
    act: "Indian Contract Act, 1872",
    sectionCode: "Section 8 (General Offer & Acceptance by Performance)",
    story: "CrustKing Pizza runs a nationwide billboard ad: 'Hot Pizza at your doorstep in 30 minutes, or your entire order is 100% FREE!' Riya orders ₹1,800 worth of pizza for a birthday party. The delivery boy arrives after 37 minutes. The restaurant manager says: 'That 30-minute billboard was just a marketing advertisement, not a binding legal contract! Pay ₹1,800 immediately.'",
    question: "Does Riya legally have to pay for the pizza?",
    options: [
      {
        id: "A",
        text: "No! The billboard was a General Offer, and by ordering under that condition, Riya formed a binding contract. The pizza is free!",
        isCorrect: true,
        explanation: "GENIUS! 🍕 Under Indian law (Carlill v. Carbolic Smoke Ball Co. principle), a general public offer with a performance condition becomes a binding contract when accepted. CrustKing broke their own express condition!",
      },
      {
        id: "B",
        text: "Yes, TV and billboard ads never have any legal value in India.",
        isCorrect: false,
        explanation: "False! Commercial public offers that induce customer action are legally enforceable promises.",
      },
      {
        id: "C",
        text: "Riya must pay 50% discount price as compensation.",
        isCorrect: false,
        explanation: "Incorrect! The express term was '100% Free' if late. There is no half-payment clause.",
      },
    ],
  },
  {
    id: "case-3",
    title: "Case 3: The Fraudster Behind 'FakeShield Pvt Ltd'",
    act: "Companies Act, 2013",
    sectionCode: "Principle of Lifting the Corporate Veil",
    story: "Mr. Shady registers a private company called 'SafeInvest Pvt Ltd'. He convinces 200 senior citizens to deposit ₹3 Crores promising 25% returns. Instead, he transfers all ₹3 Crores to his personal overseas bank account and buys luxury sports cars. When the company goes bust, he tells the court: 'A company is a separate legal person from its owners. You can seize the empty company bank account, but you cannot touch my personal sports cars!'",
    question: "Can the High Court judge seize Mr. Shady's personal sports cars and properties to repay the investors?",
    options: [
      {
        id: "A",
        text: "No, because a company has a separate legal personality from its director.",
        isCorrect: false,
        explanation: "Incorrect! Separate legal personality is a privilege, not a blanket shield for committing fraud.",
      },
      {
        id: "B",
        text: "Yes! The Court will 'Lift the Corporate Veil' to unmask the fraudster and hold him personally liable.",
        isCorrect: true,
        explanation: "MASTERMIND! ⚖️ When a company is used as a sham or cloak to commit fraud, the courts 'Lift the Corporate Veil' (Daimler Co. & Gilford Motor Co. precedents). The judge strips away company protection and seizes the fraudster's personal wealth!",
      },
      {
        id: "C",
        text: "The judge must forgive him because he registered with ROC.",
        isCorrect: false,
        explanation: "Incorrect! ROC registration does not grant immunity from criminal fraud.",
      },
    ],
  },
];

// =========================================================================
// 3. DATA: LEGAL JARGON BUSTER (SUPERPOWER DECODER FOR 10TH GRADER)
// =========================================================================
interface JargonItem {
  term: string;
  latinOrLegal: string;
  soundsLike: string;
  actualMeaning: string;
  analogy: string;
  category: "Contract" | "Company" | "Court";
}

const JARGON_LIST: JargonItem[] = [
  {
    term: "Void Ab Initio",
    latinOrLegal: "Latin Legal Maxim",
    soundsLike: "A magic spell from Harry Potter! 🪄",
    actualMeaning: "Dead from the very first second. Legally, it never existed at all.",
    analogy: "Like trying to pay with fake Monopoly play-money. It was invalid the moment you printed it.",
    category: "Contract",
  },
  {
    term: "Corporate Veil",
    latinOrLegal: "Companies Act Fundamental Doctrine",
    soundsLike: "A bridal veil or a superhero mask! 🦸‍♂️",
    actualMeaning: "An invisible legal wall that separates the company's debts from the owner's personal house & pocket money.",
    analogy: "Tony Stark wearing the Iron Man suit. Normally the suit takes the hits, but if Tony commits a crime, police arrest Tony himself!",
    category: "Company",
  },
  {
    term: "Caveat Emptor",
    latinOrLegal: "Sale of Goods Act, 1930",
    soundsLike: "A Roman gladiator battle cry! ⚔️",
    actualMeaning: "'Buyer Beware' — The customer must inspect goods before paying. Don't blame the seller later if you didn't check!",
    analogy: "If you buy second-hand sneakers from a flea market without checking for torn soles, you can't sue the seller tomorrow.",
    category: "Contract",
  },
  {
    term: "Ultra Vires",
    latinOrLegal: "Corporate Constitutional Law",
    soundsLike: "An ultra-powerful futuristic sci-fi laser! ⚡",
    actualMeaning: "'Beyond Legal Powers' — Doing an action that the company's constitution (MOA) never gave permission to do.",
    analogy: "If a school bus transport company suddenly tries to sell rocket engines, the agreement is 100% void because it is 'Ultra Vires'.",
    category: "Company",
  },
  {
    term: "Quorum",
    latinOrLegal: "Companies Act, 2013 (Section 103)",
    soundsLike: "A secret sci-fi council planet! 🪐",
    actualMeaning: "The minimum number of real humans required to be physically present before an official meeting can legally start.",
    analogy: "You need at least 4 friends to start a 4-player Ludo or Carrom match. If only 2 show up, the game cannot officially begin!",
    category: "Company",
  },
  {
    term: "Prospectus",
    latinOrLegal: "Companies Act, 2013 (Section 23)",
    soundsLike: "A magical gold prospector's telescope! 🔭",
    actualMeaning: "An official public invitation booklet issued by a company inviting ordinary people to invest money in their shares.",
    analogy: "Like a blockbuster movie trailer on YouTube! It shows why you should buy tickets, but if the trailer lies, the producer gets sued!",
    category: "Company",
  },
];

// =========================================================================
// 4. DATA: "IS CA RIGHT FOR ME?" 30-SECOND APTITUDE QUIZ
// =========================================================================
interface QuizQuestion {
  question: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    points: number;
    icon: string;
  }[];
}

const APTITUDE_QUIZ: QuizQuestion[] = [
  {
    question: "What kind of real-world challenges give you an adrenaline rush?",
    subtitle: "Select the one that feels most like you:",
    options: [
      { label: "Detective & Mystery Solving", description: "Finding loopholes, catching cheating, and figuring out who did what.", points: 30, icon: "🔍" },
      { label: "Big Business & Money Flow", description: "Understanding how companies like Tata, Reliance, and Apple manage billions.", points: 30, icon: "💼" },
      { label: "Elite Professional Status", description: "Having a prestigious, recession-proof degree with zero college dependency.", points: 30, icon: "🏆" },
      { label: "All of the Above!", description: "I want prestige, high income, and intellectual problem solving.", points: 35, icon: "🚀" },
    ],
  },
  {
    question: "How do you learn complicated topics best?",
    subtitle: "Be honest about what makes learning fun for you:",
    options: [
      { label: "Stories & Real Life Examples", description: "I remember concepts best when tied to interesting drama and case studies.", points: 25, icon: "📖" },
      { label: "Visual Flowcharts & Mindmaps", description: "Give me a 1-page visual diagram instead of a 20-page text dump!", points: 30, icon: "🗺️" },
      { label: "Solving Practice Questions", description: "Test my brain with mock situations and let me crack the answer.", points: 25, icon: "🧠" },
    ],
  },
  {
    question: "What is your current academic stage right now?",
    subtitle: "We tailor your exact starter roadmap based on this:",
    options: [
      { label: "Just Passed Class 10 (Age 15–16)", description: "Exploring commerce streams and curious about starting CA early.", points: 35, icon: "🎓" },
      { label: "In Class 11 or 12 Commerce", description: "Currently in school Commerce and want to crack CA Foundation in 1st attempt.", points: 35, icon: "📚" },
      { label: "Class 12 Passed / College 1st Year", description: "Ready to sit for the upcoming CA Foundation or Inter exam cycle.", points: 35, icon: "⚡" },
    ],
  },
];

// =========================================================================
// MAIN INTERACTIVE COMPONENT
// =========================================================================
export function TenthPassInteractiveHub() {
  const [activeTab, setActiveTab] = useState<"roadmap" | "game" | "jargon" | "quiz">("roadmap");
  const [selectedRoadmapStep, setSelectedRoadmapStep] = useState(0);
  const [ageSlider, setAgeSlider] = useState(16);

  // Detective Game State
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [solvedCases, setSolvedCases] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Jargon Filter
  const [jargonFilter, setJargonFilter] = useState<"All" | "Contract" | "Company">("All");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [sampleModalOpen, setSampleModalOpen] = useState(false);

  // Simulated CA timeline calculation
  const timelineSim = useMemo(() => {
    const startAge = ageSlider;
    return {
      foundationYear: 2026 + Math.max(0, 18 - startAge),
      interYear: 2026 + Math.max(0, 18 - startAge) + 1,
      finalYear: 2026 + Math.max(0, 18 - startAge) + 3,
      qualifiedAge: startAge + (18 - startAge > 0 ? (18 - startAge) + 4 : 4),
    };
  }, [ageSlider]);

  // Handle Detective Game Choice
  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(optId);
    setIsAnswerSubmitted(true);

    const currentCase = CASES_DATA[currentGameIndex];
    const chosen = currentCase.options.find((o) => o.id === optId);
    if (chosen?.isCorrect) {
      setScore((prev) => prev + 100);
      if (!solvedCases.includes(currentCase.id)) {
        setSolvedCases((prev) => [...prev, currentCase.id]);
      }
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const handleNextCase = () => {
    if (currentGameIndex < CASES_DATA.length - 1) {
      setCurrentGameIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handleResetGame = () => {
    setCurrentGameIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setSolvedCases([]);
  };

  // Handle Card Flip
  const toggleFlip = (term: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  // Handle Quiz selection
  const handleQuizSelect = (points: number) => {
    const updated = [...quizAnswers, points];
    setQuizAnswers(updated);
    if (quizStep < APTITUDE_QUIZ.length - 1) {
      setQuizStep((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
  };

  const filteredJargon = useMemo(() => {
    if (jargonFilter === "All") return JARGON_LIST;
    return JARGON_LIST.filter((j) => j.category === jargonFilter);
  }, [jargonFilter]);

  const activeStage = ROADMAP_STAGES[selectedRoadmapStep];

  return (
    <section id="tenth-pass-hub" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-sky-50/40 to-white relative overflow-hidden border-t border-slate-200/80">
      
      {/* Background Decorative Rings */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-sky-100/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Confetti Visual Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="relative w-full h-full overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  top: `${Math.random() * 60}%`,
                  left: `${Math.random() * 95}%`,
                  width: `${8 + Math.random() * 10}px`,
                  height: `${8 + Math.random() * 10}px`,
                  backgroundColor: ["#0284C7", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"][i % 5],
                  borderRadius: i % 2 === 0 ? "50%" : "2px",
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER: INNOVATIVE & INSPIRING FOR 10TH PASS STUDENTS             */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-100 via-sky-50 to-blue-100 border border-sky-200 text-[#0284C7] text-xs font-bold shadow-xs">
            <GraduationCap className="w-4 h-4 text-[#0284C7]" />
            <span>Class 10 &amp; 12 Pass Student Hub • Start CA Early</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-ping" />
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-4.5xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Think CA Law is Tough? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0284C7] to-blue-700 bg-clip-text text-transparent">
              It&apos;s Actually Real-Life Detective Work.
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            You don&apos;t need to wait for college! Under ICAI rules, you can register for CA Foundation right after Class 10. We decode dry law books into interactive cases, visual mindmaps, and 1-minute puzzles.
          </p>

          {/* 4 Interactive Feature Tabs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { id: "roadmap", label: "🗺️ 10th to CA Roadmap", desc: "5-Stage Career Ladder" },
              { id: "game", label: "🕵️‍♂️ Crack The Case! (Game)", desc: "1-Min Detective Mini-Game" },
              { id: "jargon", label: "⚡ Legal Jargon Buster", desc: "Scary Words Decoded" },
              { id: "quiz", label: "🎯 Am I Ready for CA?", desc: "30-Sec Aptitude Check" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#0284C7] text-white border-[#0284C7] shadow-md shadow-sky-500/20 scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-medium opacity-80 ${activeTab === tab.id ? "text-sky-100" : "text-slate-400"}`}>
                  {tab.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: INTERACTIVE ROADMAP (10TH PASS TO QUALIFIED CA)                    */}
        {/* ========================================================================= */}
        {activeTab === "roadmap" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Age Simulation Control Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] font-bold shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-slate-900">
                    Live Timeline Simulator: What If I Start Right Now?
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Slide your current age to see when you graduate as an Indian Chartered Accountant:
                  </p>
                </div>
              </div>

              {/* Slider & Result */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600">Current Age:</span>
                  <input
                    type="range"
                    min={15}
                    max={18}
                    value={ageSlider}
                    onChange={(e) => setAgeSlider(Number(e.target.value))}
                    className="w-24 sm:w-32 accent-[#0284C7] cursor-pointer"
                  />
                  <span className="font-mono text-xs font-extrabold text-[#0284C7] bg-white px-2 py-0.5 rounded shadow-2xs">
                    {ageSlider} Yrs
                  </span>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0">
                  Qualified CA by Age: <span className="text-emerald-700 font-extrabold">{timelineSim.qualifiedAge}</span>! 🎓
                </div>
              </div>
            </div>

            {/* 5-Step Visual Step Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ROADMAP_STAGES.map((stg, sIdx) => {
                const isSelected = selectedRoadmapStep === sIdx;
                return (
                  <button
                    key={stg.step}
                    onClick={() => setSelectedRoadmapStep(sIdx)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "bg-white border-[#0284C7] shadow-md ring-2 ring-sky-200/60"
                        : "bg-white/80 hover:bg-white border-slate-200 hover:border-sky-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-extrabold font-mono uppercase px-2 py-0.5 rounded ${
                        isSelected ? "bg-[#0284C7] text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {stg.stageName}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {stg.ageRange}
                      </span>
                    </div>
                    <h5 className="text-xs font-serif font-bold text-slate-900 line-clamp-1">
                      {stg.standardTitle.split(" ")[0]} {stg.standardTitle.split(" ")[1]}
                    </h5>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {stg.badge}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Stage Detail Panel */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left 8 Cols: Overview & What You Study */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-100 font-mono">
                        {activeStage.stageName} • {activeStage.ageRange}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {activeStage.badge}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">
                      {activeStage.standardTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {activeStage.shortDesc}
                    </p>
                  </div>

                  {/* What you do at this stage */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Key Milestones at This Stage:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeStage.whatYouDo.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Myth Busted Box */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 uppercase text-[10px] font-mono">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      <span>Class 10 Student Myth Busted</span>
                    </div>
                    <p className="leading-relaxed">{activeStage.mythBusted}</p>
                  </div>
                </div>

                {/* Right 4 Cols: The Law Kaksha Advantage & Action */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white space-y-4 shadow-md">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300">
                      The Law Kaksha Secret Weapon
                    </span>
                    <h4 className="text-sm font-serif font-bold text-white mt-1">
                      How We Make This 10x Easier
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {activeStage.kakshaSecret}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-700/80 space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400">Earning / Earning Potential:</span>
                    <div className="text-sm font-serif font-black text-emerald-400">
                      {activeStage.salaryOrStipend}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setSampleModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0284C7] hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Preview Free Starter Chapter</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: "CRACK THE CASE" 1-MINUTE DETECTIVE GAME                           */}
        {/* ========================================================================= */}
        {activeTab === "game" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            {/* Game Scoreboard Header */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284C7] font-bold shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-slate-900">
                    Boardroom Detective Mini-Game
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Test your legal intuition on real-world Indian cases!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Score</span>
                  <div className="text-sm font-serif font-extrabold text-[#0284C7]">
                    {score} XP
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <span className="px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-xs font-bold font-mono">
                  {currentGameIndex + 1} / {CASES_DATA.length}
                </span>
              </div>
            </div>

            {/* Case Challenge Card */}
            {(() => {
              const currentCase = CASES_DATA[currentGameIndex];
              return (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                  
                  {/* Case Tag & Law Source */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-[#0284C7] border border-sky-100 font-mono">
                      {currentCase.act}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {currentCase.sectionCode}
                    </span>
                  </div>

                  {/* Story Scenario */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-xl font-serif font-black text-slate-900">
                      {currentCase.title}
                    </h3>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans italic">
                      &ldquo;{currentCase.story}&rdquo;
                    </div>
                  </div>

                  {/* Question */}
                  <div className="font-bold text-xs sm:text-sm text-slate-900 font-serif flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>{currentCase.question}</span>
                  </div>

                  {/* Choices */}
                  <div className="space-y-2.5 pt-1">
                    {currentCase.options.map((opt) => {
                      const isChosen = selectedAnswer === opt.id;
                      let btnStyle = "bg-white hover:bg-sky-50/50 border-slate-200 text-slate-800";
                      if (isAnswerSubmitted) {
                        if (opt.isCorrect) {
                          btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-200";
                        } else if (isChosen && !opt.isCorrect) {
                          btnStyle = "bg-red-50 border-red-300 text-red-900";
                        } else {
                          btnStyle = "bg-slate-50 opacity-50 border-slate-200 text-slate-400";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={isAnswerSubmitted}
                          onClick={() => handleSelectOption(opt.id)}
                          className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span className={`w-6 h-6 rounded-lg font-bold font-mono text-xs flex items-center justify-center shrink-0 ${
                            isAnswerSubmitted && opt.isCorrect
                              ? "bg-emerald-600 text-white"
                              : isChosen && !opt.isCorrect
                              ? "bg-red-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                            {opt.id}
                          </span>
                          <span className="leading-snug">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {isAnswerSubmitted && (
                    <div className="pt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      {(() => {
                        const chosen = currentCase.options.find((o) => o.id === selectedAnswer);
                        return (
                          <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-2 ${
                            chosen?.isCorrect
                              ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                              : "bg-amber-50/80 border-amber-200 text-amber-900"
                          }`}>
                            <div className="font-bold flex items-center gap-2">
                              {chosen?.isCorrect ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Superb Legal Instinct! (+100 XP)</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>Good Try! Here is what the Law says:</span>
                                </>
                              )}
                            </div>
                            <p className="text-xs text-slate-700">{chosen?.explanation}</p>
                          </div>
                        );
                      })()}

                      {/* Next Case Button */}
                      <div className="flex items-center justify-between pt-4">
                        <button
                          onClick={handleResetGame}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restart Detective Game</span>
                        </button>

                        {currentGameIndex < CASES_DATA.length - 1 ? (
                          <button
                            onClick={handleNextCase}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-xs"
                          >
                            <span>Next Mystery Case</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="text-right">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                              🏆 All 3 Cases Solved! You Have Natural Legal Talent!
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: LEGAL JARGON BUSTER (SUPERPOWER DECODER)                           */}
        {/* ========================================================================= */}
        {activeTab === "jargon" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Category Filter Pills */}
            <div className="flex items-center justify-center gap-2">
              {(["All", "Contract", "Company"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setJargonFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    jargonFilter === cat
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {cat === "All" ? "All Terms (6)" : `${cat} Law`}
                </button>
              ))}
            </div>

            {/* 6 Interactive Jargon Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredJargon.map((item) => {
                const isFlipped = flippedCards[item.term];
                return (
                  <div
                    key={item.term}
                    onClick={() => toggleFlip(item.term)}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden min-h-[220px]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-sky-50 text-[#0284C7] border border-sky-100">
                          {item.latinOrLegal}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {isFlipped ? "Tap to hide" : "Tap to decode 🔄"}
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-serif font-black text-slate-900 tracking-tight group-hover:text-[#0284C7] transition-colors">
                        {item.term}
                      </h4>

                      {/* What it sounds like */}
                      <div className="mt-2 text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                        Sounds like: <strong>{item.soundsLike}</strong>
                      </div>

                      {/* Plain 10th-grade English definition */}
                      <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {item.actualMeaning}
                      </p>
                    </div>

                    {/* Analogy Box */}
                    <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-[#0284C7] font-medium flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Real Analogy:</strong> {item.analogy}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: "AM I READY FOR CA?" 30-SECOND APTITUDE QUIZ                       */}
        {/* ========================================================================= */}
        {activeTab === "quiz" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            {!quizCompleted ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                
                {/* Progress Dots */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {APTITUDE_QUIZ.map((_, qIdx) => (
                      <div
                        key={qIdx}
                        className={`h-2 rounded-full transition-all ${
                          qIdx === quizStep
                            ? "w-8 bg-[#0284C7]"
                            : qIdx < quizStep
                            ? "w-2 bg-emerald-500"
                            : "w-2 bg-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    Question {quizStep + 1} of {APTITUDE_QUIZ.length}
                  </span>
                </div>

                {/* Current Question */}
                <div className="space-y-1">
                  <h3 className="text-base sm:text-xl font-serif font-black text-slate-900 tracking-tight">
                    {APTITUDE_QUIZ[quizStep].question}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {APTITUDE_QUIZ[quizStep].subtitle}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3 pt-1">
                  {APTITUDE_QUIZ[quizStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleQuizSelect(opt.points)}
                      className="w-full p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white hover:bg-sky-50/40 text-left transition-all flex items-start gap-3.5 cursor-pointer group shadow-2xs hover:shadow-xs active:scale-[0.99]"
                    >
                      <span className="text-2xl shrink-0 p-1 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform">
                        {opt.icon}
                      </span>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                          {opt.label}
                        </h5>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-snug">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Quiz Result Card */
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-200 shadow-md text-center space-y-5 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-500/30 text-3xl">
                  🏆
                </div>

                <div className="space-y-1.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                    98% CA Career Match
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">
                    You Are a Natural &ldquo;Boardroom Strategist&rdquo;!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your answers show strong logical deduction and curiosity about how big companies make decisions. With the right visual guidance, you have a very high chance of clearing CA Foundation in your first attempt!
                  </p>
                </div>

                {/* 3 Key Takeaways */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-[#0284C7] font-mono">STEP 1</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">Register Early</p>
                    <p className="text-[10px] text-slate-500">Provisional ICAI entry right after Class 10 results.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-[#0284C7] font-mono">STEP 2</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">Focus on Paper 2</p>
                    <p className="text-[10px] text-slate-500">Master Business Law using 1-page visual flowcharts.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-[#0284C7] font-mono">STEP 3</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">Target Exemption</p>
                    <p className="text-[10px] text-slate-500">Score 70+ in Foundation to guarantee rank eligibility.</p>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <button
                    onClick={() => setSampleModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open Free Class 10 Beginner Primer PDF</span>
                  </button>

                  <button
                    onClick={handleResetQuiz}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Enhanced Sample Chapter Modal for Beginners */}
      <EnhancedSampleChapterModal
        isOpen={sampleModalOpen}
        onClose={() => setSampleModalOpen(false)}
        defaultBookId="ca-foundation"
      />
    </section>
  );
}
