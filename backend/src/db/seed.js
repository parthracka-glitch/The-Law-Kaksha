/**
 * The Law Kaksha - Database Seeder
 * Aligned to Word docs & CHANGES.pdf:
 * CA Foundation Business Laws (7 Chapters) + CSEET Business Law & Management (8 Units)
 * Subscription model at Rs. 99/month per course (Launch Offer period)
 */

const bcrypt = require("bcryptjs");
const Database = require("./database");

async function seed() {
  console.log("[Seeder] Checking database state...");

  const usersTable = Database.table("users");
  const coursesTable = Database.table("courses");
  const actsTable = Database.table("acts");
  const contentTable = Database.table("content");
  const weeklyContentTable = Database.table("weekly_content");
  const quizzesTable = Database.table("quizzes");
  const subscriptionsTable = Database.table("subscriptions");

  // 1. Seed Courses
  if (coursesTable.count() === 0) {
    console.log("[Seeder] Seeding courses: CSEET & CA Foundation...");

    coursesTable.insert({
      id: "course-ca-foundation",
      title: "CA Foundation",
      fullTitle: "CA Foundation Business Laws",
      description: "Smart Revision Question Bank with Detailed Solutions for CA Foundation Business Laws",
      tagline: "Learn. Practice. Excel.",
      backCoverTagline: "Turn Your Understanding into Exam-Ready Practice.",
      price: 99,
      originalPrice: 299,
      offerLabel: "Launch Offer — ₹99/month",
      disclaimer: "This platform is a supplementary practice resource. Refer to the latest applicable ICAI syllabus and official study material for your examination attempt.",
      examBody: "ICAI",
      status: "active",
    });

    coursesTable.insert({
      id: "course-cseet",
      title: "CSEET",
      fullTitle: "CSEET Business Law & Management",
      description: "Smart Revision MCQ Question Bank for CSEET Business Law & Management",
      tagline: "Practice. Revise. Perform.",
      backCoverTagline: "Read the Concept. Practise the Question. Build Your Confidence.",
      price: 99,
      originalPrice: 299,
      offerLabel: "Launch Offer — ₹99/month",
      disclaimer: "This platform is a supplementary practice resource. Follow the latest applicable ICSI syllabus and official study material for your examination attempt.",
      examBody: "ICSI",
      status: "active",
    });

    console.log("[Seeder] Courses seeded.");
  }

  // 2. Seed Acts/Units for each course according to CHANGES.pdf syllabus
  if (actsTable.count() === 0) {
    console.log("[Seeder] Seeding Acts/Units...");

    // CA Foundation Business Laws chapters exactly as per CHANGES.pdf page 1-2
    const caFoundationActs = [
      {
        id: "ca-ch-1",
        courseId: "course-ca-foundation",
        order: 1,
        chapterNumber: 1,
        title: "Chapter 1: Indian Regulatory Framework",
        shortTitle: "Regulatory Framework",
        sections: "Overview of Indian Legal System, Sources of Law, Judicial Machinery",
        description: "Foundations of Indian law, structure of courts, process of law making in Parliament and State Legislatures."
      },
      {
        id: "ca-ch-2",
        courseId: "course-ca-foundation",
        order: 2,
        chapterNumber: 2,
        title: "Chapter 2: The Indian Contract Act, 1872",
        shortTitle: "Contract Act",
        sections: "Sections 1-75 & Special Contracts",
        description: "General principles of contracts: Offer, Acceptance, Consideration, Capacity, Free Consent, Legality, Performance, Discharge, and Breach."
      },
      {
        id: "ca-ch-3",
        courseId: "course-ca-foundation",
        order: 3,
        chapterNumber: 3,
        title: "Chapter 3: The Sale of Goods Act, 1930",
        shortTitle: "Sale of Goods",
        sections: "Sections 1-66",
        description: "Formation of Contract of Sale, Conditions & Warranties, Transfer of Ownership & Title, Performance, and Unpaid Seller's Rights."
      },
      {
        id: "ca-ch-4",
        courseId: "course-ca-foundation",
        order: 4,
        chapterNumber: 4,
        title: "Chapter 4: The Indian Partnership Act, 1932",
        shortTitle: "Partnership Act",
        sections: "Sections 1-69 (Units 1, 2 & 3)",
        description: "General Nature of Partnership (Unit 1), Relations of Partners (Unit 2), Registration and Dissolution of Firm (Unit 3)."
      },
      {
        id: "ca-ch-5",
        courseId: "course-ca-foundation",
        order: 5,
        chapterNumber: 5,
        title: "Chapter 5: The Limited Liability Partnership Act, 2008",
        shortTitle: "LLP Act",
        sections: "Salient Features, Incorporation, Partners & Financial Disclosures",
        description: "Concept of LLP, Partners and their relations, Designated Partners, Conversion to LLP, and Winding Up."
      },
      {
        id: "ca-ch-6",
        courseId: "course-ca-foundation",
        order: 6,
        chapterNumber: 6,
        title: "Chapter 6: The Companies Act, 2013",
        shortTitle: "Companies Act",
        sections: "Essential Features, Corporate Veil, Classes of Companies, MOA & AOA",
        description: "Meaning of Company, Doctrine of Lifting Corporate Veil, Types of Companies, Promoters, Memorandum & Articles of Association."
      },
      {
        id: "ca-ch-7",
        courseId: "course-ca-foundation",
        order: 7,
        chapterNumber: 7,
        title: "Chapter 7: The Negotiable Instruments Act, 1881",
        shortTitle: "NI Act",
        sections: "Promissory Notes, Bills of Exchange, Cheques, Dishonour (Sec 138)",
        description: "Characteristics of Negotiable Instruments, Promissory Notes, Bills of Exchange, Cheques, Crossing, Endorsement, and Dishonour of Cheques."
      },
    ];

    // CSEET Business Law & Management Units
    const cseetUnits = [
      { id: "cseet-unit-1", courseId: "course-cseet", order: 1, chapterNumber: 1, title: "Unit 1: Indian Contract Act, 1872", shortTitle: "Contract Act", sections: "Offer, Acceptance, Consideration & Essentials", description: "Basics of Contract law for Company Secretary aspirants." },
      { id: "cseet-unit-2", courseId: "course-cseet", order: 2, chapterNumber: 2, title: "Unit 2: Sale of Goods Act, 1930", shortTitle: "Sale of Goods", sections: "Conditions, Warranties, Transfer of Property", description: "Sale of Goods principles, rights of buyers and sellers." },
      { id: "cseet-unit-3", courseId: "course-cseet", order: 3, chapterNumber: 3, title: "Unit 3: Indian Partnership Act, 1932", shortTitle: "Partnership Act", sections: "Formation, Rights, Liabilities, Dissolution", description: "Law of partnership fundamentals for CSEET." },
      { id: "cseet-unit-4", courseId: "course-cseet", order: 4, chapterNumber: 4, title: "Unit 4: Limited Liability Partnership Act, 2008", shortTitle: "LLP Act", sections: "Formation, Partners, Governance", description: "Hybrid corporate vehicle structure and regulations." },
      { id: "cseet-unit-5", courseId: "course-cseet", order: 5, chapterNumber: 5, title: "Unit 5: Companies Act, 2013 (Basics)", shortTitle: "Companies Act", sections: "Incorporation, Members, Directors, Meetings", description: "Introduction to Corporate law and corporate governance." },
      { id: "cseet-unit-6", courseId: "course-cseet", order: 6, chapterNumber: 6, title: "Unit 6: Negotiable Instruments Act, 1881", shortTitle: "NI Act", sections: "Promissory Notes, Bills, Cheques & Sec 138", description: "Commercial banking instruments and legal liabilities." },
      { id: "cseet-unit-7", courseId: "course-cseet", order: 7, chapterNumber: 7, title: "Unit 7: General Principles of Management", shortTitle: "Management", sections: "Planning, Organising, Directing, Controlling", description: "Foundational concepts of management, leadership and motivation." },
      { id: "cseet-unit-8", courseId: "course-cseet", order: 8, chapterNumber: 8, title: "Unit 8: Business Environment", shortTitle: "Business Env", sections: "Economic, Social, Technological & Legal Environment", description: "Macro and micro business environment analysis." },
    ];

    [...caFoundationActs, ...cseetUnits].forEach((act) => actsTable.insert(act));
    console.log("[Seeder] Acts/Units seeded.");
  }

  // 3. Seed Content (Notes, Practice Questions, PYPs, Flowcharts, LDR, Case Studies)
  if (contentTable.count() === 0) {
    console.log("[Seeder] Seeding Act-wise content...");

    const allContent = [
      // ==========================================
      // CA FOUNDATION — CHAPTER 4: PARTNERSHIP ACT (THE 3 SAMPLE PDF NOTES)
      // ==========================================
      {
        id: "content-ca-ch4-note-1",
        actId: "ca-ch-4",
        courseId: "course-ca-foundation",
        type: "notes",
        unitName: "Unit 1",
        title: "Unit 1: General Nature of Partnership — Detailed Notes",
        description: "Complete notes covering Definition of Partnership, True Test of Partnership (Mutual Agency), Partnership vs Co-ownership vs Joint Hindu Family, and Types of Partners.",
        fileUrl: "/notes/unit-1-general-nature-of-partnership.pdf",
        fileName: "UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf",
        isSample: true,
        status: "published",
      },
      {
        id: "content-ca-ch4-note-2",
        actId: "ca-ch-4",
        courseId: "course-ca-foundation",
        type: "notes",
        unitName: "Unit 2",
        title: "Unit 2: Relations of Partners — Detailed Notes",
        description: "Complete notes covering General Duties of Partners, Rights of Partners, Property of the Firm, Relations to Third Parties, Implied Authority & Liabilities.",
        fileUrl: "/notes/unit-2-relations-of-partners.pdf",
        fileName: "Unit 2 RELATIONS OF PARTNERS.pdf",
        isSample: true,
        status: "published",
      },
      {
        id: "content-ca-ch4-note-3",
        actId: "ca-ch-4",
        courseId: "course-ca-foundation",
        type: "notes",
        unitName: "Unit 3",
        title: "Unit 3: Registration and Dissolution of Firm — Detailed Notes",
        description: "Complete notes covering Procedure of Registration, Effects of Non-Registration (Section 69), Modes of Dissolution (Sections 40-44), and Settlement of Accounts.",
        fileUrl: "/notes/unit-3-registration-and-dissolution-of-firm.pdf",
        fileName: "Unit 3 REGISTRATION AND DISSOLUTION OF FIRM.pdf",
        isSample: true,
        status: "published",
      },
      {
        id: "content-ca-ch4-practice",
        actId: "ca-ch-4",
        courseId: "course-ca-foundation",
        type: "practice_questions",
        title: "Partnership Act — Chapter-wise Practice Questions",
        description: "Application and case-based questions on Mutual Agency, Minor admitted to benefits (Sec 30), Holding out (Sec 28), and Non-registration effects.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-ch4-flowchart",
        actId: "ca-ch-4",
        courseId: "course-ca-foundation",
        type: "flowchart",
        title: "Partnership Act — Flowcharts & Revision Maps",
        description: "Visual roadmap for Dissolution Modes (Sec 40-44), Section 69 Disabilities, and Rights of Outgoing Partners.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-ch4-ldr",
        actId: "ca-ch-4",
        courseId: "course-ca-foundation",
        type: "ldr",
        title: "Partnership Act — Last Day Revision (LDR) Capsule",
        description: "Quick-fire review of Section 4 Definition, Section 6 True Test, Section 19 Implied Authority limits, and Section 48 Settlement rules.",
        isSample: false,
        status: "published",
      },

      // ==========================================
      // CA FOUNDATION — CHAPTER 2: CONTRACT ACT
      // ==========================================
      {
        id: "content-ca-ch2-notes",
        actId: "ca-ch-2",
        courseId: "course-ca-foundation",
        type: "notes",
        title: "The Indian Contract Act, 1872 — Comprehensive Notes",
        description: "Unit-wise notes covering Nature of Contracts, Consideration, Capacity of Parties, Free Consent, Void Agreements, Performance, Discharge, and Remedies for Breach.",
        fileUrl: "/samples/The_Law_Kaksha_Clean_PDF_Template.pdf",
        fileName: "Contract_Act_Comprehensive_Notes.pdf",
        isSample: true,
        status: "published",
      },
      {
        id: "content-ca-ch2-practice",
        actId: "ca-ch-2",
        courseId: "course-ca-foundation",
        type: "practice_questions",
        title: "Contract Act — Case-Based Practice Questions & Model Solutions",
        description: "Structured legal problems on Anticipatory Breach, Doctrine of Frustration, Liquidated Damages vs Penalty, and Minor's Agreements.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-ch2-flowchart",
        actId: "ca-ch-2",
        courseId: "course-ca-foundation",
        type: "flowchart",
        title: "Contract Act — Visual Flowchart Master Chart",
        description: "Flowcharts for Communication of Offer & Acceptance (Sec 3-5), Exceptions to Consideration (Sec 25), and Types of Damages (Sec 73).",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-ch2-ldr",
        actId: "ca-ch-2",
        courseId: "course-ca-foundation",
        type: "ldr",
        title: "Contract Act — Last Day Revision (LDR) Summary",
        description: "Key statutory definitions, Section 10 checklist, Case laws (Mohori Bibee, Carlill, Balfour, Chinnaya), and Section 73 rules.",
        isSample: false,
        status: "published",
      },

      // ==========================================
      // CA FOUNDATION — CHAPTER 3: SALE OF GOODS ACT
      // ==========================================
      {
        id: "content-ca-ch3-notes",
        actId: "ca-ch-3",
        courseId: "course-ca-foundation",
        type: "notes",
        title: "The Sale of Goods Act, 1930 — Detailed Notes",
        description: "Notes on Formation of Contract of Sale, Conditions & Warranties (Sec 14-17), Transfer of Property (Sec 18-26), Rights of Unpaid Seller (Sec 45-54).",
        fileUrl: "/samples/Smart_Question_Bank_Sample.pdf",
        fileName: "Sale_of_Goods_Notes.pdf",
        isSample: true,
        status: "published",
      },
      {
        id: "content-ca-ch3-practice",
        actId: "ca-ch-3",
        courseId: "course-ca-foundation",
        type: "practice_questions",
        title: "Sale of Goods — Practice Questions & Problem Drills",
        description: "Application problems on Caveat Emptor exceptions (Sec 16), Nemo Dat Quod Non Habet (Sec 27), and Right of Stoppage in Transit.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-ch3-flowchart",
        actId: "ca-ch-3",
        courseId: "course-ca-foundation",
        type: "flowchart",
        title: "Sale of Goods — Flowcharts & Summary Trees",
        description: "Visual roadmap for Passing of Property in Ascertained vs Unascertained Goods and Unpaid Seller Remedies against Goods vs Buyer.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-ch3-ldr",
        actId: "ca-ch-3",
        courseId: "course-ca-foundation",
        type: "ldr",
        title: "Sale of Goods — LDR Fast Track Review",
        description: "Section 12 Condition vs Warranty table, Section 16(1) Fitness rule, Section 26 Risk follows property, Section 50 Stoppage conditions.",
        isSample: false,
        status: "published",
      },

      // ==========================================
      // CA FOUNDATION — CHAPTER 1, 5, 6, 7
      // ==========================================
      {
        id: "content-ca-ch1-notes",
        actId: "ca-ch-1",
        courseId: "course-ca-foundation",
        type: "notes",
        title: "Indian Regulatory Framework — Summary Notes",
        description: "Overview of Ministry of Finance, MCA, SEBI, RBI, CCI, IBBI, Supreme Court, High Courts, and NCLT hierarchy.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-ch5-notes",
        actId: "ca-ch-5",
        courseId: "course-ca-foundation",
        type: "notes",
        title: "Limited Liability Partnership Act, 2008 — Smart Notes",
        description: "Key features: Body corporate, Perpetual succession, Designated Partners (Sec 7), Incorporation Document (Sec 11), Annual Returns.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-ch6-notes",
        actId: "ca-ch-6",
        courseId: "course-ca-foundation",
        type: "notes",
        title: "Companies Act, 2013 — Smart Revision Notes",
        description: "Corporate personality, Lifting the veil (Salomon, Gilford, Daimler), Section 8 Non-profit companies, OPC, Small Company limits, MOA Doctrine of Ultra Vires.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-ch7-notes",
        actId: "ca-ch-7",
        courseId: "course-ca-foundation",
        type: "notes",
        title: "Negotiable Instruments Act, 1881 — Smart Notes",
        description: "Promissory Notes (Sec 4), Bills of Exchange (Sec 5), Cheques (Sec 6), Holder & HDC (Sec 8, 9), Dishonour of Cheque Sec 138 ingredients & notice rules.",
        isSample: false,
        status: "published",
      },

      // ==========================================
      // CA FOUNDATION — PREVIOUS YEAR PAPERS (LAST 4 PYPs)
      // ==========================================
      {
        id: "content-ca-pyp-may-2026",
        actId: null,
        courseId: "course-ca-foundation",
        type: "pyp",
        title: "May 2026 Examination Paper with Detailed Structured Solutions",
        description: "Complete ICAI May 2026 attempt paper with examiner keyword checklists, step-marking breakdown, and model legal answers.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-pyp-sep-2026",
        actId: null,
        courseId: "course-ca-foundation",
        type: "pyp",
        title: "September 2026 Examination Paper with Detailed Analysis",
        description: "Complete ICAI September 2026 attempt paper solved with Section-wise references and practical application reasoning.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-pyp-nov-2025",
        actId: null,
        courseId: "course-ca-foundation",
        type: "pyp",
        title: "November 2025 Examination Paper with Analysis",
        description: "Full question-by-question analysis of the November 2025 Business Laws exam paper.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-ca-pyp-may-2025",
        actId: null,
        courseId: "course-ca-foundation",
        type: "pyp",
        title: "May 2025 Examination Paper with Solutions",
        description: "Solved May 2025 paper highlighting recurring testable provisions and framing guidelines.",
        isSample: false,
        status: "published",
      },

      // ==========================================
      // CA FOUNDATION — MASTER LDR DESK
      // ==========================================
      {
        id: "content-ca-ldr-master",
        actId: null,
        courseId: "course-ca-foundation",
        type: "ldr",
        title: "1.5-Day Master Last Day Revision (LDR) Section Maps",
        description: "High-yield summary covering all 7 Chapters of CA Foundation Business Laws: Key sections, statutory limits, monetary penalties, and landmark case citations.",
        isSample: false,
        status: "published",
      },

      // ==========================================
      // CSEET CONTENT (MANAGEMENT SAMPLE NOTES + MCQS)
      // ==========================================
      {
        id: "content-cseet-unit7-notes",
        actId: "cseet-unit-7",
        courseId: "course-cseet",
        type: "notes",
        title: "General Principles of Management — Complete Notes",
        description: "Comprehensive notes covering Planning, Organising, Directing, Controlling, Leadership Theories, and Motivation.",
        fileUrl: "/samples/CSEET_Business_Management_Notes.pdf",
        fileName: "CSEET_Business_Management_Notes.pdf",
        isSample: true,
        status: "published",
      },
      {
        id: "content-cseet-unit1-notes",
        actId: "cseet-unit-1",
        courseId: "course-cseet",
        type: "notes",
        title: "Indian Contract Act — CSEET Foundation Notes",
        description: "Concept-focused notes on Essentials of a Valid Contract, Free Consent, and Legality of Object.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-cseet-unit1-practice",
        actId: "cseet-unit-1",
        courseId: "course-cseet",
        type: "practice_questions",
        title: "Contract Act — Chapter-wise MCQ Drill (50 Questions)",
        description: "High-speed MCQ test covering offer, acceptance, consideration, and breach.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-cseet-unit7-practice",
        actId: "cseet-unit-7",
        courseId: "course-cseet",
        type: "practice_questions",
        title: "Management Principles — Chapter-wise MCQ Practice",
        description: "MCQ drills on Fayol's 14 principles, Taylor's Scientific Management, Maslow's hierarchy, and Herzberg theory.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-cseet-pyp-2026",
        actId: null,
        courseId: "course-cseet",
        type: "pyp",
        title: "CSEET Previous Examination Questions & Solved Paper (2026)",
        description: "Comprehensive previous examination question bank with rationale for each correct MCQ option.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-cseet-flowchart",
        actId: null,
        courseId: "course-cseet",
        type: "flowchart",
        title: "CSEET — Flowchart & Visual Revision Book",
        description: "Mind-maps and quick recap tables for all 8 Units of Business Law & Management.",
        isSample: false,
        status: "published",
      },
      {
        id: "content-cseet-ldr",
        actId: null,
        courseId: "course-cseet",
        type: "ldr",
        title: "CSEET — Last Day Revision (LDR) Key Points",
        description: "Bullet-point quick revision deck for last-minute review before the computer-based exam.",
        isSample: false,
        status: "published",
      },
    ];

    allContent.forEach((c) => contentTable.insert(c));
    console.log("[Seeder] Content seeded.");
  }

  // 4. Seed Weekly Content (Featured prominently in dashboard)
  if (weeklyContentTable.count() === 0) {
    console.log("[Seeder] Seeding weekly content...");

    // CA Foundation — Weekly 3 Case Studies (Monster Monday, Midweek Law Madness, Final Boss Friday)
    weeklyContentTable.insert({
      id: "weekly-ca-current",
      courseId: "course-ca-foundation",
      type: "case_study",
      weekLabel: "Week 38 (Current Week)",
      theme: "3 new cases. Every week. Read. Think. Apply.",
      items: [
        {
          id: "case-monday",
          day: "Monday",
          label: "Monster Monday Case",
          badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
          title: "Anticipatory Breach & Duty to Mitigate Damages",
          actRef: "The Indian Contract Act, 1872 — Section 39 & Section 73",
          marks: 6,
          facts: "Aman enters into a contract with Bharat on 1st October to supply 500 bags of premium grade Basmati Rice at ₹4,000 per bag on 1st December. On 20th October, Aman informs Bharat via registered email that market rates have escalated and he will not supply the goods. On 20th October, the prevailing market rate was ₹4,400 per bag. Bharat chooses not to rescind the contract immediately and waits until 1st December. On 1st December, the market rate reaches ₹5,000 per bag. Meanwhile, Bharat buys 500 bags from the open market at ₹5,000 per bag on 1st December and sues Aman for ₹5,00,000 damages (₹1,000 per bag).",
          question: "Advise whether Bharat is entitled to claim damages calculated on 20th October or 1st December, and explain the legal principles governing Anticipatory Repudiation under the Indian Contract Act.",
          modelAnswer: {
            provision: "According to Section 39 of the Indian Contract Act, 1872, when a party to a contract has refused to perform his promise in its entirety, the promisee may put an end to the contract, unless he has signified his acquiescence in its continuance. Under Section 73, compensation for loss or damage caused by breach is measured by the difference between the contract price and market price on the date of breach.",
            application: "In this case, when Aman repudiated on 20th October (Anticipatory Breach), Bharat had two legal options: (1) Treat the breach as immediate and sue on 20th October, measuring damages at ₹400/bag; OR (2) Keep the contract alive until the due date (1st December) for the benefit of both parties. Since Bharat waited until 1st December, the contract remained operative, and damages are measured as on 1st December: Market Price (₹5,000) minus Contract Price (₹4,000) = ₹1,000 per bag.",
            conclusion: "Bharat is entitled to recover ₹5,00,000 (₹1,000 per bag) from Aman, provided he did not fail to take reasonable steps to mitigate avoidable losses after 1st December."
          }
        },
        {
          id: "case-wednesday",
          day: "Wednesday",
          label: "Midweek Law Madness",
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          title: "Implied Condition as to Fitness for Particular Purpose",
          actRef: "The Sale of Goods Act, 1930 — Section 16(1)",
          marks: 6,
          facts: "Riya informs a machinery dealer that she requires a machine for cutting 5 mm steel sheets in her workshop. The dealer recommends a particular machine, assuring her that it is suitable for the stated purpose. Riya purchases the machine relying on the dealer's recommendation. After delivery, she discovers that the machine cannot cut steel sheets of the required thickness, although it works for ordinary purposes.",
          question: "Advise Riya whether she can claim that the seller has breached an implied condition under the Sale of Goods Act, 1930.",
          modelAnswer: {
            provision: "According to Section 16(1) of the Sale of Goods Act, 1930, where the buyer makes known to the seller the particular purpose for which the goods are required, thereby relying on the seller's skill or judgment, and the goods are of a description that the seller ordinarily supplies in the course of business, there is an implied condition that the goods shall be reasonably fit for that purpose.",
            application: "In the present case, Riya informed the machinery dealer that she required a machine capable of cutting 5 mm steel sheets (communicated particular purpose). Further, the dealer recommended a machine and assured Riya of its suitability, and Riya relied on the dealer's skill or judgment. The machine failed to cut 5 mm sheets, violating fitness for purpose.",
            conclusion: "Subject to the remaining requirements of Section 16(1) being satisfied and no patent/trade name exception applying, Riya may claim that the seller has breached the implied condition as to fitness for a particular purpose and repudiate the contract."
          }
        },
        {
          id: "case-friday",
          day: "Friday",
          label: "Final Boss Friday",
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          title: "Implied Authority of Partner & Non-Registration Effects",
          actRef: "The Indian Partnership Act, 1932 — Section 19 & Section 69",
          marks: 6,
          facts: "A, B and C are partners in an unregistered firm 'Alpha Traders' carrying on wholesale cloth business. The partnership deed contains an express clause stating that no partner shall borrow money exceeding ₹50,000 without written consent of all partners. A borrows ₹2,00,000 from D in the firm's name for purchasing silk fabrics, telling D that the money is for the firm. D was unaware of the restriction in the partnership deed. A misappropriates the money and disappears. D sues B and C for ₹2,00,000. B and C contend that (1) A had no authority beyond ₹50,000, and (2) D cannot sue because Alpha Traders is an unregistered firm.",
          question: "Examine the validity of B & C's contentions under the Indian Partnership Act, 1932.",
          modelAnswer: {
            provision: "Under Section 19(1) of the Indian Partnership Act, 1932, the act of a partner done to carry on, in the usual way, business of the kind carried on by the firm, binds the firm. Borrowing money is within implied authority for a commercial/trading firm. Under Section 20, an internal restriction on implied authority does not bind third parties unless the third party had actual notice. Under Section 69, non-registration disables the firm from suing third parties, but DOES NOT prevent third parties from suing the firm or its partners.",
            application: "(1) Cloth trading is a commercial business where borrowing is an ordinary implied power. Since D had no notice of the internal ₹50,000 cap, the firm and all partners are bound. (2) Section 69 bars suits BY an unregistered firm, but third parties (like D) have full legal rights to sue the firm and its partners.",
            conclusion: "Both contentions of B and C fail. B and C are personally and jointly liable to pay ₹2,00,000 along with any applicable interest to D."
          }
        },
      ],
      status: "active",
    });

    // CSEET — Weekly 30-Question MCQ Test
    weeklyContentTable.insert({
      id: "weekly-cseet-current",
      courseId: "course-cseet",
      type: "mcq_test",
      weekLabel: "Week 38 (Current Week)",
      title: "Weekly 30-Question MCQ Test",
      description: "Exam-pattern practice test covering Indian Contract Act, Sale of Goods Act, and Principles of Management.",
      questionCount: 30,
      timeLimitMinutes: 30,
      totalMarks: 30,
      quizId: "quiz-cseet-weekly-current",
      status: "active",
    });

    console.log("[Seeder] Weekly content seeded.");
  }

  // 5. Seed Quizzes
  if (quizzesTable.count() === 0) {
    console.log("[Seeder] Seeding quizzes...");

    // CSEET Weekly 30-Q Quiz
    quizzesTable.insert({
      id: "quiz-cseet-weekly-current",
      courseId: "course-cseet",
      title: "CSEET Weekly 30-Question MCQ Test — Live Attempt",
      subtitle: "Exam-oriented MCQs covering Contract Act, Sale of Goods, Partnership & Management",
      level: "CSEET",
      subject: "Business Law & Management",
      time_limit_minutes: 30,
      total_marks: 30,
      positive_marks: 1,
      negative_marks: 0,
      is_free: 0,
      status: "ACTIVE",
      questions: [
        { id: "q1", question: "An agreement enforceable by law is defined as a contract under which section of the Indian Contract Act?", options: ["Section 2(h)", "Section 2(e)", "Section 10", "Section 2(a)"], correct_option_index: 0, explanation: "Section 2(h) of the Indian Contract Act, 1872 defines a contract as 'an agreement enforceable by law'." },
        { id: "q2", question: "In a contract of sale of goods, when the seller agrees to transfer property in goods to buyer for a price at a future date, it is called a ___.", options: ["Sale", "Agreement to sell", "Hire-purchase", "Bailment"], correct_option_index: 1, explanation: "Under Section 4(3) of Sale of Goods Act, 1930, transfer at a future time or subject to condition is an 'Agreement to Sell'." },
        { id: "q3", question: "The true test of a partnership under Section 6 of the Indian Partnership Act is ___.", options: ["Sharing of profits", "Capital contribution", "Mutual Agency", "Registered deed"], correct_option_index: 2, explanation: "Mutual agency (each partner acting as principal and agent for others) is the conclusive test of partnership (Cox v. Hickman)." },
        { id: "q4", question: "Who propounded the 14 Principles of Management?", options: ["F.W. Taylor", "Henri Fayol", "Max Weber", "Peter Drucker"], correct_option_index: 1, explanation: "Henri Fayol, known as the Father of Modern Operational Management, propounded the 14 Principles of Management." },
        { id: "q5", question: "Under the Companies Act 2013, an One Person Company (OPC) can have a maximum of how many directors?", options: ["1", "5", "15", "50"], correct_option_index: 2, explanation: "An OPC requires minimum 1 director and can have a maximum of 15 directors without a special resolution." },
        { id: "q6", question: "A cheque crossed with two parallel transverse lines without any words is known as ___.", options: ["Special Crossing", "General Crossing", "Restrictive Crossing", "Non-Negotiable Crossing"], correct_option_index: 1, explanation: "Section 123 of the NI Act 1881 defines General Crossing." },
        { id: "q7", question: "What is the minimum number of partners required to incorporate a Limited Liability Partnership (LLP)?", options: ["1", "2", "7", "10"], correct_option_index: 1, explanation: "Under Section 5 of the LLP Act 2008, any two or more persons associated for carrying on a lawful business may form an LLP." },
        { id: "q8", question: "Which of the following is NOT an essential element of a valid contract under Section 10?", options: ["Free consent", "Competency of parties", "Written and registered deed in every case", "Lawful consideration"], correct_option_index: 2, explanation: "Contracts may be oral or in writing unless a specific statute requires writing/registration." },
        { id: "q9", question: "According to Maslow's hierarchy of needs, which need appears at the topmost level?", options: ["Esteem needs", "Social needs", "Safety needs", "Self-Actualisation needs"], correct_option_index: 3, explanation: "Self-Actualisation is the highest level in Maslow's hierarchy of human needs." },
        { id: "q10", question: "In Sale of Goods, 'Nemo dat quod non habet' means ___.", options: ["Buyer beware", "No one can give what he does not have", "Goods must match sample", "Price must be money"], correct_option_index: 1, explanation: "Section 27 embodies the Latin maxim 'no one can transfer a better title than he himself possesses'." },
      ],
    });

    // CA Foundation Practice Quiz
    quizzesTable.insert({
      id: "quiz-ca-ch4-partnership",
      courseId: "course-ca-foundation",
      title: "CA Foundation — Partnership Act Unit-wise Quiz",
      subtitle: "Exam-standard questions on General Nature, Relations & Dissolution",
      level: "CA Foundation",
      subject: "Business Laws",
      chapter: "Chapter 4: The Indian Partnership Act, 1932",
      time_limit_minutes: 20,
      total_marks: 20,
      positive_marks: 2,
      negative_marks: 0.5,
      is_free: 1,
      status: "ACTIVE",
      questions: [
        { id: "ca1", question: "Under Section 30 of the Indian Partnership Act, a minor can be admitted to ___.", options: ["Full partnership liabilities", "Benefits of partnership only with consent of all partners", "Manage the firm independently", "Sign contracts on behalf of the firm"], correct_option_index: 1, explanation: "A minor cannot be a full partner, but may with consent of all existing partners be admitted to the benefits of partnership." },
        { id: "ca2", question: "An unregistered firm cannot file a suit against a third party if the claim value exceeds ___.", options: ["₹100", "₹1,000", "₹10,000", "Any amount (complete bar under Section 69)"], correct_option_index: 0, explanation: "Section 69(3) provides a very limited exception for set-off not exceeding ₹100; otherwise suits by an unregistered firm to enforce contractual rights are barred." },
        { id: "ca3", question: "Which mode of dissolution does NOT require an order of the Court under Section 44?", options: ["Unsoundness of mind of partner", "Permanent incapacity", "Dissolution by notice in partnership at will (Section 43)", "Persistent breach of agreement"], correct_option_index: 2, explanation: "In a partnership at will, any partner can dissolve the firm without court intervention by giving written notice to all other partners under Section 43." },
      ],
    });

    console.log("[Seeder] Quizzes seeded.");
  }

  // 6. Seed Default Administrator User
  if (usersTable.count() === 0) {
    console.log("[Seeder] Seeding default administrator account...");

    const adminPasswordHash = await bcrypt.hash("AdminSecurePassword2026!", 10);

    usersTable.insert({
      id: "usr-admin-001",
      student_id: "LK-ADM-000001",
      name: "The Law Kaksha Admin",
      email: "admin@thelawkaksha.com",
      phone: "+91 99999 88888",
      password_hash: adminPasswordHash,
      role: "admin",
      selectedCourse: null,
      is_active: 1,
    });

    console.log("[Seeder] Administrator seeded successfully.");
  }

  console.log("[Seeder] Seeding complete.");
}

module.exports = seed;
