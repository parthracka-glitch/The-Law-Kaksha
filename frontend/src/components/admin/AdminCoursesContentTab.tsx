"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Layers,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  UploadCloud,
  FileText,
  DollarSign,
  Calendar,
  ChevronRight,
  RefreshCw,
  Save,
  X,
  AlertTriangle,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";

export interface CourseRecord {
  id: string;
  title: string;
  slug?: string;
  availability: "live" | "coming_soon";
  price: number;
  mrp?: number;
  accessDays: number;
  description?: string;
  thumbnail?: string;
  exam_body?: string;
}

export interface ActRecord {
  id: string;
  courseId: string;
  title: string;
  availability: "live" | "coming_soon";
  order: number;
  description?: string;
}

export interface UnitRecord {
  id: string;
  actId: string;
  title: string;
  order: number;
  summary?: string;
}

export interface ContentItemRecord {
  id: string;
  unitId: string;
  title: string;
  type: "notes" | "practice" | "case_study" | "flowchart" | "pyq" | "revision";
  cloudinaryPublicId?: string;
  samplePublicId?: string;
  isSample: boolean;
  sampleFromPage?: number;
  sampleToPage?: number;
  samplePagesRange?: string;
  isPublished: boolean;
  order: number;
  description?: string;
  fileName?: string;
  fileSize?: number;
}

interface Props {
  adminFetch: (url: string, init?: RequestInit) => Promise<Response>;
  showToast: (msg: string) => void;
  onPreviewPdf?: (item: { title: string; pdfUrl: string; isSample?: boolean }) => void;
}

const DEFAULT_ADMIN_COURSES: CourseRecord[] = [
  {
    id: "course-ca-foundation",
    title: "CA Foundation Paper 2: Business Laws",
    availability: "live",
    price: 99,
    mrp: 299,
    accessDays: 30,
    exam_body: "ICAI",
    description: "Comprehensive Business Laws preparation platform for CA Foundation Paper 2.",
  },
  {
    id: "course-cseet",
    title: "CSEET Business Laws & Business Management",
    availability: "coming_soon",
    price: 99,
    mrp: 299,
    accessDays: 30,
    exam_body: "ICSI",
    description: "Comprehensive Business Laws & Management preparation platform for CSEET.",
  },
];

export function AdminCoursesContentTab({ adminFetch, showToast, onPreviewPdf }: Props) {
  // Courses state
  const [courses, setCourses] = useState<CourseRecord[]>(DEFAULT_ADMIN_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("course-ca-foundation");
  const [courseLoading, setCourseLoading] = useState<boolean>(true);
  const [editingCourse, setEditingCourse] = useState<{ [id: string]: { price: number; accessDays: number; saving: boolean } }>({});

  // Acts state
  const [acts, setActs] = useState<ActRecord[]>([]);
  const [selectedActId, setSelectedActId] = useState<string>("");
  const [actsLoading, setActsLoading] = useState<boolean>(false);

  // Units state
  const [units, setUnits] = useState<UnitRecord[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [unitsLoading, setUnitsLoading] = useState<boolean>(false);
  const [unitModalOpen, setUnitModalOpen] = useState<boolean>(false);
  const [newUnitTitle, setNewUnitTitle] = useState<string>("");

  // Content Items state
  const [contentItems, setContentItems] = useState<ContentItemRecord[]>([]);
  const [contentLoading, setContentLoading] = useState<boolean>(false);

  // Content Item Modal
  const [contentModal, setContentModal] = useState<{
    open: boolean;
    mode: "add" | "edit";
    data: Partial<ContentItemRecord>;
  }>({
    open: false,
    mode: "add",
    data: {},
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Courses
  const loadCourses = async () => {
    setCourseLoading(true);
    try {
      const res = await adminFetch("/api/admin/courses");
      const data = await res.json();
      const rawCourses: CourseRecord[] =
        data.success && data.courses && data.courses.length > 0
          ? data.courses
          : DEFAULT_ADMIN_COURSES;

      const sorted = [...rawCourses].sort((a, b) => {
        const ordA =
          a.id === "course-ca-foundation" || a.id === "ca-foundation"
            ? 1
            : a.id === "course-cseet"
            ? 2
            : 99;
        const ordB =
          b.id === "course-ca-foundation" || b.id === "ca-foundation"
            ? 1
            : b.id === "course-cseet"
            ? 2
            : 99;
        return ordA - ordB;
      });

      setCourses(sorted);
      const editMap: { [id: string]: { price: number; accessDays: number; saving: boolean } } = {};
      sorted.forEach((c: CourseRecord) => {
        editMap[c.id] = { price: c.price || 99, accessDays: c.accessDays || 30, saving: false };
      });
      setEditingCourse(editMap);

      setSelectedCourseId((prev) => {
        if (prev && sorted.some((c) => c.id === prev)) return prev;
        return sorted[0]?.id || "course-ca-foundation";
      });
    } catch (err) {
      console.error("Failed to load courses:", err);
      setCourses(DEFAULT_ADMIN_COURSES);
      setSelectedCourseId((prev) => prev || "course-ca-foundation");
    } finally {
      setCourseLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // 2. Fetch Acts whenever selectedCourseId changes
  useEffect(() => {
    if (!selectedCourseId) return;
    const loadActs = async () => {
      setActsLoading(true);
      try {
        const res = await adminFetch(`/api/admin/acts?courseId=${selectedCourseId}`);
        const data = await res.json();
        if (data.success && data.acts && data.acts.length > 0) {
          setActs(data.acts);
          setSelectedActId((prev) =>
            prev && data.acts.some((a: ActRecord) => a.id === prev) ? prev : data.acts[0].id
          );
        } else {
          // Provide default acts for CA Foundation if empty or unseeded
          if (selectedCourseId === "course-ca-foundation" || selectedCourseId === "ca-foundation") {
            const fallbackActs: ActRecord[] = [
              { id: "act-ca-contract", courseId: selectedCourseId, title: "The Indian Contract Act, 1872", availability: "live", order: 1 },
              { id: "act-ca-soga", courseId: selectedCourseId, title: "The Sale of Goods Act, 1930", availability: "live", order: 2 },
              { id: "act-ca-partnership", courseId: selectedCourseId, title: "The Indian Partnership Act, 1932", availability: "live", order: 3 },
              { id: "act-ca-llp", courseId: selectedCourseId, title: "The Limited Liability Partnership Act, 2008", availability: "live", order: 4 },
              { id: "act-ca-companies", courseId: selectedCourseId, title: "The Companies Act, 2013", availability: "coming_soon", order: 5 },
            ];
            setActs(fallbackActs);
            setSelectedActId((prev) =>
              prev && fallbackActs.some((a) => a.id === prev) ? prev : fallbackActs[0].id
            );
          } else {
            setActs([]);
            setSelectedActId("");
          }
        }
      } catch (err) {
        console.error("Failed to load acts:", err);
        if (selectedCourseId === "course-ca-foundation" || selectedCourseId === "ca-foundation") {
          const fallbackActs: ActRecord[] = [
            { id: "act-ca-contract", courseId: selectedCourseId, title: "The Indian Contract Act, 1872", availability: "live", order: 1 },
            { id: "act-ca-soga", courseId: selectedCourseId, title: "The Sale of Goods Act, 1930", availability: "live", order: 2 },
            { id: "act-ca-partnership", courseId: selectedCourseId, title: "The Indian Partnership Act, 1932", availability: "live", order: 3 },
            { id: "act-ca-llp", courseId: selectedCourseId, title: "The Limited Liability Partnership Act, 2008", availability: "live", order: 4 },
            { id: "act-ca-companies", courseId: selectedCourseId, title: "The Companies Act, 2013", availability: "coming_soon", order: 5 },
          ];
          setActs(fallbackActs);
          setSelectedActId(fallbackActs[0].id);
        } else {
          setActs([]);
          setSelectedActId("");
        }
      } finally {
        setActsLoading(false);
      }
    };
    loadActs();
  }, [selectedCourseId]);

  // 3. Fetch Units whenever selectedActId changes
  useEffect(() => {
    if (!selectedActId) {
      setUnits([]);
      setSelectedUnitId("");
      return;
    }
    const loadUnits = async () => {
      setUnitsLoading(true);
      try {
        const res = await adminFetch(`/api/admin/units?actId=${selectedActId}`);
        const data = await res.json();
        if (data.success && data.units && data.units.length > 0) {
          setUnits(data.units);
          setSelectedUnitId((prev) =>
            prev && data.units.some((u: UnitRecord) => u.id === prev) ? prev : data.units[0].id
          );
        } else {
          if (selectedActId === "act-ca-contract") {
            const fallbackUnits: UnitRecord[] = [
              { id: "unit-ca-contract-1", actId: "act-ca-contract", title: "Unit 1: Nature of Contracts & Essentials of Valid Offer", order: 1 },
              { id: "unit-ca-contract-2", actId: "act-ca-contract", title: "Unit 2: Consideration & Capacity to Contract", order: 2 },
            ];
            setUnits(fallbackUnits);
            setSelectedUnitId((prev) =>
              prev && fallbackUnits.some((u) => u.id === prev) ? prev : fallbackUnits[0].id
            );
          } else {
            setUnits([]);
            setSelectedUnitId("");
          }
        }
      } catch (err) {
        console.error("Failed to load units:", err);
        setUnits([]);
        setSelectedUnitId("");
      } finally {
        setUnitsLoading(false);
      }
    };
    loadUnits();
  }, [selectedActId]);

  // 4. Fetch Content Items whenever selectedUnitId changes
  useEffect(() => {
    if (!selectedUnitId) {
      setContentItems([]);
      return;
    }
    const loadContentItems = async () => {
      setContentLoading(true);
      try {
        const res = await adminFetch(`/api/admin/content-items?unitId=${selectedUnitId}`);
        const data = await res.json();
        if (data.success && data.items) {
          setContentItems(data.items);
        }
      } catch (err) {
        console.error("Failed to load content items:", err);
      } finally {
        setContentLoading(false);
      }
    };
    loadContentItems();
  }, [selectedUnitId]);

  // Handle Course Live/Coming Soon Toggle
  const handleToggleCourseAvailability = async (course: CourseRecord) => {
    const nextAvailability = course.availability === "live" ? "coming_soon" : "live";
    try {
      const res = await adminFetch(`/api/admin/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: nextAvailability }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === course.id ? { ...c, availability: nextAvailability } : c))
        );
        showToast(`${course.title} is now ${nextAvailability === "live" ? "Live" : "Coming Soon"}.`);
      } else {
        alert(data.message || "Failed to update course availability.");
      }
    } catch (err: any) {
      alert("Error updating course: " + err.message);
    }
  };

  // Handle Course Price & AccessDays Save
  const handleSaveCoursePricing = async (courseId: string) => {
    const edit = editingCourse[courseId];
    if (!edit) return;
    setEditingCourse((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], saving: true },
    }));

    try {
      const res = await adminFetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: Number(edit.price),
          accessDays: Number(edit.accessDays),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? { ...c, price: Number(edit.price), accessDays: Number(edit.accessDays) }
              : c
          )
        );
        showToast("Course pricing & access days saved successfully.");
      } else {
        alert(data.message || "Failed to update pricing.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setEditingCourse((prev) => ({
        ...prev,
        [courseId]: { ...prev[courseId], saving: false },
      }));
    }
  };

  // Handle Act Live/Coming Soon Toggle
  const handleToggleActAvailability = async (act: ActRecord) => {
    const nextAvailability = act.availability === "live" ? "coming_soon" : "live";
    try {
      const res = await adminFetch(`/api/admin/acts/${act.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: nextAvailability }),
      });
      const data = await res.json();
      if (data.success) {
        setActs((prev) =>
          prev.map((a) => (a.id === act.id ? { ...a, availability: nextAvailability } : a))
        );
        showToast(`${act.title} is now ${nextAvailability === "live" ? "Live" : "Coming Soon"}.`);
      }
    } catch (err: any) {
      alert("Error updating act: " + err.message);
    }
  };

  // Handle Add Unit
  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitTitle.trim() || !selectedActId) return;

    try {
      const res = await adminFetch("/api/admin/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actId: selectedActId,
          title: newUnitTitle.trim(),
          order: units.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.unit) {
        setUnits((prev) => [...prev, data.unit]);
        setSelectedUnitId(data.unit.id);
        setNewUnitTitle("");
        setUnitModalOpen(false);
        showToast(`Created Unit: ${data.unit.title}`);
      }
    } catch (err: any) {
      alert("Error creating unit: " + err.message);
    }
  };

  // Handle Content Item Publish/Unpublish Toggle
  const handleToggleContentPublish = async (item: ContentItemRecord) => {
    const nextPublished = !item.isPublished;
    try {
      const res = await adminFetch(`/api/admin/content-items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: nextPublished }),
      });
      const data = await res.json();
      if (data.success) {
        setContentItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isPublished: nextPublished } : i))
        );
        showToast(`${item.title} is now ${nextPublished ? "Published" : "Unpublished (Draft)"}.`);
      }
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  // Handle Content Item Delete
  const handleDeleteContentItem = async (item: ContentItemRecord) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;
    try {
      const res = await adminFetch(`/api/admin/content-items/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setContentItems((prev) => prev.filter((i) => i.id !== item.id));
        showToast("Content item deleted.");
      }
    } catch (err: any) {
      alert("Error deleting item: " + err.message);
    }
  };

  // Handle PDF File Upload in Content Modal
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setContentModal((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            fileName: file.name,
            fileSize: file.size,
            cloudinaryPublicId: data.publicId || data.url || "",
          },
        }));
        showToast(`Uploaded ${file.name}`);
      } else {
        alert(data.message || "Upload failed.");
      }
    } catch (err: any) {
      alert("File upload error: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Save Content Item (Add or Edit)
  const handleSaveContentItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId) {
      alert("Please select a unit first.");
      return;
    }
    const itemData = contentModal.data;
    if (!itemData.title?.trim()) {
      alert("Please provide a content item title.");
      return;
    }

    const payload = {
      ...itemData,
      unitId: selectedUnitId,
      order: Number(itemData.order) || contentItems.length + 1,
      samplePagesRange: itemData.samplePagesRange || "1-5",
      isSample: Boolean(itemData.isSample),
      isPublished: itemData.isPublished !== false,
      type: itemData.type || "notes",
    };

    try {
      if (contentModal.mode === "add") {
        const res = await adminFetch("/api/admin/content-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.item) {
          setContentItems((prev) => [...prev, data.item]);
          setContentModal({ open: false, mode: "add", data: {} });
          showToast(`Added content item: ${data.item.title}`);
        } else {
          alert(data.message || "Failed to add content item.");
        }
      } else {
        const res = await adminFetch(`/api/admin/content-items/${itemData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.item) {
          setContentItems((prev) =>
            prev.map((i) => (i.id === data.item.id ? data.item : i))
          );
          setContentModal({ open: false, mode: "add", data: {} });
          showToast("Content item updated.");
        } else {
          alert(data.message || "Failed to update content item.");
        }
      }
    } catch (err: any) {
      alert("Error saving content: " + err.message);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const selectedAct = acts.find((a) => a.id === selectedActId) || acts[0];
  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  return (
    <div className="space-y-6 font-sans">
      {/* 1. COURSES OVERVIEW & PRICING CONTROL STRIP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#221D1D]">Courses &amp; Content Management</h2>
            <p className="text-xs text-[#77716E] mt-0.5">
              Control course live availability, access validity, and structured Course → Act → Unit content hierarchy.
            </p>
          </div>
          <button
            onClick={() => loadCourses()}
            className="p-2 rounded-2xl bg-white border border-[#E7E4E7] text-[#77716E] hover:text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Refresh Courses"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${courseLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {courses.map((course) => {
            const edit = editingCourse[course.id] || { price: course.price, accessDays: course.accessDays, saving: false };
            const isLive = course.availability === "live";

            return (
              <div
                key={course.id}
                className={`bg-white rounded-3xl border p-5 shadow-sm space-y-4 transition-all ${
                  selectedCourseId === course.id
                    ? "border-[#4B8097] ring-2 ring-[#AED7E9]/40"
                    : "border-[#E7E4E7] hover:border-[#AED7E9]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#AED7E9]/40 border border-[#AED7E9] flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-[#4B8097]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-sm text-[#221D1D] leading-tight">
                          {course.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                          {course.exam_body || "ICAI"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#77716E] mt-0.5 line-clamp-1">{course.description || "Course Codex"}</p>
                    </div>
                  </div>

                  {/* Toggle Live vs Coming Soon Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleCourseAvailability(course)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
                      isLive
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                    }`}
                    title="Click to toggle Live vs Coming Soon"
                  >
                    <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                    <span>{isLive ? "Live" : "Coming Soon"}</span>
                  </button>
                </div>

                {/* Price & accessDays Editor Form */}
                <div className="pt-3 border-t border-[#E7E4E7] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700">Price:</span>
                      <div className="relative flex items-center">
                        <span className="absolute left-2.5 text-[#77716E]">₹</span>
                        <input
                          type="number"
                          value={edit.price}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              [course.id]: { ...edit, price: Number(e.target.value) },
                            })
                          }
                          className="w-20 pl-6 pr-2 py-1 rounded-xl border border-slate-200 text-xs font-bold text-[#221D1D] focus:outline-none focus:border-[#AED7E9]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700">Access:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={edit.accessDays}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              [course.id]: { ...edit, accessDays: Number(e.target.value) },
                            })
                          }
                          className="w-16 px-2 py-1 rounded-xl border border-slate-200 text-xs font-bold text-[#221D1D] focus:outline-none focus:border-[#AED7E9]"
                        />
                        <span className="text-slate-500 text-[11px]">days</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={edit.saving}
                      onClick={() => handleSaveCoursePricing(course.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#221D1D] hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {edit.saving ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        selectedCourseId === course.id
                          ? "bg-[#AED7E9] text-[#221D1D] font-bold"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CASCADING HIERARCHY SELECTOR (COURSE -> ACT -> UNIT) */}
      <div className="bg-white rounded-3xl p-5 border border-[#E7E4E7] shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E7E4E7] pb-3">
          <Layers className="w-4 h-4 text-[#4B8097]" />
          <h3 className="font-serif font-bold text-sm text-[#221D1D]">
            Cascading Structure: {selectedCourse?.title || "Select Course"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Step 1: Select Course */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">1. Select Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-slate-200 font-semibold text-slate-800 bg-[#F7F7F5] focus:bg-white outline-none focus:border-[#AED7E9]"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.availability === "live" ? "Live" : "Coming Soon"})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Act */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">2. Select Act</label>
              {selectedAct && (
                <button
                  type="button"
                  onClick={() => handleToggleActAvailability(selectedAct)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                    selectedAct.availability === "live"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                  title="Toggle Act Live vs Coming Soon"
                >
                  {selectedAct.availability === "live" ? "Live" : "Coming Soon"}
                </button>
              )}
            </div>
            <select
              value={selectedActId}
              onChange={(e) => setSelectedActId(e.target.value)}
              disabled={actsLoading || acts.length === 0}
              className="w-full p-2.5 rounded-2xl border border-slate-200 font-semibold text-slate-800 bg-[#F7F7F5] focus:bg-white outline-none focus:border-[#AED7E9] disabled:opacity-50"
            >
              {acts.length === 0 ? (
                <option value="">No Acts Found</option>
              ) : (
                acts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} {a.availability === "coming_soon" ? " [Coming Soon]" : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Step 3: Select Unit */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">3. Select Unit</label>
              <button
                type="button"
                onClick={() => setUnitModalOpen(true)}
                disabled={!selectedActId}
                className="text-[10px] font-bold text-[#4B8097] hover:underline flex items-center gap-0.5 cursor-pointer disabled:opacity-40"
              >
                <Plus className="w-3 h-3" />
                <span>Add Unit</span>
              </button>
            </div>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              disabled={unitsLoading || units.length === 0}
              className="w-full p-2.5 rounded-2xl border border-slate-200 font-semibold text-slate-800 bg-[#F7F7F5] focus:bg-white outline-none focus:border-[#AED7E9] disabled:opacity-50"
            >
              {units.length === 0 ? (
                <option value="">No Units in this Act</option>
              ) : (
                units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.title}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* 3. CONTENT ITEMS WITHIN SELECTED UNIT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#E7E4E7] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4B8097]" />
              <h3 className="font-serif font-bold text-sm text-[#221D1D]">
                Content Items in Unit: <span className="text-[#4B8097]">{selectedUnit?.title || "None Selected"}</span>
              </h3>
            </div>
            <p className="text-[11px] text-[#77716E] mt-0.5">
              {contentItems.length} content resources configured (Chapter Notes, Flowcharts, Practice Problems, PYQs).
            </p>
          </div>

          <button
            type="button"
            disabled={!selectedUnitId}
            onClick={() =>
              setContentModal({
                open: true,
                mode: "add",
                data: {
                  unitId: selectedUnitId,
                  type: "notes",
                  isPublished: true,
                  isSample: false,
                  samplePagesRange: "1-5",
                },
              })
            }
            className="px-4 py-2 rounded-full bg-[#BFAFE5] hover:bg-[#A08DC9] text-[#221D1D] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Content Item</span>
          </button>
        </div>

        {/* Content Items List */}
        {contentLoading ? (
          <div className="p-8 text-center text-xs text-[#77716E] bg-white rounded-3xl border border-[#E7E4E7]">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#4B8097] mb-2" />
            Loading unit content...
          </div>
        ) : contentItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#77716E] bg-white rounded-3xl border border-[#E7E4E7] space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No content items in this unit yet.</p>
            <p className="text-[11px] text-slate-400">Click &quot;Add Content Item&quot; to upload chapter notes, practice questions, or revision flowcharts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentItems.map((item) => {
              const isPub = item.isPublished;
              const range = item.samplePagesRange || (item.sampleFromPage && item.sampleToPage ? `${item.sampleFromPage}-${item.sampleToPage}` : "1-5");

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-[#E7E4E7] shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C4E1EC]/60 text-[#221D1D] border border-[#AED7E9]">
                        {item.type}
                      </span>

                      {/* 1-Click Publish/Unpublish Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleContentPublish(item)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          isPub
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                        title="Click to toggle Published vs Draft"
                      >
                        {isPub ? "Published" : "Draft"}
                      </button>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-xs text-[#221D1D] leading-snug">
                        {item.title}
                      </h4>
                      {item.fileName && (
                        <p className="text-[10px] text-[#77716E] font-mono mt-0.5 truncate">
                          📄 {item.fileName}
                        </p>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-[11px] text-[#4D433F] line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Sample badge */}
                    <div className="pt-2 border-t border-[#E7E4E7] flex items-center justify-between text-[10px]">
                      {item.isSample ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#AED7E9]/40 text-[#221D1D] font-bold border border-[#AED7E9]">
                          Free Sample: Pages {range}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Full Access Only</span>
                      )}
                      <span className="text-slate-400 font-mono">Order #{item.order}</span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-3 mt-3 border-t border-[#E7E4E7] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleContentPublish(item)}
                      className="text-[11px] font-semibold text-[#4B8097] hover:underline cursor-pointer"
                    >
                      {isPub ? "Unpublish" : "Publish Now"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {onPreviewPdf && (
                        <button
                          type="button"
                          onClick={() =>
                            onPreviewPdf({
                              title: item.title,
                              pdfUrl: item.cloudinaryPublicId || "/notes/sale-of-goods-unit-1.pdf",
                              isSample: item.isSample,
                            })
                          }
                          className="p-1.5 rounded-xl bg-[#C4E1EC]/60 text-[#221D1D] hover:bg-[#C4E1EC] border border-[#AED7E9] transition-colors cursor-pointer"
                          title="Preview PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setContentModal({
                            open: true,
                            mode: "edit",
                            data: item,
                          })
                        }
                        className="p-1.5 rounded-xl bg-white border border-[#E7E4E7] text-slate-700 hover:bg-[#F7F7F5] transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteContentItem(item)}
                        className="p-1.5 rounded-xl bg-white border border-[#F4C5C0] text-[#C35F3B] hover:bg-[#F4C5C0]/30 transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. CREATE NEW UNIT MODAL */}
      {unitModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#E7E4E7] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="font-serif font-bold text-sm text-[#221D1D]">Create New Unit</h3>
              <button onClick={() => setUnitModalOpen(false)} className="p-1 rounded-xl hover:bg-[#F7F7F5]">
                <X className="w-4 h-4 text-[#77716E]" />
              </button>
            </div>
            <form onSubmit={handleCreateUnit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3: Registration and Dissolution of Firm"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUnitModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E7E4E7] text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#221D1D] text-white font-semibold cursor-pointer"
                >
                  Create Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. ADD / EDIT CONTENT ITEM MODAL */}
      {contentModal.open && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="font-serif font-bold text-sm text-[#221D1D]">
                {contentModal.mode === "add" ? "Upload & Add Content Item" : "Edit Content Item"}
              </h3>
              <button
                onClick={() => setContentModal({ open: false, mode: "add", data: {} })}
                className="p-1.5 rounded-xl hover:bg-[#F7F7F5] cursor-pointer"
              >
                <X className="w-4 h-4 text-[#77716E]" />
              </button>
            </div>

            <form onSubmit={handleSaveContentItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Content Title *</label>
                <input
                  type="text"
                  required
                  value={contentModal.data.title || ""}
                  onChange={(e) =>
                    setContentModal({
                      ...contentModal,
                      data: { ...contentModal.data, title: e.target.value },
                    })
                  }
                  placeholder="e.g. Unit 1 Formation of Contract Notes"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={contentModal.data.type || "notes"}
                    onChange={(e) =>
                      setContentModal({
                        ...contentModal,
                        data: { ...contentModal.data, type: e.target.value as any },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#AED7E9]"
                  >
                    <option value="notes">Chapter Notes</option>
                    <option value="flowchart">Concept Flowchart</option>
                    <option value="practice">Practice Questions</option>
                    <option value="case_study">Case Problems</option>
                    <option value="pyq">Past Year Questions</option>
                    <option value="revision">LDR Revision Sheet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={contentModal.data.order || 1}
                    onChange={(e) =>
                      setContentModal({
                        ...contentModal,
                        data: { ...contentModal.data, order: Number(e.target.value) },
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
              </div>

              {/* Upload PDF Section */}
              <div className="p-3 bg-[#F7F7F5] rounded-2xl border border-[#E7E4E7] space-y-2">
                <label className="block font-semibold text-slate-700">PDF File Asset</label>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E7E4E7] hover:bg-slate-50 font-semibold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4 text-[#4B8097]" />
                    <span>{isUploading ? "Uploading..." : "Upload PDF"}</span>
                  </button>
                  {contentModal.data.fileName && (
                    <span className="text-[11px] font-mono text-slate-700 truncate max-w-[200px]">
                      {contentModal.data.fileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Free Sample & Sample Page Range Selector */}
              <div className="p-3 bg-[#F7F7F5] rounded-2xl border border-[#E7E4E7] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 block">Free Sample Preview</span>
                    <span className="text-[11px] text-slate-500">Allow prospective students to read a sample preview</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={contentModal.data.isSample || false}
                    onChange={(e) =>
                      setContentModal({
                        ...contentModal,
                        data: { ...contentModal.data, isSample: e.target.checked },
                      })
                    }
                    className="w-4 h-4 rounded text-[#4B8097] cursor-pointer"
                  />
                </div>

                {contentModal.data.isSample && (
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Sample Page Range:</span>
                    <input
                      type="text"
                      placeholder="e.g. 1-5"
                      value={contentModal.data.samplePagesRange || "1-5"}
                      onChange={(e) =>
                        setContentModal({
                          ...contentModal,
                          data: { ...contentModal.data, samplePagesRange: e.target.value },
                        })
                      }
                      className="w-24 p-1.5 rounded-xl border border-slate-200 bg-white font-mono text-center focus:outline-none focus:border-[#AED7E9]"
                    />
                    <span className="text-[11px] text-slate-400">(First 5 pages extracted automatically)</span>
                  </div>
                )}
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl border border-[#E7E4E7] bg-white">
                <div>
                  <span className="font-semibold text-slate-800 block">Published</span>
                  <span className="text-[11px] text-slate-500">Visible to enrolled students immediately</span>
                </div>
                <input
                  type="checkbox"
                  checked={contentModal.data.isPublished !== false}
                  onChange={(e) =>
                    setContentModal({
                      ...contentModal,
                      data: { ...contentModal.data, isPublished: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-[#4B8097] cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={contentModal.data.description || ""}
                  onChange={(e) =>
                    setContentModal({
                      ...contentModal,
                      data: { ...contentModal.data, description: e.target.value },
                    })
                  }
                  placeholder="Topics, ICAI sections, key precedent cases..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#AED7E9]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setContentModal({ open: false, mode: "add", data: {} })}
                  className="px-4 py-2 rounded-xl border border-[#E7E4E7] text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#221D1D] hover:bg-black text-white font-semibold cursor-pointer"
                >
                  {contentModal.mode === "add" ? "Create Item" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
