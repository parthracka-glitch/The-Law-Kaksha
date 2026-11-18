/**
 * The Law Kaksha - Curriculum Automation Engine
 * 
 * Provides:
 * 1. Automated Daily MCQ (QOTD) rotating deterministically every 24 hours at 00:00.
 * 2. Automated Weekly Case Studies (Monster Monday, Midweek Law Madness, Final Boss Friday)
 *    rotating every calendar week across an 8-week structured ICAI curriculum vault.
 * 3. Transparent admin override support: if admin pins a custom QOTD or Weekly Case,
 *    it honors the admin's pin; otherwise it smoothly runs on autopilot 365 days a year.
 */

const SiteSetting = require("../models/SiteSetting");
const WeeklyCase = require("../models/WeeklyCase");
const { isConnected } = require("../db/mongo");

// ============================================================================
// 1. 30-DAY HIGH-YIELD DAILY MCQ BANK (ICAI & CSEET PATTERN)
// ============================================================================
const DAILY_MCQ_BANK = [
  {
    id: "qotd-auto-01",
    subject: "The Sale of Goods Act, 1930",
    act: "The Sale of Goods Act, 1930",
    section: "Section 16(1)",
    statutoryRef: "Section 16(1) • Caveat Emptor Exception",
    question: "Under Section 16(1) of the Sale of Goods Act, 1930, when is an implied condition as to quality or fitness created without an express declaration by the buyer?",
    options: [
      "When the good is capable of only one obvious normal use and the buyer relies on the seller's skill or judgment.",
      "Whenever the goods are purchased from any retail grocery store for cash consideration.",
      "Only when a written manufacturer warranty card is signed and stamped.",
      "Never, because the doctrine of Caveat Emptor applies strictly to all commercial sales."
    ],
    correctOption: 0,
    correctIndex: 0,
    explanation: "Under Section 16(1) (Priest v. Last), where goods are by their very nature capable of only one obvious use, the purpose is deemed disclosed by implication. If the buyer relies on the seller's judgment, an implied condition of fitness arises.",
    explanationTitle: "Implied Purpose Rule (Priest v. Last)",
    keyDistinction: "Buyer need not state the purpose if the item has only one obvious function (e.g., hot water bottle).",
    xpReward: 15,
  },
  {
    id: "qotd-auto-02",
    subject: "The Indian Contract Act, 1872",
    act: "The Indian Contract Act, 1872",
    section: "Section 2(d)",
    statutoryRef: "Section 2(d) • Privity of Consideration",
    question: "In India, consideration for a promise may move from the promisee or any other person. Which landmark English rule does Indian law NOT follow?",
    options: [
      "Doctrine of Estoppel",
      "Rule that consideration must move from the promisee only (Tweedle v. Atkinson)",
      "Rule that past consideration is valid",
      "Doctrine of Promissory Estoppel"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Indian law (Chinnaya v. Ramaya & Sec 2(d)), consideration may move from the promisee 'or any other person'. Thus, stranger to consideration can sue, unlike English law (Tweedle v. Atkinson).",
    explanationTitle: "Stranger to Consideration (Chinnaya v. Ramaya)",
    keyDistinction: "In India, a stranger to consideration can enforce a promise, but a stranger to contract generally cannot.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-03",
    subject: "The Indian Partnership Act, 1932",
    act: "The Indian Partnership Act, 1932",
    section: "Section 28",
    statutoryRef: "Section 28 • Partner by Holding Out",
    question: "When a retired partner's name is retained on the firm's letterhead without giving public notice, third parties dealing with the firm can hold them liable under:",
    options: [
      "Doctrine of Subrogation",
      "Doctrine of Holding Out (Estoppel)",
      "Doctrine of Ultra Vires",
      "Doctrine of Novation"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 28 of the Indian Partnership Act, 1932, anyone who represents or knowingly allows themselves to be represented as a partner is liable as a partner by holding out to anyone who gave credit on faith of such representation.",
    explanationTitle: "Holding Out Principle (Sec 28)",
    keyDistinction: "A partner by holding out is liable for debts, but has no ownership rights or share in profits.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-04",
    subject: "The Companies Act, 2013",
    act: "The Companies Act, 2013",
    section: "Section 2(6)",
    statutoryRef: "Section 2(6) • Associate Company",
    question: "Under the Companies Act, 2013, an 'Associate Company' in relation to another company means a company in which that other company has a 'significant influence'. What is the minimum control required?",
    options: [
      "Control of at least 10% of total voting power",
      "Control of at least 20% of total voting power, or participation in business decisions under an agreement",
      "Control of more than 50% of paid-up equity share capital",
      "Holding at least 26% of total debentures"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 2(6) of the Companies Act, 2013, 'significant influence' means control of at least 20% of total voting power, or control of/participation in business decisions under an agreement.",
    explanationTitle: "Significant Influence Threshold",
    keyDistinction: "20% or more creates an Associate Company; more than 50% creates a Subsidiary Company.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-05",
    subject: "The Negotiable Instruments Act, 1881",
    act: "The Negotiable Instruments Act, 1881",
    section: "Section 138",
    statutoryRef: "Section 138 • Dishonour of Cheque",
    question: "Upon receipt of information regarding the dishonour of a cheque, within how many days must the payee send a statutory demand notice to the drawer under Section 138?",
    options: [
      "15 days",
      "30 days",
      "45 days",
      "60 days"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "The payee must make a demand for the payment of the said amount by giving a notice in writing to the drawer within 30 days of the receipt of information from the bank regarding the return of the cheque as unpaid.",
    explanationTitle: "Statutory Notice Window (Sec 138)",
    keyDistinction: "Notice must be sent within 30 days; the drawer has 15 days from notice receipt to make payment.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-06",
    subject: "The Indian Contract Act, 1872",
    act: "The Indian Contract Act, 1872",
    section: "Section 11",
    statutoryRef: "Section 11 • Capacity of Minor",
    question: "A minor fraudulently represents himself to be of full age and enters into an agreement to borrow ₹50,000 from a lender. Can the lender enforce the contract or plead estoppel against the minor?",
    options: [
      "Yes, because fraud vitiates all legal protections.",
      "No, the rule of estoppel does not apply against a minor (Mohori Bibee v. Dharmodas Ghose).",
      "Yes, but only with permission from the High Court.",
      "Yes, the minor must repay the entire amount with compound interest."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "A minor's agreement is void ab initio. The rule of estoppel cannot be pleaded against a minor to make him liable on a void agreement (Mohori Bibee v. Dharmodas Ghose). If money is traceable, equity may order restitution, but the contract is unenforceable.",
    explanationTitle: "No Estoppel Against Minor",
    keyDistinction: "A minor cannot be sued on contract; restitution is allowed only for traceable goods/funds (Sec 33 SRA).",
    xpReward: 15,
  },
  {
    id: "qotd-auto-07",
    subject: "The Sale of Goods Act, 1930",
    act: "The Sale of Goods Act, 1930",
    section: "Section 26",
    statutoryRef: "Section 26 • Risk Follows Property",
    question: "Under Section 26 of the Sale of Goods Act, 1930, goods remain at the seller's risk until property therein is transferred to the buyer. What is the statutory exception when delivery is delayed through the fault of either party?",
    options: [
      "Risk automatically shifts to the insurance carrier.",
      "Goods are at the risk of the party in default as regards any loss which might not have occurred but for such fault.",
      "The contract becomes automatically void for frustration.",
      "The seller must provide replacement goods free of cost."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under the proviso to Section 26 (Demby Hamilton & Co Ltd v. Barden), where delivery is delayed through the fault of either buyer or seller, the goods are at the risk of the party in fault as regards any loss which might not have occurred but for such fault.",
    explanationTitle: "Proviso to Section 26 (Demby Hamilton Case)",
    keyDistinction: "Fault-based delay shifts risk of consequential loss to the delaying party, even before property passes.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-08",
    subject: "The Indian Partnership Act, 1932",
    act: "The Indian Partnership Act, 1932",
    section: "Section 6",
    statutoryRef: "Section 6 • Mode of Determining Existence of Partnership",
    question: "Which of the following is the true, conclusive test for determining the existence of a partnership under Section 6 of the Indian Partnership Act, 1932?",
    options: [
      "Sharing of net profits alone",
      "Mutual agency (business carried on by all or any of them acting for all)",
      "Equal capital contribution by all members",
      "Registration of the partnership deed with the Registrar of Firms"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "As laid down in Cox v. Hickman and codified in Section 6, sharing of profits is prima facie evidence, but the true and conclusive test of partnership is mutual agency (whether each partner is both a principal and an agent for others).",
    explanationTitle: "The Cardinal Test: Mutual Agency",
    keyDistinction: "Profit sharing is prima facie evidence; mutual agency is the conclusive test.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-09",
    subject: "The Limited Liability Partnership Act, 2008",
    act: "The Limited Liability Partnership Act, 2008",
    section: "Section 7",
    statutoryRef: "Section 7 • Designated Partners",
    question: "Every Limited Liability Partnership (LLP) must have at least two designated partners who are individuals. What is the statutory requirement regarding their residency in India?",
    options: [
      "Both designated partners must be residents in India.",
      "At least one of the designated partners must be a resident in India.",
      "Residency in India is not mandatory if capital exceeds ₹1 crore.",
      "At least three designated partners must be residents in India."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 7(1) of the LLP Act, 2008, every LLP shall have at least two designated partners who are individuals, and at least one of them shall be a resident in India (stayed in India for not less than 120 days during the financial year).",
    explanationTitle: "Residency of Designated Partner",
    keyDistinction: "Minimum 2 designated partners, and at least 1 must be resident in India.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-10",
    subject: "The Companies Act, 2013",
    act: "The Companies Act, 2013",
    section: "Corporate Veil",
    statutoryRef: "Judicial Exceptions • Lifting Corporate Veil",
    question: "In Daimler Co. Ltd. v. Continental Tyre & Rubber Co., on what ground did the court lift the corporate veil of the company registered in England?",
    options: [
      "To prevent evasion of income tax",
      "To determine the enemy character of the company during wartime",
      "To punish directors for fraudulent trading",
      "To enforce specific performance against promoters"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "In Daimler Co. Ltd. v. Continental Tyre & Rubber Co., although the company was incorporated in England, its shares and effective control were held by German residents during World War I. The court lifted the veil to reveal its enemy character.",
    explanationTitle: "Determination of Enemy Character",
    keyDistinction: "The corporate entity cannot be used as a cloak to trade with alien enemies during wartime.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-11",
    subject: "The Indian Contract Act, 1872",
    act: "The Indian Contract Act, 1872",
    section: "Section 25(1)",
    statutoryRef: "Section 25(1) • Agreement on Natural Love and Affection",
    question: "An agreement made without consideration is void under Section 25. Which of the following conditions is NOT required for an agreement to be valid under the natural love and affection exception?",
    options: [
      "It must be expressed in writing and registered under the law for the time being in force.",
      "It must be made on account of natural love and affection between parties standing in near relation.",
      "The promisee must be suffering from a permanent physical disability.",
      "The agreement must be made out of natural love and affection, not near relation coupled with quarrel (Rajlukhy Dabee v. Bhootnath)."
    ],
    correctOption: 2,
    correctIndex: 2,
    explanation: "Under Section 25(1), the essentials are: (1) Written document, (2) Registered under law, (3) Near relation between parties, and (4) Natural love and affection. Physical disability of the promisee is completely irrelevant.",
    explanationTitle: "Section 25(1) Four Pillars",
    keyDistinction: "Near relation alone is not enough; there must be real affection and absence of quarrel.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-12",
    subject: "The Sale of Goods Act, 1930",
    act: "The Sale of Goods Act, 1930",
    section: "Section 27",
    statutoryRef: "Section 27 • Nemo Dat Quod Non Habet",
    question: "Which of the following is an exception to the rule 'Nemo dat quod non habet' (No one can give what they do not possess) under the Sale of Goods Act, 1930?",
    options: [
      "Sale by a thief who stole goods from a warehouse",
      "Sale by a mercantile agent acting in the ordinary course of business with consent of the owner",
      "Sale of mortgaged property without notifying the mortgagee",
      "Sale by a gratuitous bailee to a stranger for nominal price"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 27 proviso (Folkes v. King), a mercantile agent in possession of goods with the consent of the owner can pass good title if selling in ordinary course of business to a buyer acting in good faith without notice of lack of authority.",
    explanationTitle: "Mercantile Agent Exception",
    keyDistinction: "Good faith buyer from mercantile agent gets better title than the agent himself had.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-13",
    subject: "The Indian Partnership Act, 1932",
    act: "The Indian Partnership Act, 1932",
    section: "Section 30",
    statutoryRef: "Section 30 • Minor Admitted to Benefits",
    question: "A minor is admitted to the benefits of a partnership. Within how many months after attaining majority (or obtaining knowledge of admission, whichever is later) must he give public notice deciding whether to become a partner?",
    options: [
      "30 days",
      "3 months",
      "6 months",
      "12 months"
    ],
    correctOption: 2,
    correctIndex: 2,
    explanation: "Under Section 30(5) of the Indian Partnership Act, 1932, a minor has 6 months from the date of attaining majority or from obtaining knowledge of his admission, whichever is later, to give public notice electing to become or not to become a partner.",
    explanationTitle: "6-Month Election Window (Sec 30(5))",
    keyDistinction: "If the minor fails to give public notice within 6 months, he automatically becomes a full partner upon expiry.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-14",
    subject: "The Companies Act, 2013",
    act: "The Companies Act, 2013",
    section: "Section 8",
    statutoryRef: "Section 8 • Companies with Charitable Objects",
    question: "Which of the following statements regarding a Section 8 Company under the Companies Act, 2013 is TRUE?",
    options: [
      "It can pay annual dividends to its members up to a maximum of 10%.",
      "It is completely prohibited from paying any dividend to its members and must apply its profits to promote its objects.",
      "It must have a minimum paid-up share capital of ₹50 Lakhs.",
      "It is mandatory to use 'Limited' or 'Private Limited' at the end of its name."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 8(1) of the Companies Act, 2013, a Section 8 company intends to apply its profits in promoting its objects and prohibits the payment of any dividend to its members. The Central Government may grant a license without the words 'Limited' or 'Private Limited'.",
    explanationTitle: "Zero Dividend Rule for Sec 8",
    keyDistinction: "Profits must be ploughed back into charitable objects; dividend distribution is prohibited.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-15",
    subject: "The Negotiable Instruments Act, 1881",
    act: "The Negotiable Instruments Act, 1881",
    section: "Section 9",
    statutoryRef: "Section 9 • Holder in Due Course (HDC)",
    question: "Which of the following is NOT an essential requirement to qualify as a 'Holder in Due Course' under Section 9 of the Negotiable Instruments Act, 1881?",
    options: [
      "Must have become the possessor or payee of the instrument for valuable consideration.",
      "Must have obtained the instrument before maturity.",
      "Must have obtained the instrument without sufficient cause to believe that any defect existed in title.",
      "Must be a blood relative of the original maker or drawer."
    ],
    correctOption: 3,
    correctIndex: 3,
    explanation: "Under Section 9, the essentials of HDC are: (1) Possession for consideration, (2) Before maturity, (3) In good faith and without notice of defect in title. Blood relationship is entirely irrelevant.",
    explanationTitle: "HDC Triad: Consideration, Maturity, Good Faith",
    keyDistinction: "An HDC takes the instrument free from all prior defects of title.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-16",
    subject: "The Indian Contract Act, 1872",
    act: "The Indian Contract Act, 1872",
    section: "Section 56",
    statutoryRef: "Section 56 • Doctrine of Frustration",
    question: "Under Section 56, which of the following circumstances does NOT constitute frustration of contract (supervening impossibility)?",
    options: [
      "Destruction of the specific subject matter of the contract (Taylor v. Caldwell)",
      "Commercial hardship, strikes, or abnormal increase in prices",
      "Declaration of war between the countries of the contracting parties",
      "Death or personal incapacity of the party in a contract of personal service"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "As settled in Satyabrata Ghose v. Mugneeram Bangur, mere commercial hardship, price escalation, or strikes do not discharge a contract under Section 56. Performance must have become fundamentally impossible or unlawful.",
    explanationTitle: "Commercial Hardship ≠ Frustration",
    keyDistinction: "Performance becoming difficult or expensive is not frustration; physical/legal impossibility is required.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-17",
    subject: "The Sale of Goods Act, 1930",
    act: "The Sale of Goods Act, 1930",
    section: "Section 12",
    statutoryRef: "Section 12 • Condition vs Warranty",
    question: "A stipulation in a contract of sale with reference to goods may be a condition or a warranty. If a condition is breached, what is the buyer's primary statutory remedy?",
    options: [
      "Claim damages only; contract cannot be repudiated.",
      "Repudiate the contract and reject the goods, or treat the breach of condition as breach of warranty.",
      "Forfeit the seller's security deposit automatically.",
      "File a criminal FIR against the seller under Section 420 IPC."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 12(2) of the Sale of Goods Act, a condition is a stipulation essential to the main purpose of the contract, the breach of which gives rise to a right to treat the contract as repudiated. The buyer may also waive it and claim damages.",
    explanationTitle: "Breach of Condition Remedy",
    keyDistinction: "Condition breach = Right to reject goods + damages. Warranty breach = Claim damages only.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-18",
    subject: "The Indian Partnership Act, 1932",
    act: "The Indian Partnership Act, 1932",
    section: "Section 69",
    statutoryRef: "Section 69 • Non-Registration Disabilities",
    question: "Under Section 69 of the Indian Partnership Act, 1932, what is the legal disability faced by an unregistered firm regarding civil suits?",
    options: [
      "The firm cannot be sued by third parties under any circumstances.",
      "The firm or its partners cannot file a suit against third parties to enforce a contractual right exceeding ₹100.",
      "Partners of an unregistered firm face immediate criminal prosecution.",
      "All contracts entered into by an unregistered firm are completely void ab initio."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 69(2), an unregistered firm cannot file a suit to enforce a right arising from a contract against any third party if the claim exceeds ₹100. However, third parties can always sue an unregistered firm.",
    explanationTitle: "Civil Disability of Unregistered Firm",
    keyDistinction: "Unregistered firm cannot sue third parties; but third parties CAN sue the unregistered firm.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-19",
    subject: "The Companies Act, 2013",
    act: "The Companies Act, 2013",
    section: "Doctrine of Indoor Management",
    statutoryRef: "Royal British Bank v. Turquand",
    question: "The Doctrine of Indoor Management protects third parties dealing with a company from internal irregularities. Which of the following is an EXCEPTION to this protective doctrine?",
    options: [
      "Where the third party had actual knowledge of the internal irregularity (Howard v. Patent Ivory Co.)",
      "Where the transaction is within the apparent power of the managing director",
      "Where the company's Articles of Association are registered with the ROC",
      "Where the transaction was approved in an ordinary board meeting"
    ],
    correctOption: 0,
    correctIndex: 0,
    explanation: "Exceptions to the Turquand Rule include: (1) Knowledge of irregularity, (2) Suspicion of irregularity / Negligence, and (3) Forgery (Ruben v. Great Fingall Consolidated). If the outsider knew of the irregularity, indoor management cannot protect them.",
    explanationTitle: "Exceptions to Indoor Management",
    keyDistinction: "Outsiders are entitled to assume internal regularity unless they have actual or constructive knowledge of irregularity.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-20",
    subject: "The Indian Contract Act, 1872",
    act: "The Indian Contract Act, 1872",
    section: "Section 73",
    statutoryRef: "Section 73 • Hadley v. Baxendale Principle",
    question: "Under Section 73 of the Indian Contract Act, when a contract is breached, the party who suffers is entitled to receive compensation for loss or damage which:",
    options: [
      "Naturally arose in the usual course of things, or which parties knew to be likely to result from breach.",
      "Includes remote and indirect loss suffered by reason of the breach.",
      "Equal to ten times the contract value as punitive damages.",
      "Covering all psychological distress caused by the defendant."
    ],
    correctOption: 0,
    correctIndex: 0,
    explanation: "Codifying Hadley v. Baxendale, Section 73 provides that damages are recoverable for loss naturally arising in usual course (General Damages) or special loss within contemplation of both parties at time of contract (Special Damages). Remote losses are not recoverable.",
    explanationTitle: "Ordinary vs Special Damages (Sec 73)",
    keyDistinction: "No compensation is awarded for remote or indirect loss or damage.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-21",
    subject: "The Companies Act, 2013",
    act: "The Companies Act, 2013",
    section: "Section 2(85)",
    statutoryRef: "Section 2(85) • Small Company",
    question: "Under the Companies Act, 2013 (as amended), which of the following companies can NEVER be classified as a 'Small Company'?",
    options: [
      "A Private Company with paid-up capital of ₹2 crore and turnover of ₹15 crore",
      "A Public Limited Company, a Holding Company, or a Subsidiary Company",
      "A private company registered under MCA after 2020",
      "A private company with only two directors"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 2(85) proviso, a Small Company status can NEVER apply to: (1) A Public Company, (2) A Holding or Subsidiary Company, (3) A Section 8 Company, or (4) A company governed by any Special Act.",
    explanationTitle: "Small Company Ineligibility Rule",
    keyDistinction: "A public company or subsidiary of another company can never be a Small Company, regardless of turnover.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-22",
    subject: "The Sale of Goods Act, 1930",
    act: "The Sale of Goods Act, 1930",
    section: "Section 47 & 50",
    statutoryRef: "Section 50 • Right of Stoppage in Transit",
    question: "When does an unpaid seller's Right of Lien end and the Right of Stoppage in Transit begin under the Sale of Goods Act, 1930?",
    options: [
      "Lien ends when seller parts with possession to a carrier; stoppage in transit begins while goods are in transit and buyer has become insolvent.",
      "Both lien and stoppage in transit can be exercised simultaneously at any time.",
      "Stoppage in transit can only be exercised after goods are physically delivered to buyer's warehouse.",
      "Right of lien never ends until full cash is deposited in the seller's bank account."
    ],
    correctOption: 0,
    correctIndex: 0,
    explanation: "Under Section 47 & 50, Lien depends on actual physical possession. When seller parts with possession to a carrier, lien is lost. Stoppage in transit commences when goods are in transit, provided the buyer has become insolvent.",
    explanationTitle: "Lien vs Stoppage in Transit",
    keyDistinction: "Lien requires possession; stoppage requires transit + buyer insolvency.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-23",
    subject: "The Indian Contract Act, 1872",
    act: "The Indian Contract Act, 1872",
    section: "Section 16",
    statutoryRef: "Section 16 • Undue Influence",
    question: "In which of the following relationships does the law presume the existence of a dominant position causing Undue Influence under Section 16(2)?",
    options: [
      "Husband and Wife",
      "Parent and Child / Guardian and Ward",
      "Landlord and Tenant",
      "Creditor and Debtor"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 16(2), a person is deemed to be in a position to dominate the will of another where he holds real or apparent authority, or stands in a fiduciary relation (Parent-Child, Doctor-Patient, Lawyer-Client, Spiritual Guru-Disciple). Husband-Wife and Landlord-Tenant do not carry this presumption.",
    explanationTitle: "Fiduciary Presumption of Undue Influence",
    keyDistinction: "Parent-child carries statutory presumption; husband-wife does not carry automatic presumption.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-24",
    subject: "The Limited Liability Partnership Act, 2008",
    act: "The Limited Liability Partnership Act, 2008",
    section: "Section 28",
    statutoryRef: "Section 28 • Extent of Partner Liability",
    question: "Under the LLP Act, 2008, what is the extent of liability of a partner for the wrongful acts or omissions of another partner?",
    options: [
      "Every partner is jointly and severally liable for all wrongful acts of any other partner.",
      "A partner is not personally liable for the wrongful act or omission of any other partner in which he was not involved.",
      "The designated partner alone is criminally liable for all acts.",
      "All partners forfeit their entire personal property to compensate the firm."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 28(2) of the LLP Act, 2008, a partner is not personally liable, directly or indirectly, for an obligation of the LLP solely by reason of being a partner, and is not liable for wrongful acts of other partners in which he was not involved.",
    explanationTitle: "Shield Against Mutual Agency Liability",
    keyDistinction: "Unlike general partnership, an LLP partner is not liable for another partner's independent wrongdoing.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-25",
    subject: "The Negotiable Instruments Act, 1881",
    act: "The Negotiable Instruments Act, 1881",
    section: "Section 15",
    statutoryRef: "Section 15 & 16 • Endorsement in Blank",
    question: "When the endorser signs his name only on the negotiable instrument without writing the name of any endorsee, what is this endorsement called?",
    options: [
      "Endorsement in Full",
      "Endorsement in Blank (or General Endorsement)",
      "Restrictive Endorsement",
      "Conditional Endorsement"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 16(1), if the endorser signs his name only, the endorsement is said to be 'in blank'. Such an instrument becomes payable to bearer and can be negotiated by simple delivery alone.",
    explanationTitle: "Endorsement in Blank Effect",
    keyDistinction: "Endorsement in blank converts an order instrument into a bearer instrument negotiated by delivery.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-26",
    subject: "The Indian Contract Act, 1872",
    act: "The Indian Contract Act, 1872",
    section: "Section 39",
    statutoryRef: "Section 39 • Anticipatory Breach",
    question: "When a party to a contract refuses to perform his promise in its entirety before the due date of performance, what is this called?",
    options: [
      "Actual Breach of Contract",
      "Anticipatory Breach of Contract (Hochster v. De La Tour)",
      "Quasi-Contractual Discharge",
      "Executory Consideration"
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 39 (Hochster v. De La Tour), when a party refuses performance before the arrival of the due date, it is an Anticipatory Breach. The aggrieved party may treat it as an immediate breach and sue at once, or keep the contract alive until the due date.",
    explanationTitle: "Anticipatory Breach Remedies",
    keyDistinction: "Aggrieved party can sue immediately or wait until the due date of performance.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-27",
    subject: "The Sale of Goods Act, 1930",
    act: "The Sale of Goods Act, 1930",
    section: "Section 15",
    statutoryRef: "Section 15 • Sale by Description",
    question: "In a contract for the sale of goods by description, there is an implied condition that the goods shall correspond with the description. If goods also correspond with sample but not description:",
    options: [
      "The buyer must accept the goods because sample takes precedence.",
      "The buyer is entitled to reject the goods because goods must correspond with both sample and description (Sec 15).",
      "The seller is entitled to charge double price.",
      "The contract is automatically converted into an auction sale."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 15 of the Sale of Goods Act (Nichol v. Godts), where goods are sold by sample as well as by description, it is not sufficient that the bulk corresponds with the sample if the goods do not also correspond with the description.",
    explanationTitle: "Sample + Description Rule (Nichol v. Godts)",
    keyDistinction: "Matching the sample is not an excuse for failing to match the statutory description.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-28",
    subject: "The Indian Partnership Act, 1932",
    act: "The Indian Partnership Act, 1932",
    section: "Section 7",
    statutoryRef: "Section 7 • Partnership at Will",
    question: "A partnership is a 'Partnership at Will' under Section 7 of the Indian Partnership Act, 1932 when:",
    options: [
      "No fixed period is agreed upon for the duration of the partnership, and no provision is made for its determination.",
      "The partners have agreed to run the firm for exactly 5 years.",
      "The firm is formed specifically to construct a commercial bridge.",
      "All partners are blood relatives."
    ],
    correctOption: 0,
    correctIndex: 0,
    explanation: "Under Section 7, where no provision is made by contract between the partners for the duration of their partnership or for the determination of their partnership, the partnership is 'Partnership at Will'. Any partner can dissolve it by giving notice in writing (Sec 43).",
    explanationTitle: "Partnership at Will Characteristics",
    keyDistinction: "Dissolvable at any time by any single partner giving written notice of dissolution.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-29",
    subject: "The Companies Act, 2013",
    act: "The Companies Act, 2013",
    section: "Section 2(62)",
    statutoryRef: "Section 2(62) • One Person Company (OPC)",
    question: "Under the Companies Act, 2013, what is the mandatory requirement regarding the nominee of a One Person Company (OPC)?",
    options: [
      "The nominee must be a corporate body registered in India.",
      "The memorandum must state the name of a natural person who is an Indian citizen who shall become the member in the event of subscriber's death or incapacity.",
      "An OPC cannot have any nominee until capital exceeds ₹50 Lakhs.",
      "The nominee must hold at least 49% of the voting power."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 3(1)(c) and Rule 3 of Companies (Incorporation) Rules, the subscriber to the Memorandum of an OPC must nominate a natural person who is an Indian citizen, who shall, in the event of the subscriber's death or incapacity to contract, become the member.",
    explanationTitle: "OPC Nominee Rule",
    keyDistinction: "Nominee must be an individual natural person and Indian citizen with prior written consent.",
    xpReward: 15,
  },
  {
    id: "qotd-auto-30",
    subject: "The Indian Contract Act, 1872",
    act: "The Indian Contract Act, 1872",
    section: "Section 68 to 72",
    statutoryRef: "Section 70 • Non-Gratuitous Acts",
    question: "Under Section 70 of the Indian Contract Act, where a person lawfully does anything for another person, not intending to do so gratuitously, and such other person enjoys the benefit thereof, the latter is bound to:",
    options: [
      "Face criminal prosecution under Section 406 IPC for criminal breach of trust.",
      "Make compensation to the former in respect of, or to restore, the thing so done or delivered.",
      "Pay punitive interest at 24% per annum from the date of benefit.",
      "Nothing, because without express consent no contract exists."
    ],
    correctOption: 1,
    correctIndex: 1,
    explanation: "Under Section 70 (Quasi-Contract based on Quantum Meruit and prevention of unjust enrichment), if acts are done lawfully, non-gratuitously, and benefit is enjoyed, compensation or restoration is mandatory.",
    explanationTitle: "Non-Gratuitous Benefit (Sec 70)",
    keyDistinction: "Prevents unjust enrichment where services were rendered expecting payment.",
    xpReward: 15,
  },
];

// ============================================================================
// 2. 8-WEEK STRUCTURED CASE STUDY REPOSITORY (MONSTER MON, MIDWEEK, FINAL BOSS)
// ============================================================================
const WEEKLY_CASE_VAULT = [
  // --- WEEK 1 ---
  [
    {
      id: "w1-mon",
      day: "Monster Monday",
      badge: "Contract Act 1872",
      subject: "The Indian Contract Act, 1872",
      title: "Anticipatory Breach & Duty to Mitigate Losses",
      marks: "6 Marks (ICAI Standard)",
      scenario: "Aarav entered into a contract with Bharat on 1st March to deliver 500 bags of basmati rice at ₹2,000 per bag on 15th April. On 20th March, Aarav expressly informed Bharat via email that he would not be able to supply the rice as prices had skyrocketed in the wholesale market. On 20th March, the market price was ₹2,200 per bag. Bharat did not accept the repudiation and waited till 15th April. On 15th April, the market price touched ₹2,600 per bag. Bharat now sues Aarav claiming damages at ₹600 per bag (difference between contract price ₹2,000 and 15th April price ₹2,600). Aarav contends he is liable only for ₹200 per bag (difference on 20th March). Advise Bharat referring to relevant provisions and case law.",
      modelAnswer: "### 1. Statutory Provisions:\nUnder Section 39 of the Indian Contract Act, 1872 and the rule in *Hochster v. De La Tour*, when a party refuses performance before the due date, it is an Anticipatory Breach. The aggrieved party has two options:\n(a) Treat the breach as immediate, rescind the contract, and claim damages calculated with reference to the market price on the date of repudiation;\n(b) Treat the contract as still subsisting, keep it alive for the benefit of both parties until the due date, and claim damages based on the market price on the date of actual performance.\n\n### 2. Analysis of Present Case Facts:\n- Aarav repudiated the contract on 20th March (Anticipatory Breach).\n- Bharat elected Option (b) by keeping the contract alive till 15th April.\n- As the contract remained alive, performance was due on 15th April, when the market price was ₹2,600 per bag.\n- Contract price was ₹2,000 per bag. The measure of damages is the difference between the contract price and the market price on the agreed date of performance.\n\n### 3. Conclusion & Recommendation:\nAarav's contention is invalid. Bharat is legally entitled to recover damages of ₹600 per bag (₹2,600 - ₹2,000) totaling ₹3,00,000 from Aarav.",
      precedent: "Hochster v. De La Tour (1853) & Frost v. Knight (1872)",
      courseId: "course-ca-foundation",
    },
    {
      id: "w1-wed",
      day: "Midweek Law Madness",
      badge: "Sale of Goods Act 1930",
      subject: "The Sale of Goods Act, 1930",
      title: "Implied Condition as to Quality or Fitness in Single-Purpose Goods",
      marks: "6 Marks (ICAI Standard)",
      scenario: "Priyam approached a local chemist and asked for a 'hot water bottle' for his wife who was experiencing chronic back pain. The chemist handed him an ordinary rubber hot water bottle without inquiring further, and Priyam paid ₹800. On the second day of use, while filled with hot water, the bottle burst suddenly and severely scalded Priyam's wife. Upon inspection, it was discovered that the rubber was defective and incapable of withstanding boiling water. Priyam claims refund and medical damages. The chemist argues that Priyam never explicitly asked for a heavy-duty bottle and caveat emptor applies. Decide.",
      modelAnswer: "### 1. Statutory Provisions:\nUnder Section 16(1) of the Sale of Goods Act, 1930, the general rule is *Caveat Emptor* (Buyer Beware). However, an exception applies where:\n1. The buyer expressly or by implication makes known to the seller the particular purpose for which goods are required;\n2. The buyer relies on the seller's skill or judgment; and\n3. The goods are of a description which it is in the course of the seller's business to supply.\nAs laid down in *Priest v. Last*, if an article is capable of only one obvious normal use (e.g. a hot water bottle is meant to hold hot water), the purpose is disclosed by implication.\n\n### 2. Analysis of Present Case Facts:\n- The hot water bottle had only one single obvious purpose: holding hot water.\n- Priyam relied on the chemist's skill in supplying a bottle safe for hot water.\n- The bottle burst due to defective rubber, breaching the implied condition of fitness.\n\n### 3. Conclusion & Recommendation:\nThe chemist's defense of Caveat Emptor fails. Priyam is entitled to repudiate the contract, obtain a full refund of ₹800, and claim special damages for the medical expenses incurred.",
      precedent: "Priest v. Last (1903) & Grant v. Australian Knitting Mills (1936)",
      courseId: "course-ca-foundation",
    },
    {
      id: "w1-fri",
      day: "Final Boss Friday",
      badge: "Companies Act 2013",
      subject: "The Companies Act, 2013",
      title: "Lifting Corporate Veil for Protection of Public Revenue",
      marks: "6 Marks (ICAI Standard)",
      scenario: "Sir Dinshaw, a wealthy industrialist enjoying a huge dividend and interest income of ₹10 Crores annually, formed four separate private limited companies in which he held 99.9% shares, with his clerk holding the nominal remaining share. He transferred his investments to these four companies. The companies earned dividends and interest, paid minimal tax, and immediately 'lent' the exact amounts back to Sir Dinshaw as pretending pretend loans which were never intended to be repaid. The Income Tax Department seeks to assess the income directly in Sir Dinshaw's hands, disregarding the separate legal personality of the four companies. Will the tax department succeed?",
      modelAnswer: "### 1. Statutory Provisions:\nWhile *Salomon v. Salomon & Co. Ltd.* establishes that a company is an independent legal person distinct from its members, courts have carved out judicial exceptions to pierce or lift the corporate veil.\nOne established exception is **Protection of Revenue / Prevention of Tax Evasion** (*In re Sir Dinshaw Maneckjee Petit* and *CIT v. Sri Meenakshi Mills Ltd.*). Where a company is created solely as a sham device to evade tax obligations, the corporate personality will be disregarded.\n\n### 2. Analysis of Present Case Facts:\n- The four private companies did no genuine commercial business of any kind.\n- They existed solely on paper to receive investments and funnel income back to Sir Dinshaw disguised as non-taxable loans.\n- The corporate creation was a deliberate tax evasion stratagem.\n\n### 3. Conclusion & Recommendation:\nThe Income Tax Department will completely succeed. The court will lift the corporate veil and treat the income of all four dummy companies as the personal income of Sir Dinshaw.",
      precedent: "In re Sir Dinshaw Maneckjee Petit (AIR 1927 Bom 371) & CIT v. Sri Meenakshi Mills Ltd.",
      courseId: "course-ca-foundation",
    },
  ],

  // --- WEEK 2 ---
  [
    {
      id: "w2-mon",
      day: "Monster Monday",
      badge: "Contract Act 1872",
      subject: "The Indian Contract Act, 1872",
      title: "Minor's Fraudulent Age Representation & Equitable Restitution",
      marks: "6 Marks (ICAI Standard)",
      scenario: "Kunal, aged 17 years and 4 months, approached Sahil, a private money lender, representing himself to be 21 years old and producing an altered Aadhaar card. Relying on this representation, Sahil lent Kunal ₹1,00,000 for purchasing an electric scooter. Kunal purchased the scooter, registered it in his name, and refuses to repay the loan. Sahil files a suit for recovery of money or return of the scooter. Kunal pleads minority. Can Sahil succeed in recovering the loan or the scooter?",
      modelAnswer: "### 1. Statutory Provisions:\n- Under Section 11 of the Indian Contract Act, 1872 (*Mohori Bibee v. Dharmodas Ghose*), an agreement with a minor is void *ab initio*.\n- The rule of estoppel does not apply against a minor (*Leslie v. Sheill*). A minor cannot be forced to repay a contractual debt.\n- However, under Section 33 of the Specific Relief Act, 1963 and the Doctrine of Restitution, where a minor enters into a contract by misrepresenting age, the court may compel the minor to restore any traceable benefit or property in his possession to the lender.\n\n### 2. Analysis of Present Case Facts:\n- Sahil cannot enforce the loan contract or compel repayment of ₹1,00,000 because the agreement is void.\n- However, the electric scooter purchased with the loan is specific, identifiable, and traceable in Kunal's possession.\n\n### 3. Conclusion & Recommendation:\nSahil cannot recover the money as a debt, but the court under Section 33 of Specific Relief Act will direct Kunal to restore the electric scooter to Sahil.",
      precedent: "Mohori Bibee v. Dharmodas Ghose (1903) & Leslie v. Sheill (1914)",
      courseId: "course-ca-foundation",
    },
    {
      id: "w2-wed",
      day: "Midweek Law Madness",
      badge: "Partnership Act 1932",
      subject: "The Indian Partnership Act, 1932",
      title: "Liability of Partner by Holding Out vs Sleeping Partner",
      marks: "6 Marks (ICAI Standard)",
      scenario: "Rohan, Soham, and Tushar carried on business as partners under the firm name 'Apex Traders'. Tushar was a dormant partner whose involvement was never known to any outside customer. On 1st January, Tushar retired from the firm without giving any public notice. On 10th February, Apex Traders borrowed ₹5,00,000 from Zenith Bank. On 1st March, Varun (a close friend of Rohan who was never a partner) attended a trade banquet and introduced himself to Zenith Bank's loan manager as 'Managing Partner of Apex Traders' in the presence of Rohan, who remained silent. Apex Traders defaults on the loan. Zenith Bank sues Rohan, Soham, Tushar, and Varun. Discuss the liability of Tushar and Varun.",
      modelAnswer: "### 1. Statutory Provisions:\n- **Dormant Partner Retirement (Sec 32(3) Proviso):** A retired partner continues to be liable to third parties unless public notice is given. Proviso to Sec 32(3) provides that a dormant/sleeping partner whose association with the firm was unknown to third parties is NOT liable for acts done after retirement, even if no public notice is given.\n- **Holding Out (Sec 28):** A person who represents himself or knowingly permits himself to be represented as a partner is liable as a partner by estoppel to anyone giving credit on the faith of such representation.\n\n### 2. Analysis of Present Case Facts:\n- Tushar was a dormant partner whose membership was never known. Hence, under Sec 32(3) proviso, absence of public notice does NOT make him liable for debts incurred after retirement (10th February).\n- Varun represented himself as Managing Partner to Zenith Bank in Rohan's presence. Bank granted/continued credit believing him. Varun is liable under Sec 28 by Holding Out.\n\n### 3. Conclusion & Recommendation:\nTushar is NOT liable for the ₹5,00,000 loan. Varun is fully liable as a partner by holding out alongside Rohan and Soham.",
      precedent: "Scarf v. Jardine (1882) & Tower Cabinet Co v. Ingram (1949)",
      courseId: "course-ca-foundation",
    },
    {
      id: "w2-fri",
      day: "Final Boss Friday",
      badge: "Negotiable Instruments 1881",
      subject: "The Negotiable Instruments Act, 1881",
      title: "Cheque Dishonour: Essential Elements for Section 138 Offence",
      marks: "6 Marks (ICAI Standard)",
      scenario: "Dev issued a cheque for ₹2,50,000 on 10th January in discharge of a legally enforceable debt to Chetan. Chetan presented the cheque on 20th January, and it was dishonoured by the bank due to 'Funds Insufficient'. Chetan received the bank memo on 22nd January. On 15th February (24 days after memo), Chetan sent a statutory registered demand notice demanding payment within 15 days. Dev received the notice on 18th February but failed to pay. On 20th March, Chetan filed a complaint under Section 138 before the Metropolitan Magistrate. Dev contends the complaint is barred by limitation and notice was invalid. Will Dev succeed?",
      modelAnswer: "### 1. Statutory Provisions:\nUnder Section 138 & 142 of the Negotiable Instruments Act, 1881, the prerequisites are:\n1. Cheque presented within validity period (3 months);\n2. Payee makes demand by giving notice in writing within 30 days of receiving bank memo;\n3. Drawer fails to make payment within 15 days of receipt of notice;\n4. Cause of action arises on the 16th day after notice receipt;\n5. Complaint must be filed within 1 month from the date cause of action arises.\n\n### 2. Analysis of Present Case Facts:\n- Bank memo received: 22nd January.\n- Notice sent: 15th February (24 days later, well within statutory 30-day window).\n- Notice received by Dev: 18th February. 15-day payment window expired on 5th March.\n- Cause of action arose on 6th March. Complaint filed on 20th March (within 1 month of cause of action).\n\n### 3. Conclusion & Recommendation:\nDev's contention is baseless. All statutory timelines under Section 138 and Section 142 are strictly complied with. Dev is liable to be convicted under Section 138.",
      precedent: "Dalmia Cement (Bharat) Ltd. v. Galaxy Traders & Agencies (2001)",
      courseId: "course-ca-foundation",
    },
  ],

  // --- WEEK 3 ---
  [
    {
      id: "w3-mon",
      day: "Monster Monday",
      badge: "Contract Act 1872",
      subject: "The Indian Contract Act, 1872",
      title: "Privity of Contract vs Beneficiary Under Family Settlement",
      marks: "6 Marks (ICAI Standard)",
      scenario: "Two brothers, Arjun and Bhim, while partitioning their joint ancestral properties, entered into a registered agreement agreeing to pay ₹15,000 every month to their widowed mother, Kunti, for her maintenance. The agreement stipulated that both brothers would contribute equally. After paying for six months, both brothers stopped payments. Kunti, who was not a direct signatory to the partition deed, filed a suit against Arjun and Bhim for arrears of maintenance. Arjun contends that Kunti cannot sue because she is a stranger to the contract. Decide.",
      modelAnswer: "### 1. Statutory Provisions:\nThe general rule under Common Law is the **Doctrine of Privity of Contract** (*Dunlop Pneumatic Tyre Co. v. Selfridge*), meaning only parties to a contract can enforce it.\nHowever, Indian Law recognizes established exceptions where a stranger to contract CAN sue:\n1. **Beneficiary under a Trust or Family Settlement / Partition Arrangement** (*Khwaja Muhammad Khan v. Husaini Begam* and *Shuppu Ammal v. Subramaniam*);\n2. Marriage settlement or expense agreements for female members.\n\n### 2. Analysis of Present Case Facts:\n- The partition deed specifically created a charge and beneficial provision for mother Kunti's monthly maintenance.\n- Kunti is a named beneficiary under a family partition settlement.\n- As a beneficiary of a family settlement, Kunti falls squarely within the recognized exception to the Privity of Contract doctrine.\n\n### 3. Conclusion & Recommendation:\nArjun's defense of privity of contract is untenable. Kunti is entitled to recover all maintenance arrears and future payments from both Arjun and Bhim.",
      precedent: "Khwaja Muhammad Khan v. Husaini Begam (1910) & Shuppu Ammal v. Subramaniam (1910)",
      courseId: "course-ca-foundation",
    },
    {
      id: "w3-wed",
      day: "Midweek Law Madness",
      badge: "Sale of Goods Act 1930",
      subject: "The Sale of Goods Act, 1930",
      title: "Passing of Property in Unascertained Goods & Risk",
      marks: "6 Marks (ICAI Standard)",
      scenario: "Sameer agreed to purchase 100 bags of wheat from Govind out of a larger stock of 1,000 bags lying in Govind's warehouse. Sameer sent his empty gunny bags to Govind. Govind filled 100 bags with wheat from the bulk, stitched them, marked them with Sameer's initials, and notified Sameer that the goods were ready for collection. Before Sameer could collect them, an accidental fire broke out without negligence on Govind's part, destroying the entire warehouse. Sameer demands return of his advance payment arguing property had not passed. Who bears the loss?",
      modelAnswer: "### 1. Statutory Provisions:\nUnder Section 18 of the Sale of Goods Act, 1930, no property passes in unascertained goods until they are ascertained.\nUnder Section 23(1), where there is a contract for sale of unascertained goods by description, property passes to the buyer when goods of that description and in deliverable state are **unconditionally appropriated** to the contract by seller with buyer's consent or vice-versa.\nUnder Section 26, risk follows property.\n\n### 2. Analysis of Present Case Facts:\n- Sameer provided empty gunny bags (implied consent for appropriation).\n- Govind filled the 100 bags, marked them with Sameer's initials, and gave notice to Sameer.\n- This acts as valid, unconditional appropriation under Section 23(1).\n- Property in the 100 bags of wheat had passed to Sameer before the fire occurred.\n\n### 3. Conclusion & Recommendation:\nAs property had passed, risk was with the buyer Sameer under Section 26. Sameer must bear the loss and is not entitled to refund of advance.",
      precedent: "Pignataro v. Gilroy (1919) & Aldridge v. Johnson (1857)",
      courseId: "course-ca-foundation",
    },
    {
      id: "w3-fri",
      day: "Final Boss Friday",
      badge: "Companies Act 2013",
      subject: "The Companies Act, 2013",
      title: "Doctrine of Ultra Vires & Ratification by Shareholders",
      marks: "6 Marks (ICAI Standard)",
      scenario: "The Object Clause of the Memorandum of Association of 'Speedy Railcar Ltd.' authorized the company 'to make, sell, and lend on hire railway carriages, wagons, and all kinds of railway plant and rolling stock'. The Board of Directors entered into a contract with Richter to finance the construction of a railway line in Spain. At a General Meeting, 100% of the shareholders passed a unanimous special resolution ratifying the financing contract. The company later repudiated the contract, and Richter sued for breach. Richter argues that unanimous shareholder ratification cured any defect. Decide.",
      modelAnswer: "### 1. Statutory Provisions:\n- Under the **Doctrine of Ultra Vires** (*Ashbury Railway Carriage and Iron Co. v. Riche*), any act outside the scope of the Object Clause of the Memorandum is *ultra vires* the company and void *ab initio*.\n- An act which is *ultra vires* the company cannot be ratified even by a unanimous resolution of all shareholders.\n- Financing construction of a railway line is distinct from manufacturing and selling rolling stock.\n\n### 2. Analysis of Present Case Facts:\n- Financing the construction of a railway was completely outside the Memorandum's Object Clause.\n- The contract was *ultra vires* the company itself, not merely *ultra vires* the directors.\n- Even 100% unanimous shareholder approval cannot breathe life into a contract that is void *ab initio*.\n\n### 3. Conclusion & Recommendation:\nThe contract is wholly void. Richter's suit fails; the company cannot be held liable, and unanimous ratification is of zero legal effect.",
      precedent: "Ashbury Railway Carriage & Iron Co. v. Riche (1875) LR 7 HL 653",
      courseId: "course-ca-foundation",
    },
  ],

  // --- WEEK 4 ---
  [
    {
      id: "w4-mon",
      day: "Monster Monday",
      badge: "Contract Act 1872",
      subject: "The Indian Contract Act, 1872",
      title: "Commercial Hardship vs Doctrine of Frustration (Section 56)",
      marks: "6 Marks (ICAI Standard)",
      scenario: "M/s Ocean Shipping agreed to transport 1,000 tons of machinery from Mumbai to London for ₹40 Lakhs via the Suez Canal in November. Before the voyage commenced, the Suez Canal was blocked due to war, forcing ships to take the longer route around the Cape of Good Hope. This increased the shipping distance by 5,000 miles and the voyage cost by ₹25 Lakhs. M/s Ocean Shipping repudiated the contract, claiming the contract had become frustrated under Section 56 due to impossibility. The charterers sue for breach. Decide.",
      modelAnswer: "### 1. Statutory Provisions:\nUnder Section 56 of the Indian Contract Act, 1872, a contract becomes void when the act becomes impossible or unlawful by reason of an event which the promisor could not prevent (*Satyabrata Ghose v. Mugneeram Bangur*).\nHowever, as established in *Tsakiroglou & Co. Ltd. v. Noblee Thorl GmbH*, **mere commercial hardship, abnormal rise in freight rates, or change of route does NOT constitute frustration** if performance remains physically and commercially possible via an alternative route.\n\n### 2. Analysis of Present Case Facts:\n- The contract did not specify that shipping was ONLY possible via the Suez Canal.\n- The Cape of Good Hope route remained open and navigable.\n- The contract merely became more burdensome and expensive, not legally or physically impossible.\n\n### 3. Conclusion & Recommendation:\nM/s Ocean Shipping's repudiation is wrongful. The contract was NOT frustrated. M/s Ocean Shipping is liable to pay damages for breach of contract.",
      precedent: "Tsakiroglou & Co. Ltd. v. Noblee Thorl GmbH (1962) & Satyabrata Ghose v. Mugneeram Bangur (1954)",
      courseId: "course-ca-foundation",
    },
    {
      id: "w4-wed",
      day: "Midweek Law Madness",
      badge: "Partnership Act 1932",
      subject: "The Indian Partnership Act, 1932",
      title: "Implied Authority of Partner & Statutory Restrictions (Section 19)",
      marks: "6 Marks (ICAI Standard)",
      scenario: "A, B, and C are partners in a firm carrying on business as wholesale garment merchants. The partnership deed contains an internal clause providing that no partner shall purchase goods on credit exceeding ₹1,00,000 without the written consent of all other partners. Partner A purchased textile cloth worth ₹4,00,000 on credit from XYZ Mills in the firm's name. XYZ Mills was completely unaware of the internal restriction in the partnership deed. A also submitted a dispute regarding another debt of the firm to an arbitrator without consulting B and C. Can the firm be held liable for the ₹4,00,000 purchase? Can the firm repudiate the arbitration reference?",
      modelAnswer: "### 1. Statutory Provisions:\n- **Implied Authority for Trading Firm (Sec 19(1) & 20):** In a trading firm, buying and selling goods of the trade on credit falls within the ordinary implied authority of a partner. Any secret internal restriction does not bind third parties acting in good faith without notice (Sec 20).\n- **Statutory Restrictions on Implied Authority (Sec 19(2)):** Section 19(2)(a) explicitly states that in the absence of any usage or custom of trade to the contrary, the implied authority of a partner does NOT empower him to submit a dispute relating to the business of the firm to arbitration.\n\n### 2. Analysis of Present Case Facts:\n- Purchasing garment cloth is the normal business of the firm. XYZ Mills had no notice of the ₹1,00,000 limit. Hence, the firm is bound for ₹4,00,000.\n- Submitting a dispute to arbitration is statutorily excluded from implied authority under Sec 19(2)(a).\n\n### 3. Conclusion & Recommendation:\n1. The firm IS liable to pay ₹4,00,000 to XYZ Mills.\n2. The arbitration reference is NOT binding on the firm unless B and C ratify it.",
      precedent: "Section 19(1), Section 19(2)(a), and Section 20 of Indian Partnership Act, 1932",
      courseId: "course-ca-foundation",
    },
    {
      id: "w4-fri",
      day: "Final Boss Friday",
      badge: "Companies Act 2013",
      subject: "The Companies Act, 2013",
      title: "Pre-Incorporation Contracts and Personal Liability of Promoters",
      marks: "6 Marks (ICAI Standard)",
      scenario: "Prior to the incorporation of 'Green Energy Solar Ltd.', its promoters Rahul and Rohit entered into an agreement on 1st May with Landcorp Ltd. to purchase 10 acres of land 'on behalf of the proposed company Green Energy Solar Ltd.' for ₹1 Crore. The company was duly incorporated on 1st June. On 10th June, the Board of Directors passed a resolution 'ratifying' the contract made by Rahul and Rohit. Later, land prices crashed, and the company refused to purchase the land. Landcorp Ltd. sues Rahul and Rohit personally. Are the promoters personally liable?",
      modelAnswer: "### 1. Statutory Provisions:\n- Under Common Law (*Kelner v. Baxter*), a company cannot enter into a contract before its incorporation because an unborn entity has no contractual capacity.\n- A company cannot ratify a pre-incorporation contract after incorporation because ratification relates back to a time when the company did not exist (*Natal Land & Colonization Co. v. Pauline Syndicate*).\n- Unless the contract satisfies Section 15(h) and Section 19(e) of the Specific Relief Act, 1963 (warranted by incorporation terms and adopted by company with communication to vendor), the promoters remain **personally liable**.\n\n### 2. Analysis of Present Case Facts:\n- The contract was signed before the company existed.\n- Mere board resolution without formal novation or statutory tripartite adoption under Specific Relief Act does not absolve promoters.\n- Promoters contracted as agents of a non-existent principal.\n\n### 3. Conclusion & Recommendation:\nThe promoters Rahul and Rohit are **personally liable** to pay the price and perform the contract with Landcorp Ltd.",
      precedent: "Kelner v. Baxter (1866) & Newborne v. Sensolid (Great Britain) Ltd.",
      courseId: "course-ca-foundation",
    },
  ],
];

// ============================================================================
// 3. CORE AUTOMATION ROUTINES (DETERMINISTIC CALENDAR ALGORITHMS)
// ============================================================================

/**
 * Returns zero-based Day of the Year (0 to 365)
 */
function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Returns current week number of the year (0 to 52)
 */
function getWeekOfYear(date = new Date()) {
  const day = getDayOfYear(date);
  return Math.floor(day / 7);
}

/**
 * Resolves today's automated Daily MCQ (QOTD).
 * Checks if admin has set a manual override in SiteSetting; if not, serves from the 30-day pool.
 */
async function getAutomatedDailyQotd() {
  try {
    // 1. Check for active manual override in SiteSettings (if connected to Atlas)
    if (isConnected()) {
      const overrideDoc = await SiteSetting.findOne({ key: "qotd_override" }).lean();
      if (overrideDoc && overrideDoc.value && overrideDoc.value.enabled === true && overrideDoc.value.qotd) {
        return {
          ...overrideDoc.value.qotd,
          isAutomated: false,
          source: "admin_override",
        };
      }
    }

    // 2. Automated Deterministic Rotation based on Calendar Day
    const dayOfYear = getDayOfYear();
    const index = dayOfYear % DAILY_MCQ_BANK.length;
    const selected = DAILY_MCQ_BANK[index];

    return {
      ...selected,
      isAutomated: true,
      dayIndex: index,
      totalBankSize: DAILY_MCQ_BANK.length,
      rotationSchedule: "Daily at 00:00 IST",
    };
  } catch (err) {
    // Fallback if DB query fails
    const dayOfYear = getDayOfYear();
    return {
      ...DAILY_MCQ_BANK[dayOfYear % DAILY_MCQ_BANK.length],
      isAutomated: true,
    };
  }
}

/**
 * Resolves this week's 3 automated Case Studies (Monster Monday, Midweek, Final Boss).
 * Checks if admin has set manual override; if not, serves from the multi-week vault.
 */
async function getAutomatedWeeklyCases() {
  try {
    // 1. Check for manual override in SiteSettings (if connected to Atlas)
    if (isConnected()) {
      const overrideDoc = await SiteSetting.findOne({ key: "weekly_cases_override" }).lean();
      if (overrideDoc && overrideDoc.value && overrideDoc.value.enabled === true && Array.isArray(overrideDoc.value.cases)) {
        return {
          cases: overrideDoc.value.cases,
          isAutomated: false,
          source: "admin_override",
        };
      }
    }

    // 2. Automated Deterministic Weekly Rotation based on Calendar Week
    const weekOfYear = getWeekOfYear();
    const weekIndex = weekOfYear % WEEKLY_CASE_VAULT.length;
    const currentWeekCases = WEEKLY_CASE_VAULT[weekIndex];

    return {
      cases: currentWeekCases,
      isAutomated: true,
      weekNumber: weekIndex + 1,
      totalWeeks: WEEKLY_CASE_VAULT.length,
      rotationSchedule: "Weekly on Monday 00:00 IST",
    };
  } catch (err) {
    const weekOfYear = getWeekOfYear();
    return {
      cases: WEEKLY_CASE_VAULT[weekOfYear % WEEKLY_CASE_VAULT.length],
      isAutomated: true,
    };
  }
}

/**
 * Returns telemetry status for the Admin Panel
 */
async function getAutomationTelemetry() {
  const dayOfYear = getDayOfYear();
  const weekOfYear = getWeekOfYear();
  const dailyIndex = dayOfYear % DAILY_MCQ_BANK.length;
  const weekIndex = weekOfYear % WEEKLY_CASE_VAULT.length;

  let qotdOverride = false;
  let casesOverride = false;

  if (isConnected()) {
    try {
      const qDoc = await SiteSetting.findOne({ key: "qotd_override" }).lean();
      if (qDoc?.value?.enabled) qotdOverride = true;
      const cDoc = await SiteSetting.findOne({ key: "weekly_cases_override" }).lean();
      if (cDoc?.value?.enabled) casesOverride = true;
    } catch (_) {}
  }

  return {
    autoRotateDailyMcq: !qotdOverride,
    autoRotateWeeklyCases: !casesOverride,
    currentDayOfYear: dayOfYear,
    currentWeekOfYear: weekOfYear,
    activeDailyMcqIndex: dailyIndex + 1,
    totalDailyMcqs: DAILY_MCQ_BANK.length,
    activeWeeklyCaseSet: weekIndex + 1,
    totalWeeklySets: WEEKLY_CASE_VAULT.length,
    nextDailyRotation: "Midnight 00:00 IST",
    nextWeeklyRotation: "Next Monday 00:00 IST",
  };
}

module.exports = {
  DAILY_MCQ_BANK,
  WEEKLY_CASE_VAULT,
  getDayOfYear,
  getWeekOfYear,
  getAutomatedDailyQotd,
  getAutomatedWeeklyCases,
  getAutomationTelemetry,
};
