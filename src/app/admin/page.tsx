"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Comment {
  id: string;
  content: string;
  user_email: string;
  created_at: string;
  post_id?: string;
}

interface AdminUser {
  id: string;
  email: string;
}

interface Diary {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [diaryForm, setDiaryForm] = useState({
    title: "",
    content: "",
    id: "",
  });
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    url: "",
    id: "",
  });
  // const router = useRouter(); // 더 이상 사용하지 않음

  useEffect(() => {
    fetchComments();
    fetchAdminUsers();
    fetchDiaries();
    fetchProjects();
  }, []);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("id, content, user_email, created_at, post_id")
      .order("created_at", { ascending: false });
    setComments(data || []);
  }

  async function fetchAdminUsers() {
    const { data } = await supabase.from("admin_users").select("id, email");
    setAdminUsers(data || []);
  }

  async function handleDeleteComment(id: string) {
    setLoading(true);
    await supabase.from("comments").delete().eq("id", id);
    setLoading(false);
    fetchComments();
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!newAdminEmail) return;
    setLoading(true);
    await supabase.from("admin_users").insert({ email: newAdminEmail });
    setNewAdminEmail("");
    setLoading(false);
    fetchAdminUsers();
  }

  async function handleDeleteAdmin(id: string) {
    setLoading(true);
    await supabase.from("admin_users").delete().eq("id", id);
    setLoading(false);
    fetchAdminUsers();
  }

  // --- Diary CRUD ---
  async function fetchDiaries() {
    const { data } = await supabase
      .from("diary")
      .select("id, title, content, created_at, updated_at")
      .order("created_at", { ascending: false });
    setDiaries(data || []);
  }
  async function handleDiarySubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (diaryForm.id) {
      // 수정
      await supabase
        .from("diary")
        .update({
          title: diaryForm.title,
          content: diaryForm.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", diaryForm.id);
    } else {
      // 생성
      await supabase.from("diary").insert({
        title: diaryForm.title,
        content: diaryForm.content,
      });
    }
    setDiaryForm({ title: "", content: "", id: "" });
    setLoading(false);
    fetchDiaries();
  }
  function handleDiaryEdit(d: Diary) {
    setDiaryForm({ title: d.title, content: d.content, id: d.id });
  }
  async function handleDiaryDelete(id: string) {
    setLoading(true);
    await supabase.from("diary").delete().eq("id", id);
    setLoading(false);
    fetchDiaries();
  }

  // --- Project CRUD ---
  async function fetchProjects() {
    const { data } = await supabase
      .from("project")
      .select("id, title, description, url, created_at, updated_at")
      .order("created_at", { ascending: false });
    setProjects(data || []);
  }
  async function handleProjectSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (projectForm.id) {
      // 수정
      await supabase
        .from("project")
        .update({
          title: projectForm.title,
          description: projectForm.description,
          url: projectForm.url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectForm.id);
    } else {
      // 생성
      await supabase.from("project").insert({
        title: projectForm.title,
        description: projectForm.description,
        url: projectForm.url,
      });
    }
    setProjectForm({ title: "", description: "", url: "", id: "" });
    setLoading(false);
    fetchProjects();
  }
  function handleProjectEdit(p: Project) {
    setProjectForm({
      title: p.title,
      description: p.description,
      url: p.url || "",
      id: p.id,
    });
  }
  async function handleProjectDelete(id: string) {
    setLoading(true);
    await supabase.from("project").delete().eq("id", id);
    setLoading(false);
    fetchProjects();
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">어드민 페이지</h1>
      {/* --- 일기 CRUD --- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">일기 관리</h2>
        <form onSubmit={handleDiarySubmit} className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            value={diaryForm.title}
            onChange={(e) =>
              setDiaryForm((f) => ({ ...f, title: e.target.value }))
            }
            placeholder="제목"
            className="px-3 py-1 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-sm"
            required
          />
          <textarea
            value={diaryForm.content}
            onChange={(e) =>
              setDiaryForm((f) => ({ ...f, content: e.target.value }))
            }
            placeholder="내용"
            className="px-3 py-2 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-sm min-h-[80px]"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn-primary text-sm"
              disabled={loading}
            >
              {diaryForm.id ? "수정" : "등록"}
            </button>
            {diaryForm.id && (
              <button
                type="button"
                className="btn-primary text-sm bg-gray-400 hover:bg-gray-500"
                onClick={() => setDiaryForm({ title: "", content: "", id: "" })}
              >
                취소
              </button>
            )}
          </div>
        </form>
        <ul className="space-y-3">
          {diaries.map((d) => (
            <li
              key={d.id}
              className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="font-semibold text-[var(--foreground)] mb-1">
                  {d.title}
                </div>
                <div className="text-sm text-gray-500 mb-1 line-clamp-2">
                  {d.content}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(d.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDiaryEdit(d)}
                  className="btn-primary text-xs"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDiaryDelete(d.id)}
                  className="btn-primary text-xs bg-red-500 hover:bg-red-600"
                  disabled={loading}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {/* --- 프로젝트 CRUD --- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">프로젝트 관리</h2>
        <form
          onSubmit={handleProjectSubmit}
          className="flex flex-col gap-2 mb-4"
        >
          <input
            type="text"
            value={projectForm.title}
            onChange={(e) =>
              setProjectForm((f) => ({ ...f, title: e.target.value }))
            }
            placeholder="프로젝트명"
            className="px-3 py-1 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-sm"
            required
          />
          <textarea
            value={projectForm.description}
            onChange={(e) =>
              setProjectForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="설명"
            className="px-3 py-2 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-sm min-h-[60px]"
            required
          />
          <input
            type="url"
            value={projectForm.url}
            onChange={(e) =>
              setProjectForm((f) => ({ ...f, url: e.target.value }))
            }
            placeholder="URL (선택)"
            className="px-3 py-1 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn-primary text-sm"
              disabled={loading}
            >
              {projectForm.id ? "수정" : "등록"}
            </button>
            {projectForm.id && (
              <button
                type="button"
                className="btn-primary text-sm bg-gray-400 hover:bg-gray-500"
                onClick={() =>
                  setProjectForm({
                    title: "",
                    description: "",
                    url: "",
                    id: "",
                  })
                }
              >
                취소
              </button>
            )}
          </div>
        </form>
        <ul className="space-y-3">
          {projects.map((p) => (
            <li
              key={p.id}
              className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="font-semibold text-[var(--foreground)] mb-1">
                  {p.title}
                </div>
                <div className="text-sm text-gray-500 mb-1 line-clamp-2">
                  {p.description}
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 underline"
                  >
                    {p.url}
                  </a>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(p.created_at).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleProjectEdit(p)}
                  className="btn-primary text-xs"
                >
                  수정
                </button>
                <button
                  onClick={() => handleProjectDelete(p.id)}
                  className="btn-primary text-xs bg-red-500 hover:bg-red-600"
                  disabled={loading}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">댓글 관리</h2>
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="text-sm text-[var(--foreground)] mb-1">
                  {c.user_email}
                </div>
                <div className="text-base">{c.content}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(c.created_at).toLocaleString()}{" "}
                  {c.post_id && (
                    <span className="ml-2 text-gray-300">
                      (게시글: {c.post_id})
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteComment(c.id)}
                className="btn-primary text-xs bg-red-500 hover:bg-red-600 mt-2 sm:mt-0"
                disabled={loading}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">어드민 유저 관리</h2>
        <form onSubmit={handleAddAdmin} className="flex gap-2 mb-4">
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="어드민 이메일 추가"
            className="px-3 py-1 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          />
          <button
            type="submit"
            className="btn-primary text-sm"
            disabled={loading || !newAdminEmail}
          >
            추가
          </button>
        </form>
        <ul className="space-y-2">
          {adminUsers.map((a) => (
            <li key={a.id} className="flex items-center gap-2">
              <span className="text-sm text-[var(--foreground)]">
                {a.email}
              </span>
              <button
                onClick={() => handleDeleteAdmin(a.id)}
                className="btn-primary text-xs bg-red-500 hover:bg-red-600"
                disabled={loading}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
