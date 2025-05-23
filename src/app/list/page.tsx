import React from "react";

export default function ListPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
      <h1 className="text-2xl font-bold mb-4">목록(이웃)</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        이웃 페이지로 리다이렉트되는 페이지입니다.
      </p>
      <p className="text-sm text-gray-400">
        (추후 이웃 페이지 리다이렉트 기능 추가 예정)
      </p>
    </div>
  );
}
