import React from "react";

export const ArrowDown: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center justify-center w-full h-full ${className}`}>
    <svg
      className="w-7 h-7 md:w-8 md:h-8 text-neutral-700"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3L12 21M12 21L5 14M12 21L19 14"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
); 