import React, { useState } from 'react';
import { WorkItem } from '../types';
import { 
  X, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  Send, 
  Eye, 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Link2, 
  BarChart2, 
  CheckCircle2,
  TrendingUp,
  FileText,
  Maximize2,
  BookOpen
} from 'lucide-react';

interface NodeInspectorDrawerProps {
  work: WorkItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCreative?: (work: WorkItem) => void;
  onOpenImmersiveReader?: (work: WorkItem) => void;
}

export const NodeInspectorDrawer: React.FC<NodeInspectorDrawerProps> = ({
  work,
  isOpen,
  onClose,
  onNavigateToCreative,
  onOpenImmersiveReader,
}) => {
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: '你好！我是该节点的神经助理。本篇在「AI工作流」与「生产力」维度建立了 6 条双链，想了解更多衍生思考或受众画像吗？',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen || !work) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = { sender: 'user' as const, text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      if (text.includes('衍生') || text.includes('下一篇')) {
        reply = `基于《${work.title}》的高互动标签，推荐衍生选题：【Opus 3.5 自动化流水线：让脚本代替人工分发】，已有 2 张灵感卡片支持此方向。`;
      } else if (text.includes('数据') || text.includes('分析')) {
        reply = `本篇完播率达 ${work.completionRate || '21%'}，高于同类长文 84%。B站受众对第 4 分钟的「工作流架构图」停留时间最长，建议作为未来固定结构。`;
      } else {
        reply = `已为该节点检索到 4 篇相关前向引用与 2 篇衍生讨论。需要将其插入到创作舱作为当前写作参考吗？`;
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <aside className="fixed top-[65px] right-4 bottom-4 w-[390px] z-50 neuro-flat rounded-3xl p-5 border border-white/80 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
          <span className="text-xs font-bold text-[#444e60] tracking-wide">节点数据中枢</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
            已发布
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {onOpenImmersiveReader && (
            <button
              onClick={() => onOpenImmersiveReader(work)}
              className="px-2.5 py-1 rounded-xl neuro-btn text-[11px] font-bold text-[#ea384c] flex items-center gap-1 hover:bg-red-50 shadow-sm"
              title="全屏沉浸式阅读详细笔记"
            >
              <Maximize2 className="w-3 h-3" />
              <span>全屏沉浸</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full neuro-btn flex items-center justify-center text-[#748296] hover:text-[#1e2229]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4">
        {/* Title & Preview Image */}
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-3 neuro-inset p-1">
            <img
              src={work.cover}
              alt={work.title}
              className="w-full h-36 object-cover rounded-xl"
            />
            <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white">
              {work.category}
            </span>
            <span className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-white/80">
              {work.publishDate}
            </span>
          </div>

          <h2 className="text-base font-bold text-[#1b202a] leading-snug">
            {work.title}
          </h2>
          <p className="text-xs text-[#6e7b8f] mt-1.5 line-clamp-2 leading-relaxed">
            {work.summary}
          </p>
        </div>

        {/* Big Key Metrics (Exact 2.0% style from video) */}
        <div className="neuro-inset rounded-2xl p-3.5">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-[#8e9caf] uppercase tracking-wider">综合互动率</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-extrabold text-[#ea384c] tracking-tight">
                  {work.interactionRate}
                </span>
                <span className="text-xs text-emerald-600 font-bold flex items-center">
                  <TrendingUp className="w-3 h-3 inline mr-0.5" />+0.4%
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-[#ea384c] border border-red-200/70 font-semibold">
                S级资产
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60">
            <div className="p-2 rounded-xl bg-white/50 border border-white/60">
              <div className="flex items-center gap-1.5 text-[10px] text-[#717e91] font-medium">
                <Eye className="w-3 h-3 text-[#ea384c]" />
                <span>总阅读/播放</span>
              </div>
              <p className="text-sm font-extrabold text-[#1f2633] mt-0.5">
                {work.views.toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/50 border border-white/60">
              <div className="flex items-center gap-1.5 text-[10px] text-[#717e91] font-medium">
                <Heart className="w-3 h-3 text-[#ea384c]" />
                <span>点赞收藏</span>
              </div>
              <p className="text-sm font-extrabold text-[#1f2633] mt-0.5">
                {work.likes.toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/50 border border-white/60">
              <div className="flex items-center gap-1.5 text-[10px] text-[#717e91] font-medium">
                <MessageSquare className="w-3 h-3 text-sky-500" />
                <span>评论讨论</span>
              </div>
              <p className="text-sm font-extrabold text-[#1f2633] mt-0.5">
                {work.comments.toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-xl bg-white/50 border border-white/60">
              <div className="flex items-center gap-1.5 text-[10px] text-[#717e91] font-medium">
                <Bookmark className="w-3 h-3 text-amber-500" />
                <span>收藏留存</span>
              </div>
              <p className="text-sm font-extrabold text-[#1f2633] mt-0.5">
                {work.bookmarks.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Performance Bars (from video frame 0:15) */}
        <div className="neuro-flat-sm rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#353d4c]">
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-[#ea384c]" />
              质量指标细分
            </span>
            <span className="text-[10px] text-[#8e9caf] font-normal">超越同行 89%</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1 text-[#647184]">
                <span>完播率 (Completion)</span>
                <span className="font-bold text-[#1f2633]">{work.completionRate || '18.2%'}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#ea384c] to-[#ff6b6b]" style={{ width: work.completionRate || '18.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 text-[#647184]">
                <span>分享扩散率 (Share Rate)</span>
                <span className="font-bold text-[#1f2633]">4.8%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500" style={{ width: '48%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 text-[#647184]">
                <span>粉丝转化 (Followers Gain)</span>
                <span className="font-bold text-[#1f2633]">+820</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bidirectional Links List */}
        <div className="neuro-flat-sm rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#353d4c]">
            <span className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#ea384c]" />
              双向神经网络连接
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#ea384c] font-bold">
              {work.linksCount + work.backlinksCount} 条关联
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="p-2 rounded-xl bg-white/60 hover:bg-white text-xs border border-white flex items-center justify-between cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea384c]" />
                <span className="text-[#333d4e] font-medium truncate max-w-[210px]">
                  Obsidian + Cursor 全流程打造第二大脑
                </span>
              </div>
              <span className="text-[10px] text-[#93a0b3]">前向引用</span>
            </div>

            <div className="p-2 rounded-xl bg-white/60 hover:bg-white text-xs border border-white flex items-center justify-between cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span className="text-[#333d4e] font-medium truncate max-w-[210px]">
                  卡片盒笔记法实践：输入到输出闭环
                </span>
              </div>
              <span className="text-[10px] text-[#93a0b3]">双向反链</span>
            </div>
          </div>
        </div>

        {/* AI Assistant Chat inside Node */}
        <div className="neuro-inset rounded-2xl p-3 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2d3543]">
            <Sparkles className="w-3.5 h-3.5 text-[#ea384c]" />
            <span>智能节点助理 · Ask this node</span>
          </div>

          {/* Chat transcript */}
          <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-[#ea384c] text-white ml-6 text-right'
                    : 'bg-white/80 text-[#303846] mr-4 shadow-sm border border-white'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="bg-white/80 text-[#8896a8] p-2 rounded-xl text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea384c] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea384c] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea384c] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Quick Action Chips */}
          <div className="flex flex-wrap gap-1 pt-1">
            <button
              onClick={() => handleSendMessage('分析受众与完播数据')}
              className="px-2 py-0.5 rounded-lg bg-white/70 hover:bg-white text-[10px] text-[#556377] border border-white"
            >
              📊 数据分析
            </button>
            <button
              onClick={() => handleSendMessage('基于本篇生成下一篇衍生选题')}
              className="px-2 py-0.5 rounded-lg bg-white/70 hover:bg-white text-[10px] text-[#556377] border border-white"
            >
              💡 衍生选题
            </button>
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="提问此节点或生成衍生想法..."
              className="flex-1 bg-white/90 text-xs px-3 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ea384c]"
            />
            <button
              onClick={() => handleSendMessage()}
              className="w-8 h-8 rounded-xl neuro-btn-red flex items-center justify-center text-white shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Bottom Actions */}
      <div className="pt-3 border-t border-gray-200/60 flex items-center gap-2">
        {onOpenImmersiveReader && (
          <button
            onClick={() => onOpenImmersiveReader(work)}
            className="neuro-btn px-3 py-2 rounded-xl text-xs font-bold text-[#ea384c] flex items-center justify-center gap-1 hover:bg-red-50"
            title="沉浸全屏阅读详细笔记"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>沉浸阅读</span>
          </button>
        )}
        {onNavigateToCreative && (
          <button
            onClick={() => onNavigateToCreative(work)}
            className="flex-1 neuro-btn py-2 rounded-xl text-xs font-bold text-[#2a3240] flex items-center justify-center gap-1.5 hover:text-[#ea384c]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>在创作舱中引用</span>
          </button>
        )}
        <button
          onClick={onClose}
          className="px-3.5 neuro-btn py-2 rounded-xl text-xs font-semibold text-[#667487]"
        >
          关闭
        </button>
      </div>
    </aside>
  );
};
