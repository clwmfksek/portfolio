"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  user_email: string;
  created_at: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      await fetchProject();
      await fetchComments();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchAll();
  }, [id]);

  async function fetchProject() {
    const { data } = await supabase
      .from("project")
      .select("id, title, description, url, created_at")
      .eq("id", id)
      .single();
    setProject(data);
  }

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("id, content, user_email, created_at")
      .eq("post_id", id)
      .order("created_at", { ascending: false });
    setComments(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await supabase.from("comments").insert({
      content,
      user_email: user.email,
      post_id: id,
    });
    setContent("");
    setLoading(false);
    fetchComments();
  }

  if (!project) return <div className="max-w-xl mx-auto py-12">로딩 중...</div>;

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
      <div className="text-gray-500 mb-2 whitespace-pre-line">
        {project.description}
      </div>
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 underline mb-2 block"
        >
          {project.url}
        </a>
      )}
      <div className="text-xs text-gray-400 mb-8">
        {new Date(project.created_at).toLocaleString()}
      </div>
      <h2 className="text-xl font-bold mb-4">댓글</h2>
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="댓글을 입력하세요"
            className="flex-1 px-3 py-2 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <button
            type="submit"
            className="btn-primary text-sm"
            disabled={loading || !content}
          >
            {loading ? "작성 중..." : "작성"}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-gray-500">
          로그인 후 댓글을 작성할 수 있습니다.
        </p>
      )}
      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c.id} className="card p-4">
            <div className="text-sm text-[var(--foreground)] mb-1">
              {c.user_email}
            </div>
            <div className="text-base">{c.content}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(c.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
