import React, { useState } from 'react';
import { X, Sparkles, Plus, FileText, Video, Lightbulb, Link2 } from 'lucide-react';

interface NewContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const NewContentModal: React.FC<NewContentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<'article' | 'video' | 'idea'>('article');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('工具工作流');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('生产力, 双向链接, AI工作流');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      type,
      title,
      category,
      summary,
      tags: tags.split(',').map((t) => t.trim()),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg neuro-flat rounded-3xl p-6 border border-white/90 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200/70">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea384c] animate-pulse" />
            <h3 className="text-sm font-bold text-[#1f2633]">新建神经知识资产</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full neuro-btn flex items-center justify-center text-[#748296] hover:text-[#1e2229]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Type Selector */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setType('article')}
            className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
              type === 'article'
                ? 'neuro-btn-active border border-[#ea384c]/50 font-bold text-[#1f2633]'
                : 'neuro-flat-sm text-[#58667a] hover:text-[#1f2633]'
            }`}
          >
            <FileText className="w-5 h-5 text-[#ea384c]" />
            <span className="text-xs">图文长文</span>
          </button>

          <button
            type="button"
            onClick={() => setType('video')}
            className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
              type === 'video'
                ? 'neuro-btn-active border border-[#ea384c]/50 font-bold text-[#1f2633]'
                : 'neuro-flat-sm text-[#58667a] hover:text-[#1f2633]'
            }`}
          >
            <Video className="w-5 h-5 text-sky-500" />
            <span className="text-xs">深度视频</span>
          </button>

          <button
            type="button"
            onClick={() => setType('idea')}
            className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
              type === 'idea'
                ? 'neuro-btn-active border border-[#ea384c]/50 font-bold text-[#1f2633]'
                : 'neuro-flat-sm text-[#58667a] hover:text-[#1f2633]'
            }`}
          >
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span className="text-xs">灵感闪念</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#606e82] font-semibold mb-1">标题 / 概念主题</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：Opus 3.5 提示词工程手册..."
              className="w-full neuro-inset px-3.5 py-2 rounded-xl text-[#1f2633] border border-white/70 focus:outline-none focus:ring-1 focus:ring-[#ea384c]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#606e82] font-semibold mb-1">分类聚类</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full neuro-inset px-3 py-2 rounded-xl text-[#1f2633] border border-white/70 focus:outline-none"
              >
                <option value="工具工作流">工具工作流</option>
                <option value="深度拆解">深度拆解</option>
                <option value="知识管理">知识管理</option>
                <option value="独立开发">独立开发</option>
                <option value="创作者心智">创作者心智</option>
              </select>
            </div>

            <div>
              <label className="block text-[#606e82] font-semibold mb-1">标签 (逗号分隔)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full neuro-inset px-3 py-2 rounded-xl text-[#1f2633] border border-white/70 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#606e82] font-semibold mb-1">核心论点与概要</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="简要概括本篇的核心洞察，系统将自动计算与现有知识库的双向匹配度..."
              className="w-full neuro-inset px-3.5 py-2 rounded-xl text-[#1f2633] border border-white/70 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl neuro-btn text-xs font-semibold text-[#5a677a]"
            >
              取消
            </button>
            <button
              type="submit"
              className="neuro-btn-red px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>建立双向神经节点</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
