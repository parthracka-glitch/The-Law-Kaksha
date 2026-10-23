"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BookOpen,
  Layers,
  Plus,
  Edit3,
  Trash2,
  Eye,
  UploadCloud,
  FileText,
  ChevronRight,
  RefreshCw,
  Save,
  X,
  ExternalLink,
  FolderOpen,
  ArrowUpRight,
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

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function AdminCoursesContentTab({ adminFetch, showToast, onPreviewPdf }: Props) {
  // Courses state
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [courseLoading, setCourseLoading] = useState<boolean>(true);
  const [editingCourse, setEditingCourse] = useState<{ [id: string]: { price: number; accessDays: number; saving: boolean } }>({});

  const [courseModalOpen, setCourseModalOpen] = useState<boolean>(false);
  const [newCourseForm, setNewCourseForm] = useState({
    title: "",
    examBody: "ICAI",
    description: "",
    price: 99,
    mrp: 299,
    accessDays: 30,
    availability: "live" as "live" | "coming_soon",
  });

  // Acts state
  const [acts, setActs] = useState<ActRecord[]>([]);
  const [selectedActId, setSelectedActId] = useState<string>("");
  const [actsLoading, setActsLoading] = useState<boolean>(false);
  const [actModalOpen, setActModalOpen] = useState<boolean>(false);
  const [newActForm, setNewActForm] = useState({
    title: "",
    description: "",
    availability: "live" as "live" | "coming_soon",
  });

  // Units state
  const [units, setUnits] = useState<UnitRecord[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [unitsLoading, setUnitsLoading] = useState<boolean>(false);
  const [unitModalOpen, setUnitModalOpen] = useState<boolean>(false);
  const [bulkUnitsModalOpen, setBulkUnitsModalOpen] = useState<boolean>(false);
  const [bulkUnitsText, setBulkUnitsText] = useState<string>("");
  const [bulkUnitsSaving, setBulkUnitsSaving] = useState<boolean>(false);
  const [newUnitForm, setNewUnitForm] = useState({
    title: "",
    summary: "",
  });

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

  const adminFetchRef = useRef(adminFetch);

  useEffect(() => {
    adminFetchRef.current = adminFetch;
  }, [adminFetch]);

  // 1. Fetch Courses
  const loadCourses = useCallback(async () => {
    setCourseLoading(true);
    try {
      const res = await adminFetchRef.current("/api/admin/courses");
      const data = await res.json();
      const rawCourses: CourseRecord[] =
        data.success && Array.isArray(data.courses) ? data.courses : [];

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
        return sorted[0]?.id || "";
      });
    } catch (err) {
      console.error("Failed to load courses:", err);
      setCourses([]);
      setSelectedCourseId("");
    } finally {
      setCourseLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // 2. Fetch Acts whenever selectedCourseId changes
  useEffect(() => {
    if (!selectedCourseId) return;
    const loadActs = async () => {
      setActsLoading(true);
      try {
        const res = await adminFetchRef.current(`/api/admin/acts?courseId=${selectedCourseId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.acts)) {
          setActs(data.acts);
          setSelectedActId((prev) =>
            prev && data.acts.some((a: ActRecord) => a.id === prev) ? prev : data.acts[0]?.id || ""
          );
        } else {
          setActs([]);
          setSelectedActId("");
        }
      } catch (err) {
        console.error("Failed to load acts:", err);
        setActs([]);
        setSelectedActId("");
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
        const res = await adminFetchRef.current(`/api/admin/units?actId=${selectedActId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.units)) {
          setUnits(data.units);
          setSelectedUnitId((prev) =>
            prev && data.units.some((u: UnitRecord) => u.id === prev) ? prev : data.units[0]?.id || ""
          );
        } else {
          setUnits([]);
          setSelectedUnitId("");
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
        const res = await adminFetchRef.current(`/api/admin/content-items?unitId=${selectedUnitId}`);
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
    } catch (err) {
      alert("Error updating course: " + errorMessage(err));
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
        showToast(`Saved ₹${edit.price} (${edit.accessDays} days) for course. Price is live across the website.`);
        loadCourses();
      } else {
        alert(data.message || "Failed to update pricing.");
      }
    } catch (err) {
      alert("Error: " + errorMessage(err));
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
    } catch (err) {
      alert("Error updating act: " + errorMessage(err));
    }
  };

  // Handle Add Course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseForm.title.trim()) return;

    try {
      const res = await adminFetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newCourseForm.title.trim(),
          exam_body: newCourseForm.examBody,
          description: newCourseForm.description.trim(),
          price: Number(newCourseForm.price),
          mrp: Number(newCourseForm.mrp),
          accessDays: Number(newCourseForm.accessDays),
          availability: newCourseForm.availability,
          display_order: courses.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.course) {
        setCourses((prev) => [...prev, data.course]);
        setEditingCourse((prev) => ({
          ...prev,
          [data.course.id]: { price: data.course.price || 0, accessDays: data.course.accessDays || 30, saving: false },
        }));
        setSelectedCourseId(data.course.id);
        setNewCourseForm({
          title: "",
          examBody: "ICAI",
          description: "",
          price: 99,
          mrp: 299,
          accessDays: 30,
          availability: "live",
        });
        setCourseModalOpen(false);
        showToast(`Created Course: ${data.course.title}. Now add its first Act.`);
      } else {
        alert(data.message || "Failed to create course.");
      }
    } catch (err) {
      alert("Error creating course: " + errorMessage(err));
    }
  };

  // Handle Add Act
  const handleCreateAct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActForm.title.trim() || !selectedCourseId) return;

    try {
      const res = await adminFetch("/api/admin/acts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourseId,
          title: newActForm.title.trim(),
          description: newActForm.description.trim(),
          availability: newActForm.availability,
          order: acts.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.act) {
        setActs((prev) => [...prev, data.act]);
        setSelectedActId(data.act.id);
        setNewActForm({ title: "", description: "", availability: "live" });
        setActModalOpen(false);
        showToast(`Created Act: ${data.act.title}. Now add its first Unit.`);
      } else {
        alert(data.message || "Failed to create act.");
      }
    } catch (err) {
      alert("Error creating act: " + errorMessage(err));
    }
  };

  // Handle Add Unit
  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitForm.title.trim() || !selectedActId) return;

    try {
      const res = await adminFetch("/api/admin/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actId: selectedActId,
          title: newUnitForm.title.trim(),
          summary: newUnitForm.summary.trim(),
          order: units.length + 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.unit) {
        setUnits((prev) => [...prev, data.unit]);
        setSelectedUnitId(data.unit.id);
        setNewUnitForm({ title: "", summary: "" });
        setUnitModalOpen(false);
        showToast(`Created Unit: ${data.unit.title}. Now add its content.`);
      } else {
        alert(data.message || "Failed to create unit.");
      }
    } catch (err) {
      alert("Error creating unit: " + errorMessage(err));
    }
  };

  // Handle Bulk Add Units (one title per line)
  const handleBulkCreateUnits = async (e: React.FormEvent) => {
    e.preventDefault();
    const titles = bulkUnitsText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!selectedActId || titles.length === 0) return;

    setBulkUnitsSaving(true);
    const created: UnitRecord[] = [];
    try {
      for (let i = 0; i < titles.length; i += 1) {
        const res = await adminFetch("/api/admin/units", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: `unit-${Date.now()}-${i + 1}`,
            actId: selectedActId,
            title: titles[i],
            order: units.length + i + 1,
            summary: "",
          }),
        });
        const data = await res.json();
        if (!data.success || !data.unit) {
          throw new Error(data.message || `Failed to create "${titles[i]}".`);
        }
        created.push(data.unit);
      }
      setUnits((prev) => [...prev, ...created]);
      setSelectedUnitId(created[0].id);
      setBulkUnitsText("");
      setBulkUnitsModalOpen(false);
      showToast(`Added ${created.length} units. Add content to each unit next.`);
    } catch (err) {
      if (created.length > 0) {
        setUnits((prev) => [...prev, ...created]);
      }
      alert("Bulk unit creation stopped: " + errorMessage(err));
    } finally {
      setBulkUnitsSaving(false);
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
    } catch (err) {
      alert("Error updating status: " + errorMessage(err));
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
    } catch (err) {
      alert("Error deleting item: " + errorMessage(err));
    }
  };

  // Handle PDF File Upload in Content Modal
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("PDF is larger than 10 MB, which is the Cloudinary upload limit. Compress or split it first.");
      e.target.value = "";
      return;
    }

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
        const inferredTitle = file.name
          .replace(/\.pdf$/i, "")
          .replace(/[_-]+/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        setContentModal((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            title: prev.data.title?.trim() ? prev.data.title : inferredTitle,
            fileName: file.name,
            fileSize: file.size,
            cloudinaryPublicId: data.publicId || data.url || "",
          },
        }));
        if (data.isLocal) {
          alert("Cloudinary upload failed, so this file was saved to local disk. It may not persist in production. Check Cloudinary credentials or file size.");
        }
        showToast(`Uploaded ${file.name}`);
      } else {
        alert(data.message || "Upload failed.");
      }
    } catch (err) {
      alert("File upload error: " + errorMessage(err));
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
    } catch (err) {
      alert("Error saving content: " + errorMessage(err));
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const selectedAct = acts.find((a) => a.id === selectedActId) || acts[0];
  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  return (
    <div className="space-y-6 font-sans">
      {/* 1. COURSES OVERVIEW & PRICING CONTROL STRIP */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#0A192F]">Courses &amp; Content Management</h2>
            <p className="text-xs text-[#475569] font-medium mt-0.5">
              Create a course, add its Acts and Units, then upload study resources — all from one place.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCourseModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Course</span>
            </button>
            <button
              onClick={() => loadCourses()}
              className="p-2 rounded-2xl bg-white border border-[#CBD5E1] text-[#0A192F] hover:text-[#005A9C] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="Refresh Courses"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${courseLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {courses.length === 0 && !courseLoading && (
            <div className="lg:col-span-2 rounded-3xl border-2 border-dashed border-[#BFDBFE] bg-[#EFF6FF]/40 p-6 sm:p-8">
              <div className="max-w-2xl mx-auto text-center space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#BFDBFE] flex items-center justify-center mx-auto shadow-sm">
                  <BookOpen className="w-7 h-7 text-[#005A9C]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#0A192F]">Start building your curriculum</h3>
                  <p className="text-xs text-[#475569] font-medium mt-1.5 max-w-lg mx-auto">
                    Create your first course, then add Acts, Units, and study resources in a simple three-step flow.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                  {[
                    ["1", "Create Course", "Title, exam body, price and access days."],
                    ["2", "Add Acts", "Group the syllabus into statutory Acts."],
                    ["3", "Add Units & Content", "Build units and upload notes, PYQs and flowcharts."],
                  ].map(([step, label, help]) => (
                    <div key={step} className="rounded-2xl bg-white border border-[#CBD5E1] p-3 shadow-2xs">
                      <span className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#005A9C] text-[11px] font-bold flex items-center justify-center mb-2 border border-[#BFDBFE]">
                        {step}
                      </span>
                      <p className="text-xs font-bold text-[#0A192F]">{label}</p>
                      <p className="text-[11px] text-[#475569] font-medium mt-0.5 leading-relaxed">{help}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Course</span>
                </button>
              </div>
            </div>
          )}
          {courses.map((course) => {
            const edit = editingCourse[course.id] || { price: course.price, accessDays: course.accessDays, saving: false };
            const isLive = course.availability === "live";

            return (
              <div
                key={course.id}
                className={`bg-white rounded-3xl border p-5 shadow-sm space-y-4 transition-all ${
                  selectedCourseId === course.id
                    ? "border-[#005A9C] ring-2 ring-[#BFDBFE]"
                    : "border-[#CBD5E1] hover:border-[#005A9C]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-[#005A9C]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#0A192F] leading-tight">
                          {course.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE]">
                          {course.exam_body || "ICAI"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#475569] font-medium mt-0.5 line-clamp-1">{course.description || "Course Codex"}</p>
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
                    <a
                      href={`/product/${course.slug || course.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#005A9C] border border-[#BFDBFE] transition-colors cursor-pointer"
                      title="Preview live course page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Live</span>
                    </a>
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

      {/* 2. SIMPLIFIED HIERARCHY NAVIGATOR (COURSE -> ACT -> UNIT) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DBEAFE] shadow-sm space-y-5">
        {/* Header with Title and Quick Redirects */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#0A192F]">
                Curriculum Navigator &amp; Study Materials
              </h3>
              <p className="text-xs text-[#64748B]">
                Easily select your Course, Act, and Unit to manage study codices and notes.
              </p>
            </div>
          </div>

          {/* Quick Immediate Redirects for Owner */}
          <div className="flex items-center gap-2">
            {selectedCourse && (
              <a
                href={`/product/${selectedCourse.slug || selectedCourse.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#005A9C] border border-[#BFDBFE] transition-colors cursor-pointer"
                title="View live course on website"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View on Website</span>
              </a>
            )}
            <a
              href="/student"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              title="Open student dashboard preview"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Student View</span>
            </a>
          </div>
        </div>

        {/* STEP 1: COURSE SELECTOR TABS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0A192F] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#005A9C] text-white flex items-center justify-center text-[10px] font-bold">1</span>
              Select Course
            </label>
            <button
              type="button"
              onClick={() => setCourseModalOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-white border border-[#BFDBFE] text-xs font-bold text-[#005A9C] hover:bg-[#EFF6FF] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {courses.map((c) => {
              const isSelected = selectedCourseId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#005A9C] text-white shadow-md shadow-[#005A9C]/25 border-2 border-[#005A9C] scale-[1.01]"
                      : "bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#0A192F] border border-slate-200 hover:border-[#BFDBFE]"
                  }`}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-[#005A9C]"}`} />
                  <span>{c.title}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      c.availability === "live"
                        ? isSelected
                          ? "bg-white/20 text-white border-white/30"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : isSelected
                        ? "bg-white/20 text-white border-white/30"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    {c.availability === "live" ? "Live" : "Coming Soon"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: ACT SELECTOR TABS */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#0A192F] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#005A9C] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                Select Act
              </label>
              <span className="text-[11px] text-slate-500 font-medium">({acts.length} Acts in course)</span>
            </div>

            <div className="flex items-center gap-2">
              {selectedAct && (
                <button
                  type="button"
                  onClick={() => handleToggleActAvailability(selectedAct)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                    selectedAct.availability === "live"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                      : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                  }`}
                  title="Click to toggle Act Live vs Coming Soon"
                >
                  Act Status: {selectedAct.availability === "live" ? "Live" : "Coming Soon"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setActModalOpen(true)}
                disabled={!selectedCourseId}
                className="px-2.5 py-1 rounded-xl bg-white border border-[#BFDBFE] text-xs font-bold text-[#005A9C] hover:bg-[#EFF6FF] flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Act</span>
              </button>
            </div>
          </div>

          {actsLoading ? (
            <div className="p-3 text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#005A9C]" />
              Loading Acts...
            </div>
          ) : acts.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 text-center">
              No Acts added to this course yet. Click &quot;+ Add Act&quot; above to create one.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {acts.map((act) => {
                const isSelected = selectedActId === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setSelectedActId(act.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#EFF6FF] text-[#005A9C] border-2 border-[#005A9C] font-bold shadow-xs"
                        : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <FolderOpen className={`w-3.5 h-3.5 ${isSelected ? "text-[#005A9C]" : "text-slate-400"}`} />
                    <span>{act.title}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        act.availability === "live"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {act.availability === "live" ? "Live" : "Draft"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* STEP 3: UNIT SELECTOR TABS */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#0A192F] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#005A9C] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                Select Unit
              </label>
              <span className="text-[11px] text-slate-500 font-medium">({units.length} Units in {selectedAct?.title || "Act"})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBulkUnitsModalOpen(true)}
                disabled={!selectedActId}
                className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-40"
                title="Paste multiple unit names at once"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Bulk Units</span>
              </button>
              <button
                type="button"
                onClick={() => setUnitModalOpen(true)}
                disabled={!selectedActId}
                className="px-2.5 py-1 rounded-xl bg-white border border-[#BFDBFE] text-xs font-bold text-[#005A9C] hover:bg-[#EFF6FF] flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Unit</span>
              </button>
            </div>
          </div>

          {unitsLoading ? (
            <div className="p-3 text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#005A9C]" />
              Loading Units...
            </div>
          ) : units.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500 text-center">
              No Units in this Act yet. Click &quot;+ Add Unit&quot; or &quot;+ Bulk Units&quot; to quickly add syllabus chapters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {units.map((unit) => {
                const isSelected = selectedUnitId === unit.id;
                return (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                      isSelected
                        ? "bg-[#EFF6FF] text-[#005A9C] border-[#005A9C] font-bold shadow-xs"
                        : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span className="line-clamp-1">{unit.title}</span>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#005A9C]" : "text-slate-300"}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. CONTENT ITEMS WITHIN SELECTED UNIT */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-[#DBEAFE] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005A9C]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#0A192F]">
                Content Items in Unit: <span className="text-[#005A9C]">{selectedUnit?.title || "None Selected"}</span>
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mt-1 ml-9">
              {contentItems.length} content resources configured (Chapter Notes, Flowcharts, Practice Problems, PYQs).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {contentItems.length > 0 && (
              <a
                href={`/reader?file=${encodeURIComponent(contentItems[0].cloudinaryPublicId || '/notes/sale-of-goods-unit-1.pdf')}&title=${encodeURIComponent(contentItems[0].title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#005A9C] border border-[#BFDBFE] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Preview unit in DRM Reader"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open in Reader</span>
              </a>
            )}

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
              className="px-4 py-2 rounded-full bg-[#005A9C] hover:bg-[#004880] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Content Item</span>
            </button>
          </div>
        </div>

        {/* Content Items List */}
        {contentLoading ? (
          <div className="p-8 text-center text-xs text-[#77716E] bg-white rounded-3xl border border-[#E7E4E7]">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#005A9C] mb-2" />
            Loading unit content...
          </div>
        ) : contentItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#77716E] bg-white rounded-3xl border border-[#E7E4E7] space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            {selectedUnitId ? (
              <>
                <p className="font-semibold text-slate-700">No content items in this unit yet.</p>
                <p className="text-[11px] text-slate-400">Upload chapter notes, practice questions, or revision flowcharts.</p>
                <button
                  type="button"
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
                  className="mt-2 px-4 py-2 rounded-full bg-[#005A9C] hover:bg-[#004880] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add First Content Item
                </button>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-700">Select a unit to manage its content.</p>
                <p className="text-[11px] text-slate-400">Choose a course, then an Act and Unit above to upload study material.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentItems.map((item) => {
              const isPub = item.isPublished;
              const range = item.samplePagesRange || (item.sampleFromPage && item.sampleToPage ? `${item.sampleFromPage}-${item.sampleToPage}` : "1-5");

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-[#DBEAFE] shadow-sm p-4 flex flex-col justify-between hover:shadow-md hover:border-[#BFDBFE] transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#005A9C] border border-[#BFDBFE]">
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
                      <h4 className="font-serif font-bold text-xs text-[#0A192F] leading-snug">
                        {item.title}
                      </h4>
                      {item.fileName && (
                        <p className="text-[10px] text-slate-500 font-mono mt-1 truncate flex items-center gap-1">
                          📄 <span>{item.fileName}</span>
                        </p>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Sample badge */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      {item.isSample ? (
                        <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#005A9C] font-bold border border-[#BFDBFE]">
                          Free Sample: Pages {range}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Full Access Only</span>
                      )}
                      <span className="text-slate-400 font-mono">Order #{item.order}</span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleContentPublish(item)}
                      className="text-[11px] font-semibold text-[#005A9C] hover:underline cursor-pointer"
                    >
                      {isPub ? "Unpublish" : "Publish Now"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Direct DRM Reader preview */}
                      <a
                        href={`/reader?file=${encodeURIComponent(item.cloudinaryPublicId || '/notes/sale-of-goods-unit-1.pdf')}&title=${encodeURIComponent(item.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-xl bg-[#EFF6FF] text-[#005A9C] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-colors cursor-pointer"
                        title="Open in DRM Student Reader (New Tab)"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

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
                          className="p-1.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                          title="Preview PDF in Modal"
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
                        className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteContentItem(item)}
                        className="p-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

      {/* 4. CREATE NEW COURSE MODAL */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="font-serif font-bold text-sm text-[#221D1D]">Create New Course</h3>
              <button onClick={() => setCourseModalOpen(false)} className="p-1 rounded-xl hover:bg-[#F7F7F5]">
                <X className="w-4 h-4 text-[#77716E]" />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CA Foundation Paper 2: Business Laws"
                  value={newCourseForm.title}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Body</label>
                  <select
                    value={newCourseForm.examBody}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, examBody: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#AED7E9]"
                  >
                    <option value="ICAI">ICAI</option>
                    <option value="ICSI">ICSI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability</label>
                  <select
                    value={newCourseForm.availability}
                    onChange={(e) =>
                      setNewCourseForm({
                        ...newCourseForm,
                        availability: e.target.value as "live" | "coming_soon",
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#AED7E9]"
                  >
                    <option value="live">Live</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  placeholder="What does this course cover?"
                  value={newCourseForm.description}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9] resize-y"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newCourseForm.price}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newCourseForm.mrp}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, mrp: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access (days)</label>
                  <input
                    type="number"
                    min={1}
                    value={newCourseForm.accessDays}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, accessDays: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E7E4E7] text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#221D1D] text-white font-semibold cursor-pointer"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. CREATE NEW ACT MODAL */}
      {actModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#E7E4E7] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <h3 className="font-serif font-bold text-sm text-[#221D1D]">Create New Act</h3>
              <button onClick={() => setActModalOpen(false)} className="p-1 rounded-xl hover:bg-[#F7F7F5]">
                <X className="w-4 h-4 text-[#77716E]" />
              </button>
            </div>
            <form onSubmit={handleCreateAct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Act Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Indian Contract Act, 1872"
                  value={newActForm.title}
                  onChange={(e) => setNewActForm({ ...newActForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional summary of this Act"
                  value={newActForm.description}
                  onChange={(e) => setNewActForm({ ...newActForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9] resize-y"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Availability</label>
                <select
                  value={newActForm.availability}
                  onChange={(e) =>
                    setNewActForm({
                      ...newActForm,
                      availability: e.target.value as "live" | "coming_soon",
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#AED7E9]"
                >
                  <option value="live">Live</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E7E4E7] text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#221D1D] text-white font-semibold cursor-pointer"
                >
                  Create Act
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CREATE NEW UNIT MODAL */}
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
                <label className="block font-semibold text-slate-700 mb-1">Unit Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3: Registration and Dissolution of Firm"
                  value={newUnitForm.title}
                  onChange={(e) => setNewUnitForm({ ...newUnitForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9]"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Summary</label>
                <textarea
                  rows={3}
                  placeholder="Optional short summary shown to students"
                  value={newUnitForm.summary}
                  onChange={(e) => setNewUnitForm({ ...newUnitForm, summary: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9] resize-y"
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

      {/* 7. BULK ADD UNITS MODAL */}
      {bulkUnitsModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#221D1D]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E7E4E7] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#221D1D]">Bulk Add Units</h3>
                <p className="text-[11px] text-[#77716E] mt-0.5">
                  Paste one unit title per line into {selectedAct?.title || "the selected Act"}.
                </p>
              </div>
              <button
                onClick={() => setBulkUnitsModalOpen(false)}
                className="p-1 rounded-xl hover:bg-[#F7F7F5] cursor-pointer"
              >
                <X className="w-4 h-4 text-[#77716E]" />
              </button>
            </div>
            <form onSubmit={handleBulkCreateUnits} className="space-y-4 text-xs">
              <textarea
                rows={9}
                required
                value={bulkUnitsText}
                onChange={(e) => setBulkUnitsText(e.target.value)}
                placeholder={"Unit 1: Formation of Contract of Sale\nUnit 2: Conditions and Warranties\nUnit 3: Transfer of Ownership and Delivery of Goods"}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#AED7E9] resize-y"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {bulkUnitsText.split(/\r?\n/).filter((line) => line.trim()).length} units detected
                </span>
                <span>Order follows the list</span>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setBulkUnitsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E7E4E7] text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkUnitsSaving || !bulkUnitsText.trim()}
                  className="px-4 py-2 rounded-xl bg-[#221D1D] text-white font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {bulkUnitsSaving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{bulkUnitsSaving ? "Adding..." : "Add Units"}</span>
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
                        data: { ...contentModal.data, type: e.target.value as ContentItemRecord["type"] },
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
