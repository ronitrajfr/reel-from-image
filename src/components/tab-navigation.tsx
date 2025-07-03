"use client";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "content", label: "content" },
    { id: "music", label: "music & sfx" },
  ];

  return (
    <div className="flex w-fit space-x-1 rounded-lg bg-gray-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
