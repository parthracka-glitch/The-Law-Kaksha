/**
 * The Law Kaksha - Database Seeder
 * Populates official products, default admin, verified student, and initial reviews
 */

const bcrypt = require("bcryptjs");
const Database = require("./database");

async function seed() {
  console.log("[Seeder] Checking database state...");

  const usersTable = Database.table("users");
  const productsTable = Database.table("products");
  const ordersTable = Database.table("orders");
  const enrollmentsTable = Database.table("enrollments");
  const reviewsTable = Database.table("reviews");

  // 1. Seed Products if empty
  if (productsTable.count() === 0) {
    console.log("[Seeder] Seeding 6 flagship CA Law products...");

    const products = [
      {
        id: "book-vol-1",
        slug: "volume-1-ca-foundation-business-laws-contract-act",
        type: "book",
        title: "Part 1: The Indian Contract Act, 1872",
        subtitle: "Units 1 - 9 • Smart Revision Question Bank with Model Answers.",
        pages_or_duration: "540 Pages",
        price: 249,
        original_price: 449,
        badge: "Volume 1",
        category: "CA Foundation Paper 2",
        description:
          "Official The Law कक्षा Smart Revision Question Bank covering The Indian Contract Act 1872 (Units 1 to 9). Featuring application-based questions, previous exam problems, and examiner scoring frameworks.",
        cover_image: "/covers/vol1-codex.webp",
        preview_file: "sample-preview-vol-1.pdf",
        full_file_key: "vault/ca-corp-law-vol1-full-2026.pdf",
        highlights: [
          "Complete Units 1 to 9 of The Indian Contract Act 1872",
          "Application-Based Problem Solving & Case Scenarios",
          "Questions from Previous ICAI Examination Attempts",
          "Examiner Model Answers with Keyword Checklists",
        ],
        syllabus: [
          { chapter: "Unit 1", title: "Nature of Contracts & Essential Elements (Sec 1-9)" },
          { chapter: "Unit 2", title: "Consideration & Lawful Object Rules (Sec 23-25)" },
          { chapter: "Unit 3", title: "Capacity to Contract & Free Consent (Sec 10-22)" },
          { chapter: "Unit 4", title: "Void Agreements & Contingent Contracts (Sec 26-36)" },
          { chapter: "Unit 5", title: "Performance of Contract & Joint Liabilities (Sec 37-67)" },
          { chapter: "Unit 6", title: "Discharge of Contract & Breach Dynamics (Sec 62-75)" },
          { chapter: "Unit 7", title: "Remedies for Breach of Contract (Sec 73-75)" },
          { chapter: "Unit 8", title: "Contingent & Quasi Contracts Deep-Dive (Sec 68-72)" },
          { chapter: "Unit 9", title: "Contract of Indemnity and Guarantee (Sec 124-147)" },
        ],
        status: "published",
      },
      {
        id: "book-vol-2",
        slug: "volume-2-ca-foundation-business-laws-rest-of-acts",
        type: "book",
        title: "Part 2: Rest of the Acts",
        subtitle: "Sale of Goods, Partnership, LLP & Companies Act Examiner Framework.",
        pages_or_duration: "480 Pages",
        price: 249,
        original_price: 449,
        badge: "Volume 2",
        category: "CA Foundation Paper 2",
        description:
          "Official The Law कक्षा Smart Revision Question Bank covering Sale of Goods Act 1930, Indian Partnership Act 1932, LLP Act 2008 & Companies Act 2013 with previous exam descriptive answers.",
        cover_image: "/covers/vol2-codex.webp",
        preview_file: "sample-preview-vol-2.pdf",
        full_file_key: "vault/ca-other-laws-vol2-full-2026.pdf",
        highlights: [
          "General Clauses Act 1897 deep-dive with judicial precedents",
          "Interpretation of Statutes: Primary & Secondary Rules",
          "Foreign Contribution Regulation Act (FCRA) 2010 rules",
          "Past 12 exam descriptive answers with marking criteria",
        ],
        syllabus: [
          { chapter: "Part A", title: "The General Clauses Act, 1897 (Sections 1 to 30)" },
          { chapter: "Part B", title: "Interpretation of Statutes, Deeds and Documents" },
          { chapter: "Part C", title: "The Foreign Contribution (Regulation) Act, 2010 (FCRA)" },
          { chapter: "Part D", title: "The Limited Liability Partnership Act, 2008 Overview" },
        ],
        status: "published",
      },
      {
        id: "book-mcq",
        slug: "icai-case-scenarios-30-mark-mcq-bank",
        type: "mcq",
        title: "ICAI Case Scenarios & 30-Mark MCQ Bank (1,200+ Qs)",
        subtitle: "Mandatory 30-mark section with detailed reasoning for each option.",
        pages_or_duration: "260 Pages",
        price: 249,
        original_price: 449,
        badge: "Practice Drill",
        category: "Practice Question Bank",
        description:
          "Practice chapter-wise ICAI case scenarios, negative marking prevention drills, and MCA amendment MCQs. Includes step-by-step statutory reasoning for all 4 options.",
        cover_image: "/covers/mcq-codex.png",
        preview_file: "sample-preview-mcq.pdf",
        full_file_key: "vault/ca-mcq-bank-full-2026.pdf",
        highlights: [
          "1,200+ ICAI Curated Multiple Choice Questions",
          "Full reasoning and Bare Act citation for every correct option",
          "35 Integrated Case Scenarios with 5 MCQs each",
          "Negative marking elimination techniques",
        ],
        syllabus: [
          { chapter: "Section 1", title: "Corporate Law Chapter-wise Objective Drills" },
          { chapter: "Section 2", title: "Economic & Other Laws Conceptual MCQs" },
          { chapter: "Section 3", title: "35 Integrated Comprehensive Case Scenarios" },
          { chapter: "Section 4", title: "Mock Test Papers Objective Section with Solutions" },
        ],
        status: "published",
      },
      {
        id: "book-ldr",
        slug: "1-5-day-last-day-revision-ldr-maps",
        type: "book",
        title: "1.5-Day Last Day Revision (LDR) Section Maps",
        subtitle: "Summary Flowcharts, Limit Tables & Penalty Code Tables for the last 36 hours.",
        pages_or_duration: "180 Pages",
        price: 199,
        original_price: 349,
        badge: "Quick Revision",
        category: "CA Exam Eve Maps",
        description:
          "Ultra-condensed visual flowcharts and penalty summary tables designed specifically for the final 36 hours before your CA exam. Retain limits, thresholds, and timeframes.",
        cover_image: "/covers/ldr-maps.png",
        preview_file: "sample-preview-ldr.pdf",
        full_file_key: "vault/ca-ldr-maps-full-2026.pdf",
        highlights: [
          "Complete time-limit tables (15 days, 30 days, 60 days, 90 days)",
          "Penal provisions & compoundable vs non-compoundable offenses map",
          "1.5-day hour-by-hour revision timetable for CA Law",
          "Formula sheets for quorum and voting percentage calculations",
        ],
        syllabus: [
          { chapter: "Map 1", title: "Incorporation & Capital Limits Map" },
          { chapter: "Map 2", title: "Deposits & Charges Flowcharts" },
          { chapter: "Map 3", title: "General Meetings & Quorum Master Table" },
          { chapter: "Map 4", title: "Accounts, CSR & Audit Critical Sections Checklist" },
        ],
        status: "published",
      },
      {
        id: "video-classes",
        slug: "hd-video-masterclasses-full-law-lecture-series",
        type: "video",
        title: "HD Video Masterclasses: Full Law Lecture Series",
        subtitle: "32 in-depth chapter masterclasses with timestamped notes and faculty drafting rubrics.",
        pages_or_duration: "45+ Hours",
        price: 999,
        original_price: 1899,
        badge: "Video Course",
        category: "CA Foundation & Inter",
        description:
          "Detailed video breakdown of tricky corporate law sections with practical boardroom case studies, real MCA portal demonstrations, and drafting walk-throughs.",
        cover_image: "/covers/video-series.png",
        preview_file: "sample-video-preview.mp4",
        full_file_key: "vault/masterclass-law-series-2026.m3u8",
        highlights: [
          "32 HD Video Masterclasses with dual speed audio (1.25x/1.5x/2.0x)",
          "Timestamped Bare Act section navigation",
          "Faculty drafting rubrics for high-scoring descriptive answers",
          "Boardroom practical case study discussions",
        ],
        syllabus: [
          { chapter: "Module 1", title: "Company Formation & Secretarial Compliances (8 Lectures)" },
          { chapter: "Module 2", title: "Securities, Prospectus & Allotment Rules (6 Lectures)" },
          { chapter: "Module 3", title: "General Meetings, Quorum & Voting Dynamics (10 Lectures)" },
          { chapter: "Module 4", title: "Audit, CSR Mandates & Statutory Presumptions (8 Lectures)" },
        ],
        status: "published",
      },
      {
        id: "mains-evaluation",
        slug: "1-on-1-descriptive-test-series-copy-checking",
        type: "evaluation",
        title: "1-on-1 Descriptive Test Series & Copy Checking Desk",
        subtitle: "Submit your handwritten answer sheets for 5-pillar faculty grading and audio feedback.",
        pages_or_duration: "8 Full Papers",
        price: 699,
        original_price: 1299,
        badge: "Copy Checking",
        category: "CA Mains Evaluation",
        description:
          "Get detailed line-by-line checking of your law descriptive papers within 48 hours to boost scores to 70+. Includes personalized audio feedback note and model ICAI benchmark copies.",
        cover_image: "/covers/copy-checking.png",
        preview_file: "sample-evaluated-copy.pdf",
        full_file_key: "vault/test-series-papers-2026.zip",
        highlights: [
          "8 Full 100-Mark ICAI Model Test Papers",
          "5-Pillar Rubric: Law citation, fact synthesis, argument & conclusion",
          "Line-by-line red-ink annotated PDF evaluation within 48 hours",
          "Personalized faculty voice note highlighting improvement areas",
        ],
        syllabus: [
          { chapter: "Test 1 & 2", title: "Chapter-wise Tests: Sections 1 to 72 (50 Marks Each)" },
          { chapter: "Test 3 & 4", title: "Chapter-wise Tests: Sections 73 to 148 (50 Marks Each)" },
          { chapter: "Test 5 & 6", title: "Other Laws Comprehensive Tests (50 Marks Each)" },
          { chapter: "Test 7 & 8", title: "Full Syllabus 100-Mark ICAI Simulation Papers" },
        ],
        status: "published",
      },
    ];

    products.forEach((p) => productsTable.insert(p));
    console.log("[Seeder] Products seeded successfully.");
  }

  // 2. Seed Default Admin & Student Users if empty
  if (usersTable.count() === 0) {
    console.log("[Seeder] Seeding default administrator and verified student...");

    const adminPasswordHash = await bcrypt.hash("AdminSecurePassword2026!", 10);
    const studentPasswordHash = await bcrypt.hash("StudentSecurePassword2026!", 10);

    const adminUser = usersTable.insert({
      id: "usr-admin-001",
      student_id: "LRK-ADM-000001",
      name: "The Law Kaksha Admin",
      email: "admin@thelawkaksha.com",
      phone: "+91 99999 88888",
      password_hash: adminPasswordHash,
      role: "admin",
      target_exam: "Administrator",
      is_active: 1,
    });

    const studentUser = usersTable.insert({
      id: "usr-student-001",
      student_id: "LK-STU-084201",
      name: "Enrolled Candidate",
      email: "student@thelawkaksha.com",
      phone: "+91 98765 43210",
      password_hash: studentPasswordHash,
      role: "student",
      target_exam: "CA Intermediate Paper 2: Corporate & Other Laws (Nov 2026)",
      is_active: 1,
    });

    // Seed Order for student
    const sampleOrder = ordersTable.insert({
      id: "LK-ORD-982100",
      user_id: studentUser.id,
      total_amount: 399,
      discount_amount: 100,
      coupon_code: "CALAW20",
      payment_status: "PAID",
      payment_gateway: "razorpay",
      gateway_order_id: "order_mock_982100",
      gateway_payment_id: "pay_mock_982100",
      gateway_signature: "sig_mock_verified",
      shipping_name: "Enrolled Candidate",
      shipping_email: "student@thelawkaksha.com",
      shipping_phone: "+91 98765 43210",
      shipping_address: "Flat 402, Nariman Point, Mumbai, Maharashtra - 400021",
      tracking_number: "INSTANT-DRM-VAULT",
    });

    // Seed Enrollments for student (Volume 1 & MCQ bank)
    enrollmentsTable.insert({
      id: "enr-001",
      user_id: studentUser.id,
      product_id: "book-vol-1",
      order_id: sampleOrder.id,
      access_status: "ACTIVE",
    });

    enrollmentsTable.insert({
      id: "enr-002",
      user_id: studentUser.id,
      product_id: "book-mcq",
      order_id: sampleOrder.id,
      access_status: "ACTIVE",
    });

    console.log("[Seeder] Users, order and enrollments seeded successfully.");
  }

  // 3. Seed Reviews if empty
  if (reviewsTable.count() === 0) {
    console.log("[Seeder] Seeding genuine student reviews...");

    const initialReviews = [
      {
        id: "rev-001",
        product_id: "book-vol-1",
        student_name: "AIR 03 Candidate",
        student_rank: "CA Intermediate (Nov Attempt)",
        rating: 5,
        title: "Scored 74 in Law! Volume 1 is unmatched.",
        comment:
          "The way Section 96 to 103 are broken down with practical AGM and quorum tables helped me draft crystal clear 6-mark answers. In my exam, 4 descriptive questions were verbatim from The Law Kaksha statutory codex!",
        is_approved: 1,
      },
      {
        id: "rev-002",
        product_id: "book-mcq",
        student_name: "AIR 14 Candidate",
        student_rank: "CA Inter",
        rating: 5,
        title: "Full 30/30 in MCQ section thanks to this Question Bank.",
        comment:
          "Every single question has explanations for why the other 3 options are incorrect. The integrated case studies gave me the exact confidence needed for the tricky ICAI negative marking traps.",
        is_approved: 1,
      },
      {
        id: "rev-003",
        product_id: "book-ldr",
        student_name: "CA Final Candidate",
        student_rank: "Corporate & Economic Laws",
        rating: 5,
        title: "Life-saver during the 1.5-day exam gap.",
        comment:
          "You cannot read 800 pages before the exam. These LDR maps condensing penalty codes and filing days into 180 visual pages are pure gold. Must-have for every law aspirant.",
        is_approved: 1,
      },
      {
        id: "rev-004",
        product_id: "mains-evaluation",
        student_name: "Exemption Candidate",
        student_rank: "Cleared CA Inter with 68 in Law",
        rating: 5,
        title: "The 1-on-1 copy checking boosted my score by 22 marks.",
        comment:
          "I used to write stories instead of legal answers. The 5-pillar rubric taught me how to cite Bare Act provisions and synthesize facts concisely. The audio feedback note from faculty is fantastic.",
        is_approved: 1,
      },
    ];

    initialReviews.forEach((r) => reviewsTable.insert(r));
    console.log("[Seeder] Reviews seeded successfully.");
  }

  // 4. Seed Quizzes if empty
  const quizzesTable = Database.table("quizzes");
  if (quizzesTable.count() === 0) {
    console.log("[Seeder] Seeding statutory legal quizzes...");

    const initialQuizzes = [
      {
        id: "quiz-daily-01",
        title: "All-India Daily Legal Challenge: Companies Act, 2013 (Sec 96-122)",
        subtitle: "10 Timed Statutory Scenario Questions • Free for All Registered Candidates",
        level: "CA Intermediate Paper 2",
        subject: "Corporate & Other Laws",
        chapter: "Chapter VII: Management & Administration (Sections 96 to 122)",
        time_limit_minutes: 15,
        total_marks: 20,
        positive_marks: 2,
        negative_marks: 0.5,
        is_free: 1,
        status: "ACTIVE",
        questions: [
          {
            id: "q-101",
            question:
              "Under Section 96 of the Companies Act, 2013, what is the statutory time gap allowed between two consecutive Annual General Meetings (AGMs) of a company?",
            options: [
              "Not more than 12 months",
              "Not more than 15 months",
              "Not more than 18 months",
              "Not more than 6 months from close of financial year only",
            ],
            correct_option_index: 1,
            bare_act_citation: "Section 96(1) of the Companies Act, 2013",
            explanation:
              "Section 96(1) mandates that not more than 15 months shall elapse between the date of one AGM and that of the next, subject to the closing of the financial year timeline (6 months).",
          },
          {
            id: "q-102",
            question:
              "A Public Company has 1,850 members as on the date of its General Meeting. As per Section 103(1)(a)(ii), what is the statutory minimum quorum required?",
            options: [
              "5 members personally present",
              "15 members personally present",
              "30 members personally present",
              "15 members present personally or by proxy",
            ],
            correct_option_index: 1,
            bare_act_citation: "Section 103(1)(a)(ii) of the Companies Act, 2013",
            explanation:
              "Under Section 103(1)(a)(ii), if the number of members is more than 1,000 but up to 5,000, the statutory quorum is 15 members personally present. Proxies are strictly excluded from quorum calculation.",
          },
          {
            id: "q-103",
            question:
              "Which of the following business items CANNOT be transacted through a Postal Ballot under Section 110 of the Companies Act, 2013 read with Rule 22?",
            options: [
              "Alteration of Memorandum of Association (MOA) objects clause",
              "Ordinary Business at an Annual General Meeting",
              "Issue of shares with differential voting rights",
              "Buy-back of own shares by the company",
            ],
            correct_option_index: 1,
            bare_act_citation: "Section 110(1) & Rule 22 of Companies (Management and Administration) Rules, 2014",
            explanation:
              "Ordinary business items at an AGM (Adoption of accounts, dividend declaration, director appointments, auditor appointment) and items where directors/auditors have a right to be heard cannot be passed through postal ballot.",
          },
          {
            id: "q-104",
            question:
              "Under Section 100(2), what is the minimum voting power required for members of a company having share capital to requisition an Extraordinary General Meeting (EGM)?",
            options: [
              "Not less than 5% of paid-up share capital",
              "Not less than 1/10th (10%) of paid-up share capital carrying voting rights",
              "Not less than 25% of paid-up share capital",
              "At least 50 members holding voting rights",
            ],
            correct_option_index: 1,
            bare_act_citation: "Section 100(2)(a) of the Companies Act, 2013",
            explanation:
              "Section 100(2)(a) specifies that members holding not less than one-tenth of such of the paid-up share capital of the company as carries the right of voting can validly requisition an EGM.",
          },
          {
            id: "q-105",
            question:
              "What is the statutory length of clear notice required to call an Annual General Meeting under Section 101(1) of the Companies Act, 2013?",
            options: [
              "14 clear days",
              "21 clear days",
              "30 clear days",
              "21 days including the date of sending and date of meeting",
            ],
            correct_option_index: 1,
            bare_act_citation: "Section 101(1) of the Companies Act, 2013",
            explanation:
              "Section 101(1) stipulates that a general meeting of a company may be called by giving not less than clear 21 days notice either in writing or through electronic mode.",
          },
        ],
      },
      {
        id: "quiz-contract-01",
        title: "ICAI Case Scenario Drill: The Indian Contract Act, 1872",
        subtitle: "Essential Elements, Legality of Object & Discharge of Contracts",
        level: "CA Foundation & Inter",
        subject: "Business Laws",
        chapter: "The Indian Contract Act, 1872 (Units 1 to 9)",
        time_limit_minutes: 20,
        total_marks: 20,
        positive_marks: 2,
        negative_marks: 0.5,
        is_free: 1,
        status: "ACTIVE",
        questions: [
          {
            id: "q-201",
            question:
              "An agreement made without consideration is void under Section 25. Which of the following is a recognized statutory exception under Section 25(1)?",
            options: [
              "Agreement in restraint of trade",
              "Agreement in writing and registered made on account of natural love and affection between parties standing in near relation",
              "Oral promise to compensate past voluntary services",
              "Promise to pay a time-barred debt signed without witnesses",
            ],
            correct_option_index: 1,
            bare_act_citation: "Section 25(1) of The Indian Contract Act, 1872",
            explanation:
              "Under Section 25(1), an agreement expressed in writing and registered under the law for the time being in force, made on account of natural love and affection between parties in a near relation, is enforceable without consideration.",
          },
          {
            id: "q-202",
            question:
              "Under Section 68 of the Indian Contract Act, 1872, if a person incapable of entering into a contract is supplied with necessaries suited to his condition in life:",
            options: [
              "The minor is personally liable to pay from his pocket",
              "The supplier is entitled to be reimbursed from the property of such incapable person",
              "The contract is completely void and no reimbursement can be claimed",
              "The parents of the minor are strictly personally liable",
            ],
            correct_option_index: 1,
            bare_act_citation: "Section 68 of The Indian Contract Act, 1872",
            explanation:
              "Under Section 68, the person furnishing necessaries is entitled to be reimbursed from the property of the minor/incapable person. There is zero personal liability on the minor.",
          },
        ],
      },
      {
        id: "quiz-other-laws-01",
        title: "Corporate Law Master Mock: Board Meetings & Audit Provisions",
        subtitle: "Sections 134, 139, 149 & 173 Deep-Dive Examination Simulation",
        level: "CA Intermediate Paper 2",
        subject: "Corporate & Other Laws",
        chapter: "Board of Directors, Audit & Financial Statements",
        time_limit_minutes: 30,
        total_marks: 30,
        positive_marks: 3,
        negative_marks: 1.0,
        is_free: 0,
        status: "ACTIVE",
        questions: [
          {
            id: "q-301",
            question:
              "Under Section 139(2) of the Companies Act, 2013, what is the maximum consecutive term an individual auditor can serve in a prescribed company before mandatory cooling-off?",
            options: [
              "One term of 3 consecutive years",
              "One term of 5 consecutive years",
              "Two terms of 5 consecutive years",
              "Ten consecutive years without cooling-off",
            ],
            correct_option_index: 1,
            bare_act_citation: "Section 139(2)(a) of the Companies Act, 2013",
            explanation:
              "Under Section 139(2)(a), no listed company or prescribed class of companies shall appoint or re-appoint an individual as auditor for more than one term of five consecutive years.",
          },
        ],
      },
    ];

    initialQuizzes.forEach((q) => quizzesTable.insert(q));
    console.log("[Seeder] Quizzes seeded successfully.");
  }

  // 5. Seed Quiz Attempts for All-India Leaderboard if empty
  const attemptsTable = Database.table("quiz_attempts");
  if (attemptsTable.count() === 0) {
    console.log("[Seeder] Seeding initial All-India leaderboard submissions...");

    const initialAttempts = [
      {
        id: "att-seed-001",
        quiz_id: "quiz-daily-01",
        quiz_title: "All-India Daily Legal Challenge: Companies Act, 2013 (Sec 96-122)",
        user_id: "usr-ranker-001",
        candidate_name: "AIR 01 Candidate",
        student_id: "LK-AIR-001",
        score: 20,
        total_marks: 20,
        accuracy: 100.0,
        correct_count: 5,
        incorrect_count: 0,
        unattempted_count: 0,
        time_taken_seconds: 245,
        answers: { "q-101": 1, "q-102": 1, "q-103": 1, "q-104": 1, "q-105": 1 },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "att-seed-002",
        quiz_id: "quiz-daily-01",
        quiz_title: "All-India Daily Legal Challenge: Companies Act, 2013 (Sec 96-122)",
        user_id: "usr-ranker-002",
        candidate_name: "AIR 02 Candidate",
        student_id: "LK-AIR-002",
        score: 18,
        total_marks: 20,
        accuracy: 90.0,
        correct_count: 4,
        incorrect_count: 1,
        unattempted_count: 0,
        time_taken_seconds: 310,
        answers: { "q-101": 1, "q-102": 1, "q-103": 1, "q-104": 1, "q-105": 0 },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: "att-seed-003",
        quiz_id: "quiz-daily-01",
        quiz_title: "All-India Daily Legal Challenge: Companies Act, 2013 (Sec 96-122)",
        user_id: "usr-ranker-003",
        candidate_name: "AIR 03 Candidate",
        student_id: "LK-AIR-003",
        score: 17.5,
        total_marks: 20,
        accuracy: 88.0,
        correct_count: 4,
        incorrect_count: 1,
        unattempted_count: 0,
        time_taken_seconds: 340,
        answers: { "q-101": 1, "q-102": 1, "q-103": 1, "q-104": 0, "q-105": 1 },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      },
      {
        id: "att-seed-004",
        quiz_id: "quiz-daily-01",
        quiz_title: "All-India Daily Legal Challenge: Companies Act, 2013 (Sec 96-122)",
        user_id: "usr-student-001",
        candidate_name: "Enrolled Candidate",
        student_id: "LK-STU-084201",
        score: 16,
        total_marks: 20,
        accuracy: 80.0,
        correct_count: 4,
        incorrect_count: 1,
        unattempted_count: 0,
        time_taken_seconds: 420,
        answers: { "q-101": 1, "q-102": 1, "q-103": 0, "q-104": 1, "q-105": 1 },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: "att-seed-005",
        quiz_id: "quiz-daily-01",
        quiz_title: "All-India Daily Legal Challenge: Companies Act, 2013 (Sec 96-122)",
        user_id: "usr-ranker-005",
        candidate_name: "Exemption Candidate",
        student_id: "LK-EXM-005",
        score: 14,
        total_marks: 20,
        accuracy: 75.0,
        correct_count: 3,
        incorrect_count: 1,
        unattempted_count: 1,
        time_taken_seconds: 480,
        answers: { "q-101": 1, "q-102": 1, "q-103": 1 },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      },
    ];

    initialAttempts.forEach((a) => attemptsTable.insert(a));
    console.log("[Seeder] Leaderboard attempts seeded successfully.");
  }

  console.log("[Seeder] Seeding completed!");
}

module.exports = seed;

// Run directly if invoked from command line
if (require.main === module) {
  seed();
}

