"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface Comment {
  id: string;
  content: string;
  user_email: string;
  created_at: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function fetchComments() {
    const { data } = await supabase
      .from("comments")
      .select("id, content, user_email, created_at")
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
    });
    setContent("");
    setLoading(false);
    fetchComments();
  }

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">댓글</h1>
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
