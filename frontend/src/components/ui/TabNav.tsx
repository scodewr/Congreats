import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabNavProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
}

export default function TabNav({ tabs, defaultTab, className }: TabNavProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab ?? tabs[0]?.id ?? ''
  );

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      <div className="bg-elevated rounded-2xl p-1 flex gap-1 flex-wrap">
        {tabs.map((tab) =>
          tab.id === activeTab ? (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="bg-purple-900 text-purple-300 border border-purple-700 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2"
            >
              {tab.icon}
              {tab.label}
            </button>
          ) : (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="text-text-secondary hover:text-text-primary px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-150 cursor-pointer flex items-center gap-2"
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        )}
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
