import React from 'react';
import { TabType } from '../types';
import { 
  Plus, 
  Globe, 
  GitFork, 
  Network, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenNewModal: () => void;
  workbenchMode: 'orbital' | 'mindmap';
  onToggleWorkbenchMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenNewModal,
  workbenchMode,
  onToggleWorkbenchMode,
}) => {
  const tabs: { id: TabType; labelZh: string; labelEn: string }[] = [
    { id: 'workbench', labelZh: '工作台', labelEn: 'WORKBENCH' },
    { id: 'library', labelZh: '作品库', labelEn: 'LIBRARY' },
    { id: 'creative', labelZh: '创作舱', labelEn: 'CREATIVE' },
    { id: 'inspiration', labelZh: '灵感池', labelEn: 'INSPIRATION' },
    { id: 'calendar', labelZh: '日历', labelEn: 'CALENDAR' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-6 py-3.5 bg-[#ebedf2]/90 backdrop-blur-md border-b border-white/60 flex items-center justify-between">
      {/* Brand Left */}
      <div 
        onClick={() => onTabChange('workbench')}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl neuro-flat-sm flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#d92d20] to-[#f04438] shadow-[0_0_10px_#ea384c]" />
          <div className="absolute inset-0 border border-white/80 rounded-xl" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-extrabold text-[15px] tracking-tight text-[#1b202a]">KUAN</span>
            <span className="text-[12px] font-bold text-[#ea384c] tracking-widest">/ NEURAL</span>
          </div>
          <p className="text-[10px] text-[#8c97a8] font-medium tracking-wide mt-0.5">
            创作者大脑 · AI 神经中枢
          </p>
        </div>
      </div>

      {/* Center Navigation Pills */}
      <nav className="neuro-flat rounded-full p-1.5 flex items-center gap-1 border border-white/70">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isActive
                  ? 'neuro-btn-active text-[#1b202a] shadow-inner font-bold'
                  : 'text-[#697587] hover:text-[#1b202a] hover:bg-white/40'
              }`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea384c] shadow-[0_0_6px_#ea384c] animate-pulse" />
              )}
              <span>{tab.labelZh}</span>
              <span className={`text-[9px] uppercase tracking-wider ${isActive ? 'text-[#ea384c] font-bold' : 'text-[#9ca8b9]'}`}>
                {tab.labelEn}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Toggle between Orbital and Mindmap in Workbench */}
        {currentTab === 'workbench' && (
          <button
            onClick={onToggleWorkbenchMode}
            className="neuro-btn px-3 py-1.5 rounded-full text-xs font-medium text-[#4b5565] flex items-center gap-1.5 border border-white/60 hover:text-[#1b202a]"
            title="切换星系视界 / 树状脑图"
          >
            {workbenchMode === 'orbital' ? (
              <>
                <GitFork className="w-3.5 h-3.5 text-[#ea384c]" />
                <span>展开脑图</span>
              </>
            ) : (
              <>
                <Network className="w-3.5 h-3.5 text-[#ea384c]" />
                <span>返回中枢</span>
              </>
            )}
          </button>
        )}

        {/* Language Pill */}
        <button className="neuro-btn px-3 py-1.5 rounded-full text-xs font-medium text-[#5c687a] flex items-center gap-1 border border-white/60">
          <Globe className="w-3.5 h-3.5 text-[#8895a7]" />
          <span>简体中文</span>
          <ChevronDown className="w-3 h-3 text-[#9aa7b9]" />
        </button>

        {/* Create Content Red Button */}
        <button
          onClick={onOpenNewModal}
          className="neuro-btn-red px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>新建内容</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/90 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] ring-2 ring-[#ebedf2]" />
          </div>
        </div>
      </div>
    </header>
  );
};
