import React from "react";

export default function Loader({ fullScreen = true }) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "h-full"}`}
    >
      <div className="w-8 h-8 border-4 border-[#1f7af9] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
