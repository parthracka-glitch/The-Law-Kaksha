export interface PromoPassCard {
  id: string;
  streamBadge: string;
  discountBadge: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  saveText: string;
  description: string;
  features: string[];
  buttonText: string;
  actionType: "ca" | "cs" | "all-access" | "custom";
  customUrl?: string;
  theme: "lavender" | "purple";
  enabled: boolean;
}

export interface PromoBannersSetting {
  sectionTitle: string;
  enabled: boolean;
  caCard: PromoPassCard;
  csCard: PromoPassCard;
  comboCard: PromoPassCard;
}

export const DEFAULT_PROMO_BANNERS: PromoBannersSetting = {
  sectionTitle: "LAW KAKSHA CODEX PASSES",
  enabled: true,
  caCard: {
    id: "card_ca",
    streamBadge: "Paper 2 • 7 Chapters",
    discountBadge: "67% OFF",
    title: "CA Foundation Business Laws",
    subtitle: "Complete Codex Notes",
    price: 99,
    originalPrice: 299,
    saveText: "Save ₹200",
    description: "All 7 Chapters in simple English, 3 weekly solved cases & 1.5-day LDR flowcharts",
    features: ["📖 7 Chapters", "⚖️ Solved Cases", "⚡ LDR Notes"],
    buttonText: "Explore CA Notes",
    actionType: "ca",
    customUrl: "",
    theme: "lavender",
    enabled: true,
  },
  csCard: {
    id: "card_cs",
    streamBadge: "ICSI • 8 Exam Units",
    discountBadge: "67% OFF",
    title: "CSEET Business Law & Management",
    subtitle: "Master Question Bank",
    price: 99,
    originalPrice: 299,
    saveText: "Save ₹200",
    description: "All 8 ICSI Units, 30-MCQ weekly timed mock tests & quick revision concept notes",
    features: ["🎯 8 Units", "⏱️ Timed MCQs", "💡 Concept Bank"],
    buttonText: "Explore CSEET Notes",
    actionType: "cs",
    customUrl: "",
    theme: "lavender",
    enabled: true,
  },
  comboCard: {
    id: "card_combo",
    streamBadge: "Best Value • All-Access Dual Pass",
    discountBadge: "64% OFF",
    title: "All-Access Dual Codex Pass",
    subtitle: "CA Foundation + CSEET Combo",
    price: 180,
    originalPrice: 499,
    saveText: "Save ₹319",
    description: "Get unlimited access to both CA Foundation & CSEET notes, all weekly solved cases & practice mock drills",
    features: ["🎓 Both Courses", "🏆 Full Question Bank", "⏱️ Timed Mock Tests"],
    buttonText: "Unlock All-Access",
    actionType: "all-access",
    customUrl: "",
    theme: "purple",
    enabled: true,
  },
};
