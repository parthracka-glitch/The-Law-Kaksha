"use client";

import React, { useState } from "react";
import { Bookmark, Eye, Trash2, BookOpen, FileText, Workflow, Search, ArrowRight } from "lucide-react";

export interface StudentBookmarkItem {
  id: string;
  title: string;
  courseId?: string;
  unitId?: string;
  type?: string;
  url?: string;
  createdAt?: string;
}

interface StudentBookmarksTabProps {
  bookmarks: StudentBookmarkItem[];
  onOpenReader: (url: string, title: string) => void;
  onRemoveBookmark: (id: string) => void;
  onExploreCourses?: () => void;
}

export function StudentBookmarksTab({
  bookmarks = [],
  onOpenReader,
  onRemoveBookmark,
  onExploreCourses,
}: StudentBookmarksTabProps) {
  const [search, setSearch] = useState("");

  const filteredBookmarks = bookmarks.filter((b) =>
    b.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-[#E7ECF7] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] mb-2">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Personal Knowledge Vault</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight">
              My Bookmarks & Key References
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Quickly resume high-yield statutory sections, LDR charts, and case precedents.
            </p>
          </div>

          {bookmarks.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DBEAFE] bg-[#F8FAFC] text-xs font-semibold text-[#0A192F] focus:outline-hidden focus:ring-2 focus:ring-[#005A9C]"
              />
            </div>
          )}
        </div>
      </div>

      {/* BOOKMARKS LIST */}
      {bookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E7ECF7] p-12 text-center max-w-lg mx-auto shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0A192F]">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
            Click the bookmark icon on any study note, revision flowchart, or statutory unit to save it
            here for instant recall before exams.
          </p>
          {onExploreCourses && (
            <button
              type="button"
              onClick={onExploreCourses}
              className="mt-5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#005A9C] hover:bg-[#004080] text-white transition-all cursor-pointer shadow-2xs inline-flex items-center gap-2"
            >
              <span>Explore My Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E7ECF7] p-8 text-center text-xs text-[#64748B]">
          No bookmarks match your search query &ldquo;{search}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookmarks.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E7ECF7] hover:border-[#005A9C]/40 p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#EFF6FF] text-[#005A9C] shrink-0">
                  {item.type === "ldr" ? (
                    <Workflow className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>

                <div className="min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#005A9C] border border-[#DBEAFE] mb-1">
                    {item.type === "ldr" ? "Revision Chart" : "Study Note"}
                  </span>
                  <h4 className="text-sm font-bold text-[#0A192F] line-clamp-2">
                    {item.title}
                  </h4>
                  {item.createdAt && (
                    <p className="text-[11px] text-[#64748B] mt-1">
                      Saved on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F0F4F8]">
                <button
                  type="button"
                  onClick={() => onRemoveBookmark(item.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onOpenReader(item.url || `/api/content/${item.id}/file`, item.title)
                  }
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#005A9C] hover:bg-[#004080] text-white transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
