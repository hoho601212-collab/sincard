'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
  onClick?: () => void;
}

export interface TabProps {
  items?: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

const defaultItems: TabItem[] = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3' },
];

export const Tab: React.FC<TabProps> = ({
  items = defaultItems,
  activeTab,
  onTabChange,
  className,
}) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(
    activeTab || items[0]?.id
  );

  const currentActiveTab = activeTab !== undefined ? activeTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (activeTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        'bg-white rounded-[10px]',
        'border-[1.5px] border-[#E0E0E0]',
        'p-2',
        className
      )}
    >
      {items.map((item) => {
        const isActive = currentActiveTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              item.onClick?.();
              handleTabClick(item.id);
            }}
            className={cn(
              'flex-1',
              'rounded-[8px]',
              'px-6 py-3',
              'text-[18px] font-semibold leading-[1.3] tracking-[-0.45px]',
              'transition-all',
              isActive
                ? 'bg-[#0565FF] text-white'
                : 'bg-transparent text-[#9E9E9E] hover:bg-[#F5F5F5] hover:text-[#212121]'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
