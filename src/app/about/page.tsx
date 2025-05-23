import React from "react";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        자기소개, 타임라인, 경력 등 상세 정보를 보여주는 페이지입니다.
      </p>
      <p className="text-sm text-gray-400">
        (추후 마크다운 기반 자기소개/타임라인/경력 추가 예정)
      </p>
    </div>
  );
}
