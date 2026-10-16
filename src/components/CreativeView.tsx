import React, { useState } from 'react';
import { NeuralSphere } from './NeuralSphere';
import { DRAFT_DOCS } from '../data/mockData';
import { DraftDoc, WorkItem } from '../types';
import { 
  Sparkles, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Quote, 
  Link2, 
  Search, 
  Plus, 
  Save, 
  CheckCircle, 
  Copy, 
  Wand2, 
  FileText, 
  Tag, 
  Layers, 
  ArrowRight
} from 'lucide-react';

interface CreativeViewProps {
  initialWorkRef?: WorkItem | null;
}

export const CreativeView: React.FC<CreativeViewProps> = ({ initialWorkRef }) => {
  const [activeDraft, setActiveDraft] = useState<DraftDoc>(DRAFT_DOCS[0]);
  const [content, setContent] = useState<string>(DRAFT_DOCS[0].content);
  const [wordCount, setWordCount] = useState<number>(DRAFT_DOCS[0].wordCount);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectDraft = (doc: DraftDoc) => {
    setActiveDraft(doc);
    setContent(doc.content);
    setWordCount(doc.wordCount);
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    setWordCount(val.length);
  };

  const insertText = (str: string) => {
    setContent((prev) => prev + '\n' + str);
    setWordCount((prev) => prev + str.length);
  };

  const handleAiContinue = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const continuation = `\n\n### 补充思考：神经连接的复利模型\n当一篇新文章完成时，我们不仅在创造新内容，更在激活过去积攒的数十篇历史作品。这种网络效应随着内容量线性增加，但影响力呈指数级爆发。[[Opus 3.5]] 的引入让这种连接变得全自动。`;
      setContent((prev) => prev + continuation);
      setWordCount((prev) => prev + continuation.length);
      setIsAiGenerating(false);
    }, 700);
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] px-8 py-6 flex flex-col justify-between">
      {/* Top Header (Frame 0:19 - 0:21) */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neuro-flat-sm border border-white/70 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#ea384c]" />
          <span className="text-[11px] font-bold tracking-wider text-[#495467] uppercase">
            CREATIVE · 创作舱
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#191f2c] tracking-tight">
          把灵感，写成下一篇。
        </h1>
        <p className="text-xs text-[#8a98ab] font-medium tracking-wide mt-1 font-mono">
          Write with AI & neural links — every link grows a backbone.
        </p>
      </div>

      {/* 3-Column Writing Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        {/* Left Column (col-span-3): Outline & Drafts List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="neuro-flat rounded-3xl p-4 border border-white/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2b3341]">草稿库与大纲</span>
              <button className="neuro-btn p-1.5 rounded-xl text-[#ea384c] hover:scale-105">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search drafts */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索草稿大纲..."
                className="w-full neuro-inset text-xs px-3 py-1.5 rounded-xl border border-white/70 text-[#1f2633] placeholder-[#8d9baa] focus:outline-none focus:ring-1 focus:ring-[#ea384c]"
              />
              <Search className="w-3 h-3 text-[#97a4b6] absolute right-2.5 top-2.5" />
            </div>

            {/* Drafts List */}
            <div className="space-y-1.5 pt-1">
              {DRAFT_DOCS.map((doc) => {
                const isActive = activeDraft.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDraft(doc)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all ${
                      isActive
                        ? 'neuro-btn-active border border-[#ea384c]/40 font-bold'
                        : 'neuro-flat-sm border border-white/70 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`truncate max-w-[170px] ${isActive ? 'text-[#191f2c]' : 'text-[#444e60]'}`}>
                        {doc.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#8e9caf]">
                      <span>{doc.wordCount} 字</span>
                      <span>{doc.updatedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table of Contents / Outline */}
          <div className="neuro-flat rounded-3xl p-4 border border-white/80 space-y-2">
            <span className="text-xs font-bold text-[#323c4d] block">结构化大纲</span>
            <div className="space-y-1.5 text-xs text-[#526074]">
              <div className="p-2 rounded-xl bg-white/60 border border-white hover:bg-white cursor-pointer">
                📌 痛点一：散落各处的信息孤岛
              </div>
              <div className="p-2 rounded-xl bg-white/60 border border-white hover:bg-white cursor-pointer">
                📌 痛点二：只有输入，没有消化
              </div>
              <div className="p-2 rounded-xl bg-white/60 border border-white hover:bg-white cursor-pointer">
                📌 痛点三：单向线性写作负担
              </div>
              <div className="p-2 rounded-xl bg-red-50 text-[#ea384c] border border-red-200/80 font-bold cursor-pointer">
                🚀 解决方案：让每一条链接双向生长
              </div>
            </div>
          </div>
        </div>

        {/* Center Column (col-span-6): Editor */}
        <div className="lg:col-span-6 neuro-flat rounded-3xl p-5 border border-white/80 flex flex-col min-h-[580px] shadow-lg">
          {/* Editor Header & Tags */}
          <div className="pb-3 border-b border-gray-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1f2633]">{activeDraft.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#ea384c] font-bold">
                {activeDraft.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8c9aae] font-medium">{wordCount} 字</span>
              <button
                onClick={handleSave}
                className="neuro-btn px-3 py-1 rounded-xl text-xs font-bold text-[#353f50] flex items-center gap-1 hover:text-[#ea384c]"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600">已保存</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>保存</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="py-2.5 flex items-center gap-1.5 border-b border-gray-200/60 overflow-x-auto text-xs text-[#526074]">
            <button
              onClick={() => insertText('**加粗文字**')}
              className="p-1.5 rounded-lg neuro-btn hover:text-black"
              title="加粗"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertText('*斜体文字*')}
              className="p-1.5 rounded-lg neuro-btn hover:text-black"
              title="斜体"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertText('### 小标题')}
              className="p-1.5 rounded-lg neuro-btn hover:text-black"
              title="标题"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertText('> 引用块文字')}
              className="p-1.5 rounded-lg neuro-btn hover:text-black"
              title="引用"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-gray-300 mx-1" />
            <button
              onClick={() => insertText('[[双向链接：输入关联作品]]')}
              className="px-2.5 py-1 rounded-lg neuro-btn text-[#ea384c] font-bold flex items-center gap-1 hover:bg-red-50"
              title="插入双向链接"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>[[双向链接]]</span>
            </button>
          </div>

          {/* Textarea Editor Area */}
          <div className="flex-1 py-3">
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full h-full min-h-[380px] bg-transparent text-[#222a36] text-sm leading-relaxed focus:outline-none resize-none font-sans"
              placeholder="在此开始你的深度创作..."
            />
          </div>

          {/* Bottom AI Assistant Action Bar */}
          <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAiContinue}
                disabled={isAiGenerating}
                className="neuro-btn-red px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiGenerating ? 'AI 正在深度思考...' : '智能续写'}</span>
              </button>
              <button
                onClick={() => insertText('\n💡 [AI提炼金句]：知识只有在产生回路时，才真正属于你。')}
                className="neuro-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-[#485568] hover:text-[#191f2c]"
              >
                <Wand2 className="w-3.5 h-3.5 inline mr-1 text-[#ea384c]" />
                润色文风
              </button>
            </div>

            <div className="text-[11px] text-[#8e9caf]">
              实时双链自检：正常
            </div>
          </div>
        </div>

        {/* Right Column (col-span-3): Neural References (Frame 0:19 - 0:21) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="neuro-flat rounded-3xl p-4 border border-white/80 space-y-3">
            {/* Top Mini Neural Sphere */}
            <div className="flex flex-col items-center justify-center p-2 rounded-2xl neuro-inset">
              <NeuralSphere size={110} pulsingIntensity={1} />
              <p className="text-[11px] font-bold text-[#1f2633] mt-1">神经参考共鸣室</p>
              <p className="text-[9px] text-[#8b99ab]">根据当前上下文实时召回</p>
            </div>

            {/* Linked Nodes List */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#323c4d] block">强相关知识节点</span>
              {activeDraft.linkedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-2.5 rounded-2xl neuro-flat-sm border border-white/90 space-y-1 hover:border-red-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1f2633] truncate max-w-[160px] group-hover:text-[#ea384c]">
                      {note.title}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#ea384c]">
                      {note.matchScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8c99ac]">
                    <span>{note.type}</span>
                    <span className="text-[#ea384c] group-hover:underline">插入引用 +</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggestion Card */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/70 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#ea384c]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>智能飞轮建议</span>
              </div>
              <p className="text-[11px] text-[#4d596c] leading-relaxed">
                当前痛点三提到了「单向线性负担」，与作品库《卡片盒笔记法》第 4 章产生强烈共振，建议补充引用。
              </p>
              <button
                onClick={() => insertText('\n参考引用：[[卡片盒笔记法实践：从输入到输出的闭环系统]]')}
                className="w-full py-1.5 rounded-xl bg-white text-[#ea384c] text-[11px] font-bold border border-red-200 shadow-sm hover:bg-red-50"
              >
                + 一键插入双向链接
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
