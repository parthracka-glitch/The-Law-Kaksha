import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F0F7FF]/25 flex flex-col justify-between text-[#0A192F] font-sans">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
        <article className="bg-white border border-[#DBEAFE] rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm space-y-6">
          <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A192F] tracking-tight">
            About Us
          </h1>

          <p className="text-lg sm:text-xl font-serif font-bold text-[#005A9C]">
            The Law कक्षा Learn. Practise. Excel.
          </p>

          <div className="space-y-4 text-sm sm:text-base text-[#334155] leading-relaxed">
            <p>
              The Law कक्षा was created with a simple belief: understanding a concept is only the beginning of learning. True preparation begins when you learn to apply that understanding to questions, situations and problems.
            </p>
            <p>
              For CA Foundation students, studying Business Laws involves more than remembering provisions and definitions. It requires developing the ability to read a question carefully, identify the relevant legal principle, apply it to the given facts and arrive at a reasoned conclusion.
            </p>
            <p>
              Yet, one of the challenges students often face is finding sufficient structured practice beyond their regular study material. While the ICAI Study Material, RTPs, MTPs and previous year papers remain essential to examination preparation, additional practice can help students strengthen their conceptual understanding and build confidence in applying the law.
            </p>
            <p>
              We aim to create learning resources that bridge the gap between studying concepts and practising their application. Our question banks are designed to encourage active learning, structured revision and thoughtful problem-solving, helping students approach their preparation with greater clarity and purpose.
            </p>
            <p>
              Through chapter-wise questions, application-based case studies, exam-oriented practice and detailed solutions, we seek to make the learning process more organised and meaningful.
            </p>
            <p>
              We believe that students do not simply need more content. They need the right opportunities to practise, reflect, identify gaps in their understanding and improve.
            </p>
            <p>
              Because learning the law is not just about knowing what a provision says. It is about understanding when, why and how it applies.
            </p>
          </div>

          <p className="text-base sm:text-lg font-serif font-bold text-[#005A9C]">
            Learn with clarity. Practise with purpose.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
