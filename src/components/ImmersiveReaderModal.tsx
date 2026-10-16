import React, { useState, useEffect } from 'react';
import { WorkItem } from '../types';
import { 
  X, 
  BookOpen, 
  Share2, 
  Bookmark, 
  Heart, 
  Eye, 
  Clock, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Link2, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2,
  Calendar,
  Tag
} from 'lucide-react';

interface ImmersiveReaderModalProps {
  isOpen: boolean;
  work: WorkItem | null;
  onClose: () => void;
  onSelectAnotherWork?: (workId: string) => void;
  allWorks: WorkItem[];
}

export const ImmersiveReaderModal: React.FC<ImmersiveReaderModalProps> = ({
  isOpen,
  work,
  onClose,
  onSelectAnotherWork,
  allWorks,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl'>('md');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !work) return null;

  const currentIndex = allWorks.findIndex((w) => w.id === work.id);
  const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null;
  const nextWork = currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      {/* Reading Progress Indicator Bar at Very Top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200/50 z-60">
        <div
          className="h-full bg-gradient-to-r from-[#ea384c] to-[#ff6b6b] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Reader Window */}
      <div className="relative w-full h-full max-w-6xl max-h-[94vh] mx-4 my-auto neuro-flat rounded-3xl border border-white/90 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Sticky Header */}
        <header className="px-6 py-3.5 bg-[#ebedf2]/95 backdrop-blur-md border-b border-gray-200/70 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full neuro-btn flex items-center justify-center text-[#556377] hover:text-[#191f2c]"
              title="退出沉浸阅读 (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ea384c] animate-pulse" />
              <span className="text-xs font-bold text-[#1f2633] tracking-wide">
                沉浸式神经阅读器
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#ea384c] font-bold">
                {work.category}
              </span>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[#6e7d91]">
            {prevWork && (
              <button
                onClick={() => onSelectAnotherWork && onSelectAnotherWork(prevWork.id)}
                className="neuro-btn px-2.5 py-1 rounded-xl flex items-center gap-1 hover:text-[#ea384c]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">上一篇：{prevWork.title}</span>
              </button>
            )}
            {nextWork && (
              <button
                onClick={() => onSelectAnotherWork && onSelectAnotherWork(nextWork.id)}
                className="neuro-btn px-2.5 py-1 rounded-xl flex items-center gap-1 hover:text-[#ea384c]"
              >
                <span className="truncate max-w-[120px]">下一篇：{nextWork.title}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Font size toggle */}
            <div className="neuro-flat-sm rounded-xl p-0.5 flex items-center text-xs">
              <button
                onClick={() => setFontSize('md')}
                className={`px-2 py-0.5 rounded-lg font-bold ${fontSize === 'md' ? 'bg-white shadow-sm text-[#ea384c]' : 'text-[#718095]'}`}
              >
                中
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded-lg font-bold ${fontSize === 'lg' ? 'bg-white shadow-sm text-[#ea384c]' : 'text-[#718095]'}`}
              >
                大
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-0.5 rounded-lg font-bold ${fontSize === 'xl' ? 'bg-white shadow-sm text-[#ea384c]' : 'text-[#718095]'}`}
              >
                特大
              </button>
            </div>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`w-8 h-8 rounded-full neuro-btn flex items-center justify-center transition-colors ${
                isBookmarked ? 'text-amber-500 font-bold' : 'text-[#6e7d91] hover:text-black'
              }`}
              title="收藏本篇"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleCopyLink}
              className="w-8 h-8 rounded-full neuro-btn flex items-center justify-center text-[#6e7d91] hover:text-[#ea384c]"
              title="复制双向引用链接"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Reader Layout: Content Body on Left + Neural Context Sidebar on Right */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start"
        >
          {/* Main Article Body */}
          <article className="flex-1 max-w-3xl mx-auto w-full space-y-6">
            {/* Cover Banner */}
            <div className="relative rounded-3xl overflow-hidden neuro-inset p-1.5 shadow-inner">
              <img
                src={work.cover}
                alt={work.title}
                className="w-full h-64 md:h-80 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none rounded-2xl" />
              <div className="absolute bottom-4 left-6 right-6 text-white flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider">
                    {work.category}
                  </span>
                  <p className="text-xs text-white/80 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> 发布于 {work.publishDate} · 约 8 分钟深度阅读
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold">
                    <Eye className="w-3.5 h-3.5 text-[#ea384c]" /> {work.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> {work.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Title & Metadata Tags */}
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#191f2c] tracking-tight leading-snug">
                {work.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {work.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full neuro-flat-sm text-[11px] font-semibold text-[#526074] border border-white"
                  >
                    #{tag}
                  </span>
                ))}
                <span className="text-xs text-[#8e9caf] ml-2">
                  双向神经引用度：{work.linksCount + work.backlinksCount} 条回路
                </span>
              </div>
            </div>

            {/* Executive Abstract Callout */}
            <div className="neuro-inset rounded-2xl p-4 border border-white/80 border-l-4 border-l-[#ea384c]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#ea384c] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>核心论点提要 (Executive Summary)</span>
              </div>
              <p className="text-xs text-[#444f62] leading-relaxed">
                {work.summary}
              </p>
            </div>

            {/* Article Markdown Text (Rendered with customizable font size) */}
            <div
              className={`prose max-w-none text-[#252e3c] leading-relaxed space-y-4 font-sans ${
                fontSize === 'lg' ? 'text-base' : fontSize === 'xl' ? 'text-lg' : 'text-sm'
              }`}
            >
              <h2 className="text-lg font-bold text-[#191f2c] pt-2 border-b border-gray-200/60 pb-1">
                一、认知颠覆：单向信息流的死亡
              </h2>
              <p>
                在过去很长一段时间里，创作者都陷入在一种虚假的繁荣感中：每天打开收藏夹、保存几十篇行业动态、在备忘录里写下灵感火花。然而当真正开始创作下一篇文章时，所有之前的积累就像蒸发了一样，依旧面对着一张令人恐惧的空白屏幕。
              </p>
              <p>
                根本问题在于：<strong>单向存储的信息不具备生长性</strong>。没有反向索引和语境重构的收藏夹，本质上就是一个数字坟墓。而在我们设计的神经双向链接系统中，每一个输入都在实时寻找它在历史知识库中的前向锚点与未来可能滋养的选题分支。
              </p>

              <blockquote className="p-3.5 rounded-2xl bg-white/70 border-l-4 border-[#ea384c] text-xs md:text-sm italic text-[#505c6e]">
                “知识从来不是砖块的简单堆叠，而是神经突触的交织共振。唯有让链接双向流动，思考才能产生复利。”
              </blockquote>

              <h2 className="text-lg font-bold text-[#191f2c] pt-4 border-b border-gray-200/60 pb-1">
                二、AI 作为第二中枢：从指令到协同
              </h2>
              <p>
                当我们引入{' '}
                <span className="px-2 py-0.5 rounded-lg bg-red-100 text-[#ea384c] font-bold text-xs cursor-pointer hover:underline">
                  [[Opus 3.5]]
                </span>{' '}
                与双链知识图谱后，整个工作流发生了质的跃迁。AI 不再只是一个帮你续写句子的打字机，而是化身为**神经网络的拓扑侦探**：
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-[#455265]">
                <li>自动扫描新闪念与作品库历史高赞概念的语义契合度；</li>
                <li>发现知识盲区：标记哪些核心假说已经有超过 3 个月未被更新或反思；</li>
                <li>自动生成下一篇交叉选题：例如将「独立开发商业模式」与「卡片盒笔记法」进行跨界缝合。</li>
              </ul>

              <h2 className="text-lg font-bold text-[#191f2c] pt-4 border-b border-gray-200/60 pb-1">
                三、结论与实践行动清单
              </h2>
              <p>
                打造个人数字第二大脑不是一次性的项目，而是一场终身的信息新陈代谢。当你每一次敲下键盘都在加固既有的神经通路，创作就会从一种痛苦的灵感挤压，变成自然而然的水到渠成。
              </p>
            </div>

            {/* Bottom Actions inside Article */}
            <div className="pt-6 border-t border-gray-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="neuro-btn px-4 py-2 rounded-2xl text-xs font-bold text-[#343e4f] flex items-center gap-1.5 hover:text-[#ea384c]"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isBookmarked ? '已加入收藏' : '收藏此笔记'}</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="neuro-btn px-4 py-2 rounded-2xl text-xs font-semibold text-[#5d6b7f] hover:text-[#191f2c]"
                >
                  {copiedLink ? '已复制引用语法' : '复制 [[双向引用]] 标记'}
                </button>
              </div>

              <button
                onClick={onClose}
                className="neuro-btn-red px-5 py-2 rounded-2xl text-xs font-bold shadow-md"
              >
                返回工作台脑图
              </button>
            </div>
          </article>

          {/* Right Sidebar: Contextual Neural Links & AI Outline */}
          <aside className="w-full lg:w-72 neuro-flat rounded-3xl p-4 border border-white/80 space-y-4 shrink-0 shadow-sm sticky top-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
              <span className="text-xs font-bold text-[#202734]">神经上下文关联</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#ea384c] font-bold">
                {work.linksCount} 前向 · {work.backlinksCount} 反链
              </span>
            </div>

            {/* Bidirectional Linked Nodes */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#627185] block">双向关联知识卡片</span>
              {allWorks
                .filter((w) => w.id !== work.id)
                .slice(0, 3)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectAnotherWork && onSelectAnotherWork(item.id)}
                    className="p-2.5 rounded-2xl neuro-flat-sm border border-white hover:border-red-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#1f2633] truncate max-w-[170px] group-hover:text-[#ea384c]">
                        {item.title}
                      </span>
                      <ChevronRight className="w-3 h-3 text-[#9daabb] group-hover:text-[#ea384c]" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#8e9caf]">
                      <span>{item.category}</span>
                      <span className="text-[#ea384c] font-medium">{item.interactionRate} 互动</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* AI Node Copilot Summary */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/80 text-xs space-y-1.5">
              <div className="flex items-center gap-1 text-[#ea384c] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 神经脉冲评估</span>
              </div>
              <p className="text-[11px] text-[#556376] leading-relaxed">
                本篇已沉淀为【S级中枢资产】。其概念被灵感池中 4 个待写选题引用，属于知识网络的高度强连通核心分部。
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
