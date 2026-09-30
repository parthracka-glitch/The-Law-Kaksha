"use client";

import React, { useState, useEffect } from "react";
import { Award, Trophy, Medal, Flame, TrendingUp, Users, Target, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

interface LeaderboardItem {
  rank: number;
  badge: string;
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  candidate_name: string;
  student_id: string;
  score: number;
  total_marks: number;
  accuracy: number;
  time_taken_seconds: number;
  created_at: string;
}

interface LeaderboardStats {
  total_participants: number;
  average_score: number;
  highest_score: number;
}

export function PublicLeaderboardSection() {
  const [standings, setStandings] = useState<LeaderboardItem[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    total_participants: 0,
    average_score: 0,
    highest_score: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await apiRequest("/api/leaderboard?limit=10");
      if (res.success && res.data) {
        setStandings(res.data.leaderboard || []);
        if (res.data.stats) setStats(res.data.stats);
      }
    } catch (e) {
      console.error("Error loading leaderboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const topThree = standings.slice(0, 3);
  const restRankers = standings.slice(3);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#F0F7FF] to-white relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold tracking-wide uppercase mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>All-India CA Law Hall of Fame</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A192F] tracking-tight">
            Daily Statutory Challenge Leaderboard
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Live rankings of top aspirants testing statutory Bare Act precision, negative-marking prevention, and legal drafting accuracy.
          </p>
        </div>

        {/* Podium Row (Top 3 Rankers) */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Fetching live All-India scores...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-end">
              
              {/* Rank 2 (Silver) */}
              {topThree[1] && (
                <div className="order-2 md:order-1 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200 shadow-lg relative text-center hover:scale-[1.02] transition-transform">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-lg border border-slate-300">
                    🥈
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold mb-2">
                    AIR 02 (Silver)
                  </span>
                  <h3 className="font-bold text-[#0A192F] text-base">{topThree[1].candidate_name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{topThree[1].student_id}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Score</p>
                      <p className="text-sm font-bold text-slate-900">{topThree[1].score} / {topThree[1].total_marks}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Accuracy</p>
                      <p className="text-sm font-bold text-emerald-600">{topThree[1].accuracy}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold) - Elevated Center */}
              {topThree[0] && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl p-7 border-2 border-amber-400 shadow-xl relative text-center -translate-y-2 hover:scale-[1.02] transition-transform">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase shadow-md">
                    National Champion
                  </div>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-400/30">
                    👑
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2 border border-amber-200">
                    AIR 01 (Gold Medal)
                  </span>
                  <h3 className="font-extrabold text-[#0A192F] text-lg">{topThree[0].candidate_name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{topThree[0].student_id}</p>

                  <div className="mt-5 pt-4 border-t border-amber-100 grid grid-cols-2 gap-2 text-left">
                    <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
                      <p className="text-[10px] text-amber-800 uppercase font-semibold">Score</p>
                      <p className="text-base font-black text-amber-950">{topThree[0].score} / {topThree[0].total_marks}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <p className="text-[10px] text-emerald-800 uppercase font-semibold">Accuracy</p>
                      <p className="text-base font-black text-emerald-700">{topThree[0].accuracy}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {topThree[2] && (
                <div className="order-3 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200 shadow-lg relative text-center hover:scale-[1.02] transition-transform">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-700/10 text-amber-800 flex items-center justify-center font-black text-lg border border-amber-700/20">
                    🥉
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold mb-2">
                    AIR 03 (Bronze)
                  </span>
                  <h3 className="font-bold text-[#0A192F] text-base">{topThree[2].candidate_name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{topThree[2].student_id}</p>

                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-left">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Score</p>
                      <p className="text-sm font-bold text-slate-900">{topThree[2].score} / {topThree[2].total_marks}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Accuracy</p>
                      <p className="text-sm font-bold text-emerald-600">{topThree[2].accuracy}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Standings Table for Ranks 4 to 10 */}
            {restRankers.length > 0 && (
              <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    National Rankers (Positions 4 - 10)
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Updated in Real Time
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {restRankers.map((item) => (
                    <div
                      key={item.attempt_id}
                      className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
                          #{item.rank}
                        </span>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#0A192F]">
                            {item.candidate_name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {item.student_id} • {item.quiz_title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 text-right">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-blue-900">
                            {item.score} <span className="text-[10px] text-slate-400">/ {item.total_marks}</span>
                          </p>
                          <p className="text-[10px] text-slate-500">{formatTime(item.time_taken_seconds)}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                          {item.accuracy}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="text-center pt-4">
              <Link
                href="/student"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0A192F] text-white text-xs sm:text-sm font-bold hover:bg-[#1E3A8A] transition-all shadow-md hover:shadow-xl"
              >
                <span>Attempt Today&apos;s Free Live Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
