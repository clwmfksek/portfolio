"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Diary {
  id: string;
  title: string;
  created_at: string;
}

export default function DiaryPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    fetchDiaries();
  }, []);

  async function fetchDiaries() {
    const { data } = await supabase
      .from("diary")
      .select("id, title, created_at")
      .order("created_at", { ascending: false });
    setDiaries(data || []);
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">일기/블로그</h1>
      <ul className="space-y-4">
        {diaries.map((d) => (
          <li key={d.id} className="card p-4 flex flex-col gap-1">
            <Link
              href={`/diary/${d.id}`}
              className="font-semibold text-lg text-[var(--primary)] hover:underline"
            >
              {d.title}
            </Link>
            <span className="text-xs text-gray-400">
              {new Date(d.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
