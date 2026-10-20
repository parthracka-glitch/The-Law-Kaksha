"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is The Law कक्षा?",
      a: "The Law कक्षा is an online learning and revision platform that brings study notes, practice questions, previous-year paper analysis, flowcharts, revision resources, and application-based case studies together in one place. The idea is simple: spend less time searching for study material and more time learning, practising, and revising — all under one dashboard.",
    },
    {
      q: "How much does a subscription cost?",
      a: "A subscription costs just ₹99 per month, making structured, exam-focused law preparation accessible and affordable. Your subscription provides access to the resources available under your selected course and plan.",
    },
    {
      q: "What resources are available for CA Foundation students?",
      a: "Our CA Foundation Business Laws resources include detailed notes, practice questions, previous-year paper analysis, Last Day Revision (LDR) topics, flowcharts, revision material, and three new application-based case studies every week.",
    },
    {
      q: "Are the study materials and Question Banks downloadable?",
      a: "No. Subscription resources and digital Question Banks are available for online viewing only and cannot be downloaded as soft-copy files.",
    },
    {
      q: "Can I purchase a printed Question Bank?",
      a: "Yes. If you prefer a printed copy of our Question Bank, contact us at thelawkaksha@gmail.com or send us a DM on Instagram for availability, pricing, and delivery details.",
    },
    {
      q: "Which courses are available on The Law कक्षा?",
      a: "We are launching initially with CA Foundation Business Laws. CSEET Business Laws and Management resources are planned to launch in November 2026. Follow us on Instagram or visit our website for updates.",
    },
    {
      q: "How can I access my resources or get help?",
      a: "Sign up on our website, select the available course or product, and follow the instructions to complete your subscription or purchase. If you face any difficulty or need assistance, contact us through the support email listed on our website.",
    },
    {
      q: "How does the subscription work?",
      a: "Students can sign up on the website, select the relevant course, and purchase the applicable subscription plan to access its resources through their dashboard.",
    },
    {
      q: "What is the weekly case-study series for CA Foundation?",
      a: "Every week, students can look forward to three new application-based case studies: Monday — Monster Monday Case, Wednesday — Midweek Law Madness, and Friday — Final Boss Friday. Each case is designed to help students read the facts, identify the relevant legal provisions, analyse the situation, and apply the law.",
    },
    {
      q: "Will the resources be updated regularly?",
      a: "The platform is designed to provide additional learning and practice resources over time, including new weekly case studies. Updates and new content will be made available according to the relevant course and subscription offerings.",
    },
    {
      q: "How do I get started on The Law कक्षा?",
      a: "Sign up on the website, enter the requested details, select the available course or product, and follow the instructions to complete registration or purchase.",
    },
    {
      q: "What should I do if my payment is successful but I cannot access my resources?",
      a: "Please contact our support team at thelawkaksha@gmail.com. Include your registered email address, order or transaction details, and a brief description of the issue so that we can assist you.",
    },
    {
      q: "What if I forget my login details or experience a technical issue?",
      a: "Use the available account recovery option on the website. If the issue persists, contact our support team at thelawkaksha@gmail.com.",
    },
    {
      q: "Where can I find the current subscription price and validity?",
      a: "The subscription price and validity are displayed on the relevant course or subscription page. Please check the website for current pricing and any introductory offers.",
    },
    {
      q: "Is the subscription self-paced?",
      a: "Yes. Students can use the available resources at their own pace during their subscription period and follow the structured learning and revision journey provided on the platform.",
    },
    {
      q: "What happens when my subscription expires?",
      a: "For uninterrupted access, your subscription must be renewed after each monthly billing period. Where auto-renewal is enabled, the subscription renews automatically according to the applicable payment and renewal terms.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faqs" className="py-12 sm:py-16 bg-white text-[#0A192F]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#005A9C] block mb-2">
            Answers &amp; Clarity
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#0A192F] tracking-tight font-serif">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-[#005A9C] bg-[#F0F7FF] shadow-xs"
                    : "border-[#DBEAFE] bg-white hover:border-[#005A9C]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-sm text-[#0A192F] cursor-pointer min-h-[52px]"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#005A9C]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#64748B] leading-relaxed border-t border-[#DBEAFE] animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
