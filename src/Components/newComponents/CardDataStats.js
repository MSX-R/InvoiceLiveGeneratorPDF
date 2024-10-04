import React from "react";

const CardDataStats = ({ title, total, rate, levelUp, levelDown, icon, Percentage }) => {
  return (
    <div className="border        shadow-md p-6 bg-white dark:bg-gray-800 dark:border-gray-700 w-60">
      {/* Icon Section */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-600">{icon}</div>

      {/* Stat Section */}
      <div className="mt-4 flex justify-between items-end">
        <div>
          <h4 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{total}</h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        </div>

        <span className={`flex items-center gap-1 text-base font-medium ${levelUp ? "text-green-500" : levelDown ? "text-red-500" : "text-gray-500"}`}>
          {rate > 0 ? "+" : rate === 0 } {rate !== 0 ? rate : "="} {Percentage && "%"}
          {levelUp && rate > 0 && (
            <svg className="w-4 h-4 fill-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 11">
              <path d="M4.357 2.477L.909 5.83 0 4.946 5 .085l5 4.861-1.909.883L5.643 2.477v7.608H4.357V2.477z" />
            </svg>
          )}
          {levelDown && rate < 0 && (
            <svg className="w-4 h-4 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 11">
              <path d="M5.643 7.692l3.448-3.352L10 5.224l-5 4.861L0 5.224l.909-.884L4.357 7.692V.085h1.286v7.608z" />
            </svg>
          )}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
