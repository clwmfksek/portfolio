"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage("로그인 메일 전송 실패: " + error.message);
    } else {
      setMessage("로그인 메일이 전송되었습니다. 메일함을 확인하세요.");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--foreground)]">{user.email}</span>
        <button onClick={handleLogout} className="btn-primary text-sm">
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin} className="flex items-center gap-2">
      <input
        type="email"
        required
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-3 py-1 rounded border border-[var(--card-border)] bg-[var(--card-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      />
      <button type="submit" className="btn-primary text-sm" disabled={loading}>
        {loading ? "전송 중..." : "로그인"}
      </button>
      {message && (
        <span className="text-xs text-[var(--primary)] ml-2">{message}</span>
      )}
    </form>
  );
}
