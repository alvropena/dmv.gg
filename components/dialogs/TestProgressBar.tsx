"use client";

// Arrow SVG component
function ArrowStepSvg() {
  return (
    <svg
      width="20"
      height="10"
      viewBox="0 0 20 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-1"
    >
      <path
        d="M1 5H19M19 5L15 2M19 5L15 8"
        stroke="#2563eb"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface TestProgressBarProps {
  currentStep: number;
}

export function TestProgressBar({ currentStep }: TestProgressBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'} flex items-center justify-center font-bold border-2 ${currentStep >= 1 ? 'border-blue-600' : 'border-gray-200'}`}>
            1
          </div>
          <span className={`text-xs mt-1 ${currentStep >= 1 ? 'font-semibold text-blue-700' : 'text-gray-500'} text-center leading-tight min-h-[2.2em]`}>
            Take Free
            <br />
            Test
          </span>
        </div>
        <ArrowStepSvg />
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'} flex items-center justify-center font-bold border-2 ${currentStep >= 2 ? 'border-blue-600' : 'border-gray-200'}`}>
            2
          </div>
          <span className={`text-xs mt-1 ${currentStep >= 2 ? 'font-semibold text-blue-700' : 'text-gray-500'} text-center leading-tight min-h-[2.2em]`}>
            See Weak
            <br />
            Areas
          </span>
        </div>
        <ArrowStepSvg />
        <div className="flex-1 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'} flex items-center justify-center font-bold border-2 ${currentStep >= 3 ? 'border-blue-600' : 'border-gray-200'}`}>
            3
          </div>
          <span className={`text-xs mt-1 ${currentStep >= 3 ? 'font-semibold text-blue-700' : 'text-gray-500'} text-center leading-tight min-h-[2.2em]`}>
            Unlock All
            <br />
            Tests
          </span>
        </div>
      </div>
    </div>
  );
} 