"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  created_at: string;
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase
      .from("project")
      .select("id, title, description, url, created_at")
      .order("created_at", { ascending: false });
    setProjects(data || []);
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-4">프로젝트</h1>
      <ul className="space-y-4">
        {projects.map((p) => (
          <li key={p.id} className="card p-4 flex flex-col gap-1">
            <Link
              href={`/project/${p.id}`}
              className="font-semibold text-lg text-[var(--primary)] hover:underline"
            >
              {p.title}
            </Link>
            <div className="text-sm text-gray-500 line-clamp-2 mb-1">
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
            <span className="text-xs text-gray-400">
              {new Date(p.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
