"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
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
  Check,
  Loader2,
  FileCheck,
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
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Courses state
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [courseLoading, setCourseLoading] = useState<boolean>(true);
  const [editingCourse, setEditingCourse] = useState<{ [id: string]: { price: number; mrp: number; accessDays: number; saving: boolean } }>({});
  const [uploadingCourseId, setUploadingCourseId] = useState<string | null>(null);
  const courseImageInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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

  const [editCourseModalOpen, setEditCourseModalOpen] = useState<boolean>(false);
  const [editingCourseData, setEditingCourseData] = useState<CourseRecord | null>(null);
  const [editCourseForm, setEditCourseForm] = useState({
    title: "",
    examBody: "ICAI",
    description: "",
    price: 99,
    mrp: 299,
    accessDays: 30,
    availability: "live" as "live" | "coming_soon",
    slug: "",
    thumbnail: "",
  });
  const [editCourseSaving, setEditCourseSaving] = useState<boolean>(false);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

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

  // Simplified PDF Upload Modal State
  const [simplifiedUploadOpen, setSimplifiedUploadOpen] = useState<boolean>(false);
  const [targetCourseId, setTargetCourseId] = useState<string>("");
  const [targetActId, setTargetActId] = useState<string>("");
  const [targetUnitId, setTargetUnitId] = useState<string>("");

  const [uploadActsList, setUploadActsList] = useState<ActRecord[]>([]);
  const [uploadUnitsList, setUploadUnitsList] = useState<UnitRecord[]>([]);
  const [loadingUploadActs, setLoadingUploadActs] = useState<boolean>(false);
  const [loadingUploadUnits, setLoadingUploadUnits] = useState<boolean>(false);

  const [creatingActInline, setCreatingActInline] = useState<boolean>(false);
  const [inlineActName, setInlineActName] = useState<string>("");
  const [creatingUnitInline, setCreatingUnitInline] = useState<boolean>(false);
  const [inlineUnitName, setInlineUnitName] = useState<string>("");

  const [pdfUploadFile, setPdfUploadFile] = useState<File | null>(null);
  const [pdfUploadProgress, setPdfUploadProgress] = useState<boolean>(false);
  const [pdfUploadedPublicId, setPdfUploadedPublicId] = useState<string>("");
  const [pdfUploadedFileName, setPdfUploadedFileName] = useState<string>("");
  const [pdfUploadedFileSize, setPdfUploadedFileSize] = useState<number>(0);

  const [pdfTitle, setPdfTitle] = useState<string>("");
  const [pdfContentType, setPdfContentType] = useState<ContentItemRecord["type"]>("notes");
  const [pdfIsSample, setPdfIsSample] = useState<boolean>(false);
  const [pdfSamplePages, setPdfSamplePages] = useState<string>("1-5");
  const [pdfIsPublished, setPdfIsPublished] = useState<boolean>(true);
  const [pdfDescription, setPdfDescription] = useState<string>("");
  const [pdfSaving, setPdfSaving] = useState<boolean>(false);

  const simplifiedFileInputRef = useRef<HTMLInputElement>(null);

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
      const editMap: { [id: string]: { price: number; mrp: number; accessDays: number; saving: boolean } } = {};
      sorted.forEach((c: CourseRecord) => {
        const p = typeof c.price === "number" ? c.price : 99;
        const m = typeof c.mrp === "number" && c.mrp > 0 ? c.mrp : (p > 0 ? Math.max(p * 2, 299) : 299);
        editMap[c.id] = { price: p, mrp: m, accessDays: c.accessDays || 30, saving: false };
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

  // Handle Course Image Upload from Device
  const handleUploadCourseImage = async (courseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    setUploadingCourseId(courseId);
    showToast("Uploading course cover image...");

    try {
      let finalUrl = "";
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadRes = await adminFetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && (uploadData.url || uploadData.publicId)) {
          finalUrl = uploadData.url || uploadData.publicId;
        }
      } catch (uploadErr) {
        console.warn("Server upload failed, converting to data url:", uploadErr);
      }

      if (!finalUrl) {
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const saveRes = await adminFetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail: finalUrl }),
      });
      const saveData = await saveRes.json();

      if (saveData.success) {
        setCourses((prev) =>
          prev.map((c) => (c.id === courseId ? { ...c, thumbnail: finalUrl } : c))
        );
        showToast("Course cover image updated! Changes are now live across the website.");
        loadCourses();
      } else {
        alert(saveData.message || "Failed to update course image.");
      }
    } catch (err) {
      alert("Error uploading image: " + errorMessage(err));
    } finally {
      setUploadingCourseId(null);
      if (e.target) e.target.value = "";
    }
  };

  // Handle Course Price & AccessDays Save with optional immediate redirect
  const handleSaveCoursePricing = async (courseId: string, andRedirect: boolean = false) => {
    const edit = editingCourse[courseId];
    if (!edit) return;
    setEditingCourse((prev) => ({
      ...prev,
      [courseId]: { ...prev[courseId], saving: true },
    }));

    try {
      const payloadMrp = Number(edit.mrp || (edit.price > 0 ? Math.max(edit.price * 2, 299) : 299));
      const res = await adminFetch(`/api/admin/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: Number(edit.price),
          mrp: payloadMrp,
          accessDays: Number(edit.accessDays),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === courseId
              ? { ...c, price: Number(edit.price), mrp: payloadMrp, accessDays: Number(edit.accessDays) }
              : c
          )
        );
        showToast(`Saved ₹${edit.price} (MRP: ₹${payloadMrp}, ${edit.accessDays} days) for course. Price is live across the website.`);
        loadCourses();

        if (andRedirect) {
          const targetCourse = courses.find((c) => c.id === courseId);
          const targetSlug = targetCourse?.slug || courseId;
          window.open(`/product/${targetSlug}`, "_blank");
        }
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
          [data.course.id]: {
            price: data.course.price || 0,
            mrp: data.course.mrp || 299,
            accessDays: data.course.accessDays || 30,
            saving: false,
          },
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

  // Handle Open Edit Course Modal
  const handleOpenEditCourse = (course: CourseRecord) => {
    setEditingCourseData(course);
    setEditCourseForm({
      title: course.title || "",
      examBody: course.exam_body || "ICAI",
      description: course.description || "",
      price: typeof course.price === "number" ? course.price : 99,
      mrp: typeof course.mrp === "number" ? course.mrp : (typeof course.price === "number" ? course.price * 2 : 299),
      accessDays: typeof course.accessDays === "number" ? course.accessDays : 30,
      availability: course.availability === "coming_soon" ? "coming_soon" : "live",
      slug: course.slug || course.id || "",
      thumbnail: course.thumbnail || "",
    });
    setEditCourseModalOpen(true);
  };

  // Handle Save Course Edits
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourseData) return;
    setEditCourseSaving(true);
    try {
      const res = await adminFetchRef.current(`/api/admin/courses/${editingCourseData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editCourseForm.title.trim(),
          exam_body: editCourseForm.examBody,
          description: editCourseForm.description.trim(),
          price: Number(editCourseForm.price),
          mrp: Number(editCourseForm.mrp),
          accessDays: Number(editCourseForm.accessDays),
          availability: editCourseForm.availability,
          slug: editCourseForm.slug.trim(),
          thumbnail: editCourseForm.thumbnail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === editingCourseData.id
              ? {
                  ...c,
                  title: editCourseForm.title.trim(),
                  exam_body: editCourseForm.examBody,
                  description: editCourseForm.description.trim(),
                  price: Number(editCourseForm.price),
                  mrp: Number(editCourseForm.mrp),
                  accessDays: Number(editCourseForm.accessDays),
                  availability: editCourseForm.availability,
                  slug: editCourseForm.slug.trim(),
                  thumbnail: editCourseForm.thumbnail || c.thumbnail,
                }
              : c
          )
        );
        setEditingCourse((prev) => ({
          ...prev,
          [editingCourseData.id]: {
            price: Number(editCourseForm.price),
            mrp: Number(editCourseForm.mrp || (Number(editCourseForm.price) > 0 ? Number(editCourseForm.price) * 2 : 299)),
            accessDays: Number(editCourseForm.accessDays),
            saving: false,
          },
        }));
        setEditCourseModalOpen(false);
        setEditingCourseData(null);
        showToast(`Course "${editCourseForm.title}" updated successfully.`);
      } else {
        alert(data.message || "Failed to update course.");
      }
    } catch (err) {
      alert("Error updating course: " + errorMessage(err));
    } finally {
      setEditCourseSaving(false);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (course: CourseRecord) => {
    const isCore = course.id === "course-ca-foundation" || course.id === "course-cseet";
    const promptMsg = isCore
      ? `CAUTION: "${course.title}" is a primary foundational course.\n\nAre you sure you want to permanently delete it from the website?`
      : `Are you sure you want to delete course "${course.title}"?\n\nThis will remove the course and its configuration from the website.`;

    if (!confirm(promptMsg)) return;

    setDeletingCourseId(course.id);
    try {
      let res: Response;
      try {
        res = await adminFetchRef.current(`/api/admin/courses/${course.id}`, {
          method: "DELETE",
        });
        if (!res.ok && res.status !== 404) {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch {
        // Fallback to POST /delete if browser CORS/firewall restricts DELETE method
        res = await adminFetchRef.current(`/api/admin/courses/${course.id}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: course.id }),
        });
      }
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c.id !== course.id));
        if (selectedCourseId === course.id) {
          setSelectedCourseId("");
          setActs([]);
          setUnits([]);
          setContentItems([]);
        }
        showToast(`Course "${course.title}" deleted.`);
      } else {
        alert(data.message || "Failed to delete course.");
      }
    } catch (err) {
      alert("Error deleting course: " + errorMessage(err));
    } finally {
      setDeletingCourseId(null);
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

  // Simplified PDF Upload Helper Methods
  const loadModalUnits = async (actIdToLoad: string, preferUnitId?: string) => {
    if (!actIdToLoad || actIdToLoad === "__new_act__") {
      setUploadUnitsList([]);
      setTargetUnitId("");
      return;
    }
    setLoadingUploadUnits(true);
    try {
      const res = await adminFetchRef.current(`/api/admin/units?actId=${actIdToLoad}`);
      const data = await res.json();
      const fetched: UnitRecord[] = data.success && Array.isArray(data.units) ? data.units : [];
      setUploadUnitsList(fetched);
      if (fetched.length > 0) {
        const uId = preferUnitId && fetched.some((u) => u.id === preferUnitId) ? preferUnitId : fetched[0].id;
        setTargetUnitId(uId);
        setCreatingUnitInline(false);
      } else {
        setTargetUnitId("__new_unit__");
        setCreatingUnitInline(true);
      }
    } catch (err) {
      console.error("Error loading units in upload modal:", err);
      setUploadUnitsList([]);
      setTargetUnitId("");
    } finally {
      setLoadingUploadUnits(false);
    }
  };

  const loadModalActs = async (courseIdToLoad: string, preferActId?: string, preferUnitId?: string) => {
    if (!courseIdToLoad) {
      setUploadActsList([]);
      setTargetActId("");
      setUploadUnitsList([]);
      setTargetUnitId("");
      return;
    }
    setLoadingUploadActs(true);
    try {
      const res = await adminFetchRef.current(`/api/admin/acts?courseId=${courseIdToLoad}`);
      const data = await res.json();
      const fetched: ActRecord[] = data.success && Array.isArray(data.acts) ? data.acts : [];
      setUploadActsList(fetched);
      if (fetched.length > 0) {
        const aId = preferActId && fetched.some((a) => a.id === preferActId) ? preferActId : fetched[0].id;
        setTargetActId(aId);
        setCreatingActInline(false);
        await loadModalUnits(aId, preferUnitId);
      } else {
        setTargetActId("__new_act__");
        setCreatingActInline(true);
        setUploadUnitsList([]);
        setTargetUnitId("__new_unit__");
        setCreatingUnitInline(true);
      }
    } catch (err) {
      console.error("Error loading acts in upload modal:", err);
      setUploadActsList([]);
      setTargetActId("");
      setUploadUnitsList([]);
      setTargetUnitId("");
    } finally {
      setLoadingUploadActs(false);
    }
  };

  const handleOpenSimplifiedUpload = async (courseId?: string, actId?: string, unitId?: string) => {
    const chosenCourse = courseId || selectedCourseId || courses[0]?.id || "";
    setTargetCourseId(chosenCourse);
    setCreatingActInline(false);
    setInlineActName("");
    setCreatingUnitInline(false);
    setInlineUnitName("");
    setPdfUploadFile(null);
    setPdfUploadedPublicId("");
    setPdfUploadedFileName("");
    setPdfUploadedFileSize(0);
    setPdfTitle("");
    setPdfContentType("notes");
    setPdfIsSample(false);
    setPdfSamplePages("1-5");
    setPdfIsPublished(true);
    setPdfDescription("");

    setSimplifiedUploadOpen(true);

    if (chosenCourse) {
      await loadModalActs(chosenCourse, actId || selectedActId, unitId || selectedUnitId);
    }
  };

  const handleCourseChangeInModal = async (newCourseId: string) => {
    setTargetCourseId(newCourseId);
    setCreatingActInline(false);
    setCreatingUnitInline(false);
    await loadModalActs(newCourseId);
  };

  const handleActChangeInModal = async (newActId: string) => {
    setTargetActId(newActId);
    if (newActId === "__new_act__") {
      setCreatingActInline(true);
      setUploadUnitsList([]);
      setTargetUnitId("__new_unit__");
      setCreatingUnitInline(true);
    } else {
      setCreatingActInline(false);
      await loadModalUnits(newActId);
    }
  };

  const handleUnitChangeInModal = (newUnitId: string) => {
    setTargetUnitId(newUnitId);
    if (newUnitId === "__new_unit__") {
      setCreatingUnitInline(true);
    } else {
      setCreatingUnitInline(false);
    }
  };

  const handleSimplifiedPdfSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF file (.pdf).");
      return;
    }

    setPdfUploadFile(file);
    setPdfUploadedFileName(file.name);
    setPdfUploadedFileSize(file.size);

    const inferredTitle = file.name
      .replace(/\.pdf$/i, "")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!pdfTitle.trim()) {
      setPdfTitle(inferredTitle);
    }

    setPdfUploadProgress(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await adminFetchRef.current("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && (data.publicId || data.url)) {
        setPdfUploadedPublicId(data.publicId || data.url);
        showToast(`Uploaded ${file.name}`);
      } else {
        alert(data.message || "Failed to upload PDF. Please check server logs.");
      }
    } catch (err) {
      alert("PDF upload failed: " + errorMessage(err));
    } finally {
      setPdfUploadProgress(false);
    }
  };

  const handleSubmitSimplifiedUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCourseId) {
      alert("Please choose a course for this PDF.");
      return;
    }
    if (!pdfTitle.trim()) {
      alert("Please enter a title for this PDF.");
      return;
    }
    if (!pdfUploadedPublicId && !pdfUploadFile) {
      alert("Please select a PDF file to upload.");
      return;
    }

    setPdfSaving(true);
    try {
      let finalPublicId = pdfUploadedPublicId;
      if (!finalPublicId && pdfUploadFile) {
        const formData = new FormData();
        formData.append("file", pdfUploadFile);
        const uploadRes = await adminFetchRef.current("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadData.success || (!uploadData.publicId && !uploadData.url)) {
          throw new Error(uploadData.message || "Failed to upload PDF file.");
        }
        finalPublicId = uploadData.publicId || uploadData.url;
      }

      // Resolve Act
      let finalActId = targetActId;
      if (!finalActId || creatingActInline || finalActId === "__new_act__") {
        const actTitleToCreate =
          inlineActName.trim() ||
          (uploadActsList.length === 0 ? "General Subject Modules" : `Module ${uploadActsList.length + 1}`);
        const actRes = await adminFetchRef.current("/api/admin/acts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: targetCourseId,
            title: actTitleToCreate,
            availability: "live",
            order: uploadActsList.length + 1,
          }),
        });
        const actData = await actRes.json();
        if (actData.success && actData.act) {
          finalActId = actData.act.id;
          if (selectedCourseId === targetCourseId) {
            setActs((prev) => [...prev, actData.act]);
          }
        } else {
          throw new Error(actData.message || "Failed to initialize Act for course.");
        }
      }

      // Resolve Unit
      let finalUnitId = targetUnitId;
      if (!finalUnitId || creatingUnitInline || finalUnitId === "__new_unit__") {
        const unitTitleToCreate =
          inlineUnitName.trim() ||
          (uploadUnitsList.length === 0 ? "Unit 1 - Core Notes" : `Unit ${uploadUnitsList.length + 1}`);
        const unitRes = await adminFetchRef.current("/api/admin/units", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actId: finalActId,
            title: unitTitleToCreate,
            order: uploadUnitsList.length + 1,
          }),
        });
        const unitData = await unitRes.json();
        if (unitData.success && unitData.unit) {
          finalUnitId = unitData.unit.id;
          if (selectedActId === finalActId) {
            setUnits((prev) => [...prev, unitData.unit]);
          }
        } else {
          throw new Error(unitData.message || "Failed to initialize Unit for act.");
        }
      }

      // Save Content Item
      const payload = {
        unitId: finalUnitId,
        title: pdfTitle.trim(),
        type: pdfContentType,
        cloudinaryPublicId: finalPublicId,
        fileName: pdfUploadedFileName || pdfUploadFile?.name || "document.pdf",
        fileSize: pdfUploadedFileSize || pdfUploadFile?.size || 0,
        isSample: pdfIsSample,
        samplePagesRange: pdfSamplePages || "1-5",
        isPublished: pdfIsPublished,
        description: pdfDescription.trim(),
        order: 1,
      };

      const res = await adminFetchRef.current("/api/admin/content-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.item) {
        showToast(`Published PDF: ${data.item.title}`);
        setSimplifiedUploadOpen(false);

        // Switch active hierarchy to display newly uploaded item
        setSelectedCourseId(targetCourseId);
        setSelectedActId(finalActId);
        setSelectedUnitId(finalUnitId);

        // Fetch fresh content items
        const itemsRes = await adminFetchRef.current(`/api/admin/content-items?unitId=${finalUnitId}`);
        const itemsData = await itemsRes.json();
        if (itemsData.success && itemsData.items) {
          setContentItems(itemsData.items);
        }
      } else {
        alert(data.message || "Failed to save content item.");
      }
    } catch (err) {
      alert("Error saving PDF content: " + errorMessage(err));
    } finally {
      setPdfSaving(false);
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
              type="button"
              onClick={() => handleOpenSimplifiedUpload()}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
              title="Upload a new PDF to any course or unit"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New PDF</span>
            </button>
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
            const edit = editingCourse[course.id] || {
              price: course.price,
              mrp: typeof course.mrp === "number" && course.mrp > 0 ? course.mrp : (course.price > 0 ? Math.max(course.price * 2, 299) : 299),
              accessDays: course.accessDays,
              saving: false,
            };
            const isLive = course.availability === "live";
            const thumbnailSrc = course.thumbnail || "/assets/ca-cs-hero-books-sharp.png";

            return (
              <div
                key={course.id}
                className={`bg-white rounded-3xl border p-5 shadow-sm space-y-4 transition-all ${
                  selectedCourseId === course.id
                    ? "border-[#005A9C] ring-2 ring-[#BFDBFE]"
                    : "border-[#CBD5E1] hover:border-[#005A9C]"
                }`}
              >
                {/* Hidden File Input for Device Image Upload */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={(el) => {
                    courseImageInputRefs.current[course.id] = el;
                  }}
                  onChange={(e) => handleUploadCourseImage(course.id, e)}
                />

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

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCourse(course)}
                      className="px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 bg-white hover:bg-slate-100 text-[#005A9C] border border-[#BFDBFE] transition-colors cursor-pointer shadow-2xs"
                      title="Edit Course Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      disabled={deletingCourseId === course.id}
                      onClick={() => handleDeleteCourse(course)}
                      className="px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                      title="Delete Course"
                    >
                      {deletingCourseId === course.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>

                    {/* Toggle Live vs Coming Soon Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleCourseAvailability(course)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
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
                </div>

                {/* Course Cover Image & Direct Device Upload Section */}
                <div className="flex items-center gap-3 bg-[#F0F7FF] border border-[#BFDBFE] p-3 rounded-2xl">
                  <div className="relative w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-white border border-[#CBD5E1] shrink-0 shadow-2xs flex items-center justify-center">
                    <Image
                      src={thumbnailSrc}
                      alt={course.title}
                      fill
                      className="object-contain p-1"
                      unoptimized={thumbnailSrc.startsWith("http") || thumbnailSrc.startsWith("data:") || thumbnailSrc.startsWith("/uploads")}
                    />
                    {uploadingCourseId === course.id && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-[#005A9C] animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0A192F]">Course Cover Artwork</span>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Live on Site
                      </span>
                    </div>
                    <p className="text-[11px] text-[#475569] leading-tight">
                      This image is displayed on the product page and homepage carousel.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        disabled={uploadingCourseId === course.id}
                        onClick={() => courseImageInputRefs.current[course.id]?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#005A9C] hover:bg-[#004F8A] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{uploadingCourseId === course.id ? "Uploading..." : "Upload Cover Image from Device"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price & accessDays Editor Form */}
                <div className="pt-3 border-t border-[#E7E4E7] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
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
                      <span className="font-semibold text-slate-700">MRP:</span>
                      <div className="relative flex items-center">
                        <span className="absolute left-2.5 text-[#77716E]">₹</span>
                        <input
                          type="number"
                          value={edit.mrp}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              [course.id]: { ...edit, mrp: Number(e.target.value) },
                            })
                          }
                          className="w-20 pl-6 pr-2 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 focus:outline-none focus:border-[#AED7E9]"
                          title="MRP / Strike Price"
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

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={edit.saving}
                      onClick={() => handleSaveCoursePricing(course.id, false)}
                      className="px-3 py-1.5 rounded-xl bg-[#221D1D] hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      title="Save price change to live website"
                    >
                      {edit.saving ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>Save Price</span>
                    </button>
                    <button
                      type="button"
                      disabled={edit.saving}
                      onClick={() => handleSaveCoursePricing(course.id, true)}
                      className="px-3 py-1.5 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                      title="Save price and immediately open live product page"
                    >
                      <span>Save &amp; View Live</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`/product/${course.slug || course.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#005A9C] border border-[#BFDBFE] transition-colors cursor-pointer"
                      title="Preview live course page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Live</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleOpenSimplifiedUpload(course.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                      title={`Upload a new PDF to ${course.title}`}
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Upload PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditCourse(course)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors cursor-pointer"
                      title="Edit Course Details"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={deletingCourseId === course.id}
                      onClick={() => handleDeleteCourse(course)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete Course"
                    >
                      {deletingCourseId === course.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCourseId(course.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
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
                href={`/reader?file=${encodeURIComponent(contentItems[0].cloudinaryPublicId || (contentItems[0].fileName ? `/notes/${contentItems[0].fileName}` : '/notes/sale-of-goods-unit-1.pdf'))}&title=${encodeURIComponent(contentItems[0].title)}`}
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
              onClick={() => handleOpenSimplifiedUpload(selectedCourseId, selectedActId, selectedUnitId)}
              className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
              title="Upload a new PDF to this unit or any other course"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New PDF</span>
            </button>

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
              className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Manual Entry</span>
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
                  onClick={() => handleOpenSimplifiedUpload(selectedCourseId, selectedActId, selectedUnitId)}
                  className="mt-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload PDF Document</span>
                </button>
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-700">Select a unit or upload directly.</p>
                <p className="text-[11px] text-slate-400">Upload a PDF to any course, Act or unit with one click.</p>
                <button
                  type="button"
                  onClick={() => handleOpenSimplifiedUpload(selectedCourseId)}
                  className="mt-3 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload New PDF to Course</span>
                </button>
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
                        href={`/reader?file=${encodeURIComponent(item.cloudinaryPublicId || (item.fileName ? `/notes/${item.fileName}` : '/notes/sale-of-goods-unit-1.pdf'))}&title=${encodeURIComponent(item.title)}`}
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
                              pdfUrl: item.cloudinaryPublicId || (item.fileName ? `/notes/${item.fileName}` : "/notes/sale-of-goods-unit-1.pdf"),
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
      {courseModalOpen && isMounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#221D1D]/60 backdrop-blur-xs flex items-center justify-center p-4">
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
        </div>,
        document.body
      )}

      {/* EDIT COURSE MODAL */}
      {editCourseModalOpen && editingCourseData && isMounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#221D1D]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#E7E4E7] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E4E7]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#221D1D]">
                  Edit Course Details
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  ID: {editingCourseData.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditCourseModalOpen(false);
                  setEditingCourseData(null);
                }}
                className="p-1 rounded-xl hover:bg-[#F7F7F5] cursor-pointer"
              >
                <X className="w-4 h-4 text-[#77716E]" />
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Course Title"
                  value={editCourseForm.title}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9] font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. ca-foundation or course-ca-foundation"
                  value={editCourseForm.slug}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, slug: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Body</label>
                  <select
                    value={editCourseForm.examBody}
                    onChange={(e) => setEditCourseForm({ ...editCourseForm, examBody: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#AED7E9]"
                  >
                    <option value="ICAI">ICAI</option>
                    <option value="ICSI">ICSI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Availability Status</label>
                  <select
                    value={editCourseForm.availability}
                    onChange={(e) =>
                      setEditCourseForm({
                        ...editCourseForm,
                        availability: e.target.value as "live" | "coming_soon",
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:border-[#AED7E9]"
                  >
                    <option value="live">Live (Active on Website)</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  placeholder="What does this course codex cover?"
                  value={editCourseForm.description}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9] resize-y"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editCourseForm.price}
                    onChange={(e) => setEditCourseForm({ ...editCourseForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#221D1D] focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MRP Strike Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editCourseForm.mrp}
                    onChange={(e) => setEditCourseForm({ ...editCourseForm, mrp: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access (Days)</label>
                  <input
                    type="number"
                    min={1}
                    value={editCourseForm.accessDays}
                    onChange={(e) => setEditCourseForm({ ...editCourseForm, accessDays: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#AED7E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cover Image URL / Path</label>
                <input
                  type="text"
                  placeholder="/assets/ca-cs-hero-books-sharp.png or https://..."
                  value={editCourseForm.thumbnail}
                  onChange={(e) => setEditCourseForm({ ...editCourseForm, thumbnail: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#AED7E9] font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  You can also upload a cover image directly from your computer using the &quot;Upload Cover Image from Device&quot; button on the course card.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E7E4E7]">
                <button
                  type="button"
                  onClick={() => handleDeleteCourse(editingCourseData)}
                  className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Course</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditCourseModalOpen(false);
                      setEditingCourseData(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-[#E7E4E7] text-slate-600 font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editCourseSaving}
                    className="px-5 py-2 rounded-xl bg-[#005A9C] hover:bg-[#004F8A] text-white font-bold cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {editCourseSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{editCourseSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 5. CREATE NEW ACT MODAL */}
      {actModalOpen && isMounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#221D1D]/60 backdrop-blur-xs flex items-center justify-center p-4">
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
        </div>,
        document.body
      )}

      {/* 6. CREATE NEW UNIT MODAL */}
      {unitModalOpen && isMounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#221D1D]/60 backdrop-blur-xs flex items-center justify-center p-4">
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
        </div>,
        document.body
      )}

      {/* 7. BULK ADD UNITS MODAL */}
      {bulkUnitsModalOpen && isMounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#221D1D]/60 backdrop-blur-xs flex items-center justify-center p-4">
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
        </div>,
        document.body
      )}

      {/* 5. ADD / EDIT CONTENT ITEM MODAL */}
      {contentModal.open && isMounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-[#221D1D]/60 backdrop-blur-xs flex items-center justify-center p-4">
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
        </div>,
        document.body
      )}

      {/* ============================================================ */}
      {/* SIMPLIFIED PDF UPLOAD MODAL                                  */}
      {/* ============================================================ */}
      {simplifiedUploadOpen && isMounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
          <form
            onSubmit={handleSubmitSimplifiedUpload}
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* 1. PINNED HEADER - Always visible at top, never cut off */}
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/70 via-slate-50 to-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                    Upload Study Material PDF
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Simplified Flow
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload notes, flowcharts, or questions directly to any course with 1 click.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSimplifiedUploadOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. SCROLLABLE FORM BODY - Smooth internal scroll on any screen size */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs text-slate-700">
              {/* STEP 1: TARGET COURSE & STRUCTURE */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-black">1</span>
                    Target Course &amp; Placement
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Auto-creates chapters if none exist</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Course Selector */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Course *</label>
                    <select
                      value={targetCourseId}
                      onChange={(e) => handleCourseChangeInModal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      required
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Act / Subject Selector */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Act / Subject *</span>
                      {loadingUploadActs && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
                    </label>
                    <select
                      value={targetActId}
                      onChange={(e) => handleActChangeInModal(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      {uploadActsList.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.title}
                        </option>
                      ))}
                      <option value="__new_act__">+ New Act / Subject...</option>
                    </select>
                  </div>

                  {/* Unit / Chapter Selector */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Unit / Chapter *</span>
                      {loadingUploadUnits && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
                    </label>
                    <select
                      value={targetUnitId}
                      onChange={(e) => handleUnitChangeInModal(e.target.value)}
                      disabled={targetActId === "__new_act__"}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {uploadUnitsList.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.title}
                        </option>
                      ))}
                      <option value="__new_unit__">+ New Unit / Chapter...</option>
                    </select>
                  </div>
                </div>

                {/* Inline Creation Inputs if needed */}
                {(creatingActInline || creatingUnitInline) && (
                  <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {creatingActInline && (
                      <div>
                        <label className="block font-semibold text-emerald-800 mb-1">
                          New Act Name <span className="text-slate-400 font-normal">(Auto-creates)</span>
                        </label>
                        <input
                          type="text"
                          value={inlineActName}
                          onChange={(e) => setInlineActName(e.target.value)}
                          placeholder="e.g. Indian Contract Act, 1872"
                          className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    )}
                    {creatingUnitInline && (
                      <div>
                        <label className="block font-semibold text-emerald-800 mb-1">
                          New Chapter Name <span className="text-slate-400 font-normal">(Auto-creates)</span>
                        </label>
                        <input
                          type="text"
                          value={inlineUnitName}
                          onChange={(e) => setInlineUnitName(e.target.value)}
                          placeholder="e.g. Unit 1: Nature of Contracts"
                          className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 2: PDF UPLOAD ZONE */}
              <div>
                <input
                  type="file"
                  ref={simplifiedFileInputRef}
                  accept="application/pdf"
                  onChange={handleSimplifiedPdfSelected}
                  className="hidden"
                />

                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 mb-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-black">2</span>
                  Select &amp; Upload PDF File *
                </span>

                {pdfUploadProgress ? (
                  <div className="border border-emerald-200 bg-emerald-50/60 rounded-2xl p-6 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                    <div>
                      <p className="font-bold text-slate-800">Uploading &amp; Securing PDF...</p>
                      <p className="text-[11px] text-slate-500">Storing on secure cloud storage with DRM protection.</p>
                    </div>
                  </div>
                ) : pdfUploadedPublicId ? (
                  <div className="border border-emerald-200 bg-emerald-50/80 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 truncate">{pdfUploadedFileName || "Document.pdf"}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-900">
                            <Check className="w-3 h-3" /> Ready
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {pdfUploadedFileSize ? `${(pdfUploadedFileSize / (1024 * 1024)).toFixed(2)} MB` : "PDF file ready"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => simplifiedFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors cursor-pointer shrink-0"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => simplifiedFileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-emerald-200/80 text-emerald-600 group-hover:scale-105 transition-transform flex items-center justify-center mx-auto mb-2.5">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm">
                      Click here to choose PDF file or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Accepts standard PDF documents. Title and file details will auto-fill automatically.
                    </p>
                  </div>
                )}
              </div>

              {/* STEP 3: DOCUMENT METADATA */}
              <div className="space-y-3 pt-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-black">3</span>
                  Document Details &amp; Settings
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                    <input
                      type="text"
                      value={pdfTitle}
                      onChange={(e) => setPdfTitle(e.target.value)}
                      placeholder="e.g. Chapter 1: Comprehensive Study Notes &amp; Analysis"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Material Type</label>
                    <select
                      value={pdfContentType}
                      onChange={(e) => setPdfContentType(e.target.value as ContentItemRecord["type"])}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    >
                      <option value="notes">📘 Study Notes</option>
                      <option value="flowcharts">📊 Flowcharts / Mindmaps</option>
                      <option value="practice">📝 Practice Questions</option>
                      <option value="case_problems">⚖️ Case Study &amp; Precedents</option>
                      <option value="pyqs">🏛️ Previous Year Questions (PYQs)</option>
                      <option value="revision">⚡ Rapid Revision</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                  <textarea
                    rows={2}
                    value={pdfDescription}
                    onChange={(e) => setPdfDescription(e.target.value)}
                    placeholder="Short summary, covered ICAI sections, or chapter keywords..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Free Sample & Publish Options */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pdfIsSample}
                      onChange={(e) => setPdfIsSample(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <div>
                      <span className="font-semibold text-slate-800">Allow Free Sample Preview</span>
                      <p className="text-[10px] text-slate-500">Unregistered visitors can preview selected pages.</p>
                    </div>
                  </label>

                  {pdfIsSample && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-600 text-[11px]">Pages:</span>
                      <input
                        type="text"
                        value={pdfSamplePages}
                        onChange={(e) => setPdfSamplePages(e.target.value)}
                        placeholder="1-5"
                        className="w-16 p-1.5 rounded-lg border border-slate-300 bg-white text-center font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={pdfIsPublished}
                      onChange={(e) => setPdfIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span className="font-semibold text-slate-800">Publish Immediately</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. PINNED FOOTER - Always visible at bottom, never cut off */}
            <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSimplifiedUploadOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pdfSaving || pdfUploadProgress || (!pdfUploadedPublicId && !pdfUploadFile) || !pdfTitle.trim()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-bold flex items-center gap-2 shadow-md hover:shadow transition-all cursor-pointer"
              >
                {pdfSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing PDF...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload &amp; Publish PDF</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </div>
  );
}
