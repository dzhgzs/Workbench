import React, { useState } from 'react';
import { IDEA_ITEMS } from '../data/mockData';
import { IdeaItem } from '../types';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  Check, 
  Lightbulb, 
  Layers, 
  Link2,
  Trash2,
  MoveRight
} from 'lucide-react';

interface InspirationViewProps {
  onNavigateToCreative?: () => void;
}

export const InspirationView: React.FC<InspirationViewProps> = ({ onNavigateToCreative }) => {
  const [ideas, setIdeas] = useState<IdeaItem[]>(IDEA_ITEMS);
  const [search, setSearch] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('闪念碎片');
  const [activeColumnForNew, setActiveColumnForNew] = useState<'inbox' | 'thinking' | 'ready' | null>(null);

  const columns: { id: 'inbox' | 'thinking' | 'ready'; titleZh: string; titleEn: string; color: string }[] = [
    { id: 'inbox', titleZh: '闪念捕捉', titleEn: 'INBOX & RAW NOTES', color: '#ea384c' },
    { id: 'thinking', titleZh: '深度酝酿', titleEn: 'DEEP THINKING & REFINING', color: '#8b5cf6' },
    { id: 'ready', titleZh: '排期就绪', titleEn: 'READY FOR PRODUCTION', color: '#10b981' },
  ];

  const handleAddIdea = (colId: 'inbox' | 'thinking' | 'ready') => {
    if (!newTitle.trim()) return;
    const newCard: IdeaItem = {
      id: `idea-${Date.now()}`,
      title: newTitle,
      content: newContent || '暂无详细描述',
      column: colId,
      tag: newTag,
      tagColor: colId === 'inbox' ? '#ea384c' : colId === 'thinking' ? '#8b5cf6' : '#10b981',
      date: '刚刚',
    };
    setIdeas([newCard, ...ideas]);
    setNewTitle('');
    setNewContent('');
    setActiveColumnForNew(null);
  };

  const moveColumn = (id: string, nextCol: 'inbox' | 'thinking' | 'ready') => {
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, column: nextCol } : item))
    );
  };

  const filteredIdeas = ideas.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      item.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-[calc(100vh-65px)] px-8 py-6 flex flex-col justify-between">
      {/* Top Header (Frame 0:23 - 0:24) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neuro-flat-sm border border-white/70 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#ea384c]" />
            <span className="text-[11px] font-bold tracking-wider text-[#495467] uppercase">
              IDEAS · 灵感池
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#191f2c] tracking-tight">
            下一篇，从这里开始。
          </h1>
          <p className="text-xs text-[#8a98ab] font-medium tracking-wide mt-1 font-mono">
            Ideas travel to what you have already published.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索灵感卡片与标签..."
              className="w-full neuro-inset text-xs px-4 py-2 rounded-full border border-white/80 focus:outline-none focus:ring-1 focus:ring-[#ea384c]"
            />
            <Search className="w-3.5 h-3.5 text-[#8896aa] absolute right-3 top-2.5" />
          </div>

          <button
            onClick={() => setActiveColumnForNew('inbox')}
            className="neuro-btn-red px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>快速记录闪念</span>
          </button>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start">
        {columns.map((col) => {
          const colIdeas = filteredIdeas.filter((item) => item.column === col.id);
          const isAddingHere = activeColumnForNew === col.id;

          return (
            <div
              key={col.id}
              className="neuro-flat rounded-3xl p-4 border border-white/80 flex flex-col min-h-[540px] shadow-sm"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/70">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: col.color }}
                  />
                  <h3 className="text-sm font-bold text-[#1f2633]">{col.titleZh}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200/80 text-[#556377] font-extrabold">
                    {colIdeas.length}
                  </span>
                </div>

                <button
                  onClick={() => setActiveColumnForNew(col.id)}
                  className="w-6 h-6 rounded-lg neuro-btn flex items-center justify-center text-[#556377] hover:text-[#ea384c]"
                  title="添加卡片"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Card Form inside column */}
              {isAddingHere && (
                <div className="mb-3 p-3 rounded-2xl neuro-inset space-y-2 animate-in fade-in">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="输入卡片标题..."
                    className="w-full bg-white text-xs px-3 py-1.5 rounded-xl border border-gray-200 focus:outline-none"
                    autoFocus
                  />
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="简述灵感、来源或关键论点..."
                    className="w-full bg-white text-xs px-3 py-1.5 rounded-xl border border-gray-200 focus:outline-none resize-none h-16"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="标签分类"
                      className="bg-white text-[11px] px-2 py-1 rounded-lg border border-gray-200 w-24"
                    />
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveColumnForNew(null)}
                        className="text-[11px] px-2.5 py-1 text-[#728094] hover:text-black"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleAddIdea(col.id)}
                        className="neuro-btn-red text-[11px] px-3 py-1 rounded-lg font-bold"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colIdeas.map((card) => (
                  <div
                    key={card.id}
                    className="group neuro-flat-sm rounded-2xl p-3.5 border border-white/80 hover:border-gray-300 transition-all hover:scale-[1.01] space-y-2 cursor-pointer"
                  >
                    {/* Tag & Date */}
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${card.tagColor}15`,
                          color: card.tagColor,
                        }}
                      >
                        {card.tag}
                      </span>
                      <span className="text-[10px] text-[#8e9caf]">{card.date}</span>
                    </div>

                    {/* Title & Body */}
                    <h4 className="text-xs font-bold text-[#1f2633] leading-snug group-hover:text-[#ea384c] transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-[11px] text-[#637286] leading-relaxed line-clamp-3">
                      {card.content}
                    </p>

                    {/* Associated Work or URL */}
                    {card.linkedWorkTitle && (
                      <div className="flex items-center gap-1 text-[10px] text-[#ea384c] bg-red-50/70 p-1.5 rounded-lg border border-red-100">
                        <Link2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">关联作品：{card.linkedWorkTitle}</span>
                      </div>
                    )}

                    {/* Quick Move Footer */}
                    <div className="pt-2 border-t border-gray-200/50 flex items-center justify-between text-[10px] text-[#78879b]">
                      <span className="hover:text-[#ea384c]" onClick={onNavigateToCreative}>
                        去写作 ✍️
                      </span>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {col.id !== 'inbox' && (
                          <button
                            onClick={() => moveColumn(card.id, 'inbox')}
                            className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200"
                            title="移至闪念"
                          >
                            ← 闪念
                          </button>
                        )}
                        {col.id !== 'thinking' && (
                          <button
                            onClick={() => moveColumn(card.id, 'thinking')}
                            className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200"
                            title="移至思考"
                          >
                            酝酿
                          </button>
                        )}
                        {col.id !== 'ready' && (
                          <button
                            onClick={() => moveColumn(card.id, 'ready')}
                            className="px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200"
                            title="移至就绪"
                          >
                            就绪 →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
