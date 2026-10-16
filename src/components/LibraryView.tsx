import React, { useState } from 'react';
import { WORK_ITEMS } from '../data/mockData';
import { WorkItem } from '../types';
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  TrendingUp, 
  BarChart3, 
  Filter, 
  ArrowUpRight, 
  Sparkles,
  Link2,
  Calendar,
  Layers
} from 'lucide-react';

interface LibraryViewProps {
  onSelectWorkForCreative?: (work: WorkItem) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  onSelectWorkForCreative,
  onNavigateToTab,
}) => {
  const [selectedWork, setSelectedWork] = useState<WorkItem>(WORK_ITEMS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: '全部作品 (24)' },
    { id: '工具工作流', label: '工具工作流 (9)' },
    { id: '深度拆解', label: '深度拆解 (8)' },
    { id: '知识管理', label: '知识管理 (4)' },
    { id: '独立开发', label: '独立开发 (3)' },
  ];

  const filteredWorks = activeFilter === 'all'
    ? WORK_ITEMS
    : WORK_ITEMS.filter((w) => w.category === activeFilter);

  return (
    <div className="w-full min-h-[calc(100vh-65px)] px-8 py-6 flex flex-col justify-between">
      {/* Top Header & Stats (Exact replica of frame 0:17 - 0:18) */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neuro-flat-sm border border-white/70 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#ea384c]" />
          <span className="text-[11px] font-bold tracking-wider text-[#495467] uppercase">
            LIBRARY · 作品库
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#191f2c] tracking-tight">
          每一篇，都留下回响。
        </h1>
        <p className="text-xs text-[#8a98ab] font-medium tracking-wide mt-1 font-mono">
          Every piece resonates — echo in stats and echo in mind.
        </p>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="neuro-flat rounded-2xl p-4 border border-white/80">
            <p className="text-[11px] font-bold text-[#8492a5] uppercase tracking-wider">总作品数</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#191f2c]">24</span>
              <span className="text-xs text-emerald-600 font-bold">+2 本月</span>
            </div>
          </div>
          <div className="neuro-flat rounded-2xl p-4 border border-white/80">
            <p className="text-[11px] font-bold text-[#8492a5] uppercase tracking-wider">衍生灵感</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#ea384c]">207</span>
              <span className="text-xs text-emerald-600 font-bold">+18 新增</span>
            </div>
          </div>
          <div className="neuro-flat rounded-2xl p-4 border border-white/80">
            <p className="text-[11px] font-bold text-[#8492a5] uppercase tracking-wider">总阅读与播放</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#191f2c]">173,787</span>
              <span className="text-xs text-emerald-600 font-bold">+14.2%</span>
            </div>
          </div>
          <div className="neuro-flat rounded-2xl p-4 border border-white/80">
            <p className="text-[11px] font-bold text-[#8492a5] uppercase tracking-wider">互动与讨论</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#191f2c]">1,099</span>
              <span className="text-xs text-red-500 font-bold">高活跃</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Cards Grid on Left + Selected Work Detail on Right */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start">
        {/* Left: Filter Pills + Grid */}
        <div className="flex-1 space-y-4 w-full">
          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === cat.id
                    ? 'neuro-btn-active text-[#191f2c] font-bold border border-white/90'
                    : 'neuro-btn text-[#6b788c] hover:text-[#191f2c]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWorks.map((work) => {
              const isSelected = selectedWork.id === work.id;
              return (
                <div
                  key={work.id}
                  onClick={() => setSelectedWork(work)}
                  className={`group neuro-flat rounded-3xl p-4 border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-[#ea384c] shadow-lg ring-2 ring-red-100'
                      : 'border-white/80 hover:border-gray-300 hover:scale-[1.01]'
                  }`}
                >
                  {/* Thumbnail Banner */}
                  <div className="relative rounded-2xl overflow-hidden neuro-inset p-1 mb-3">
                    <img
                      src={work.cover}
                      alt={work.title}
                      className="w-full h-40 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                      {work.category}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-white/90">
                      {work.publishDate}
                    </span>
                  </div>

                  {/* Title & Info */}
                  <h3 className="text-sm font-bold text-[#191f2c] line-clamp-2 leading-snug group-hover:text-[#ea384c] transition-colors">
                    {work.title}
                  </h3>
                  <p className="text-xs text-[#707d90] mt-1.5 line-clamp-2 leading-relaxed">
                    {work.summary}
                  </p>

                  {/* Card Bottom Meta */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200/60 text-xs text-[#7d8b9e]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-[#323a49]">
                        <Eye className="w-3.5 h-3.5 text-[#ea384c]" />
                        {work.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-400" />
                        {work.likes}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-medium text-[#ea384c]">
                      <Link2 className="w-3 h-3" />
                      <span>{work.linksCount} 衍生</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel (Frame 0:17 - 0:18) */}
        <div className="w-full lg:w-[380px] neuro-flat rounded-3xl p-5 border border-white/80 space-y-4 shrink-0 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
            <span className="text-xs font-bold text-[#3d4655]">作品深度分析看板</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#ea384c] font-bold">
              {selectedWork.category}
            </span>
          </div>

          <div>
            <div className="rounded-2xl overflow-hidden neuro-inset p-1 mb-3">
              <img
                src={selectedWork.cover}
                alt={selectedWork.title}
                className="w-full h-36 object-cover rounded-xl"
              />
            </div>
            <h3 className="text-base font-bold text-[#191f2c] leading-snug">
              {selectedWork.title}
            </h3>
            <p className="text-xs text-[#758296] mt-1">
              发布于 {selectedWork.publishDate}
            </p>
          </div>

          {/* Big Stat: 4.2% / 2.0% */}
          <div className="neuro-inset rounded-2xl p-4">
            <p className="text-[10px] font-bold text-[#8d9baa] uppercase tracking-wider">综合互动回报率</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black text-[#ea384c]">
                {selectedWork.interactionRate}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                超越基准
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200/70">
              <div className="p-2 rounded-xl bg-white/60">
                <span className="text-[10px] text-[#8694a7] block">收藏转存</span>
                <span className="text-sm font-extrabold text-[#191f2c]">{selectedWork.bookmarks}</span>
              </div>
              <div className="p-2 rounded-xl bg-white/60">
                <span className="text-[10px] text-[#8694a7] block">评论条数</span>
                <span className="text-sm font-extrabold text-[#191f2c]">{selectedWork.comments}</span>
              </div>
            </div>
          </div>

          {/* Platform Distribution Bar */}
          <div className="neuro-flat-sm rounded-2xl p-3.5 space-y-2">
            <span className="text-xs font-bold text-[#353e4d] block">全网分发渠道占比</span>
            <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden flex">
              <div style={{ width: '55%' }} className="bg-[#00aeec]" title="Bilibili 55%" />
              <div style={{ width: '25%' }} className="bg-[#07c160]" title="微信公众号 25%" />
              <div style={{ width: '20%' }} className="bg-[#ff2442]" title="小红书 20%" />
            </div>
            <div className="flex justify-between text-[10px] text-[#6e7b8f] pt-1 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00aeec]" /> Bilibili (55%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#07c160]" /> 微信 (25%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ff2442]" /> 小红书 (20%)
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                if (onSelectWorkForCreative) onSelectWorkForCreative(selectedWork);
                if (onNavigateToTab) onNavigateToTab('creative');
              }}
              className="w-full neuro-btn-red py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>以此作品在创作舱写下一篇</span>
            </button>
            <button
              onClick={() => {
                if (onNavigateToTab) onNavigateToTab('workbench');
              }}
              className="w-full neuro-btn py-2 rounded-2xl text-xs font-semibold text-[#546276] hover:text-[#191f2c] flex items-center justify-center gap-1"
            >
              <Link2 className="w-3.5 h-3.5 text-[#ea384c]" />
              <span>在神经脑图中定位此节点</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
