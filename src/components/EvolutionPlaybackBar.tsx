import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  X, 
  Clock, 
  Sparkles, 
  Zap, 
  GitBranch, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

export interface MilestoneEvent {
  id: string;
  date: string;
  title: string;
  nodeId: string;
  category: string;
  desc: string;
  tag: string;
  color: string;
}

export const MILESTONES: MilestoneEvent[] = [
  {
    id: 'm1',
    date: '08-11',
    title: '创作者瓶颈痛点沉淀',
    nodeId: 'creator-burnout-node',
    category: '商业思考',
    desc: '沉淀创作者四大核心痛点自救手册，确立模块化缓冲池机制。',
    tag: '灵感萌芽',
    color: '#8b5cf6',
  },
  {
    id: 'm2',
    date: '08-20',
    title: '穿透式阅读输入闭环',
    nodeId: 'reading-method-node',
    category: '知识管理',
    desc: '拒绝被动囤积，将单本书籍榨干为可复利的行动卡片。',
    tag: '输入链路',
    color: '#10b981',
  },
  {
    id: 'm3',
    date: '08-28',
    title: 'Vibe Coding 敏捷直觉',
    nodeId: 'vibe-coding-node',
    category: 'AI 模型',
    desc: '直觉式编码验证，零代码直通上线产品，探索人机协同极速交付。',
    tag: '直觉涌现',
    color: '#ea384c',
  },
  {
    id: 'm4',
    date: '09-02',
    title: '超级个体商业飞轮',
    nodeId: 'solopreneur-node',
    category: '一人公司',
    desc: '独立开发者的商业闭环成型，数字化知识资产实现低边际成本复利。',
    tag: '商业飞轮',
    color: '#8b5cf6',
  },
  {
    id: 'm5',
    date: '09-15',
    title: '卡片盒双向闭环建立',
    nodeId: 'zettelkasten-node',
    category: '知识管理',
    desc: '突破树形文件夹限制，知识原子节点双向生长涌现。',
    tag: '网状生长',
    color: '#10b981',
  },
  {
    id: 'm6',
    date: '09-24',
    title: 'Obsidian + Cursor 第二大脑',
    nodeId: 'obsidian-cursor-node',
    category: '核心架构',
    desc: '双脑联动架构落地：原子笔记沉淀与智能化补全贯通。',
    tag: '架构贯通',
    color: '#0284c7',
  },
  {
    id: 'm7',
    date: '10-02',
    title: '程序员未来架构认知升维',
    nodeId: 'code-dead-node',
    category: '系统思考',
    desc: '深度拆解代码终局，系统抽象力与认知架构成为最深护城河。',
    tag: '高维跃升',
    color: '#0284c7',
  },
  {
    id: 'm8',
    date: '10-06',
    title: 'Opus 3.5 创作面板全面爆发',
    nodeId: 'opus-35-node',
    category: '数字化大脑',
    desc: '自动化多模型工作流成型，创作者神经图谱系统进入全自主生长态。',
    tag: '神经盛放',
    color: '#ea384c',
  },
];

interface EvolutionPlaybackBarProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onStepChange: (index: number) => void;
}

export const EvolutionPlaybackBar: React.FC<EvolutionPlaybackBarProps> = ({
  isOpen,
  onClose,
  currentIndex,
  onStepChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);

  // Playback timer loop
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && isOpen) {
      const intervalMs = Math.round(2200 / playbackSpeed);
      timer = setInterval(() => {
        onStepChange((currentIndex + 1) % MILESTONES.length);
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isOpen, currentIndex, playbackSpeed, onStepChange]);

  if (!isOpen) return null;

  const currentMilestone = MILESTONES[currentIndex] || MILESTONES[0];

  const handlePrev = () => {
    onStepChange(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    onStepChange(Math.min(MILESTONES.length - 1, currentIndex + 1));
  };

  const handleReset = () => {
    onStepChange(0);
    setIsPlaying(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-4xl neuro-flat rounded-3xl p-4 border border-white/90 shadow-2xl space-y-3 animate-slide-up backdrop-blur-md bg-white/95">
      {/* Top Banner: Milestone highlight */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md transition-colors"
            style={{ backgroundColor: currentMilestone.color }}
          >
            {currentIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#8997a8] font-mono">
                2024-{currentMilestone.date}
              </span>
              <span 
                className="px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white"
                style={{ backgroundColor: currentMilestone.color }}
              >
                {currentMilestone.tag}
              </span>
              <h4 className="text-sm font-extrabold text-[#191f2c]">
                {currentMilestone.title}
              </h4>
            </div>
            <p className="text-xs text-[#5f6d80] mt-0.5">
              {currentMilestone.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed switcher */}
          <div className="flex items-center gap-1 p-0.5 neuro-inset rounded-xl text-[10px] font-bold">
            {([1, 2, 4] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  playbackSpeed === spd
                    ? 'bg-white text-[#ea384c] shadow-xs'
                    : 'text-[#6c7b8e] hover:text-black'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8d9baa] hover:text-[#191f2c] hover:bg-black/5"
            title="退出脉络回放"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Timeline Scrubber */}
      <div className="relative pt-1">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#8b99aa] mb-1.5">
          <span>生长演进进度: {currentIndex + 1} / {MILESTONES.length} 阶段</span>
          <span>按时间轴序列动态激活图谱节点</span>
        </div>

        {/* Milestone Steps Bar */}
        <div className="relative flex items-center justify-between gap-1">
          {/* Connector Line behind */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200/80 -translate-y-1/2 z-0 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#ea384c] to-[#ff4d6d] -translate-y-1/2 z-0 rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / (MILESTONES.length - 1)) * 100}%` }}
          />

          {MILESTONES.map((m, idx) => {
            const isReached = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={m.id}
                onClick={() => onStepChange(idx)}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-sm ${
                    isCurrent
                      ? 'ring-4 ring-red-200 text-white scale-125'
                      : isReached
                      ? 'text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
                  style={isReached ? { backgroundColor: m.color } : {}}
                >
                  {isReached ? '✓' : idx + 1}
                </div>
                <span className={`text-[9px] mt-1 font-mono transition-colors ${
                  isCurrent ? 'font-bold text-[#ea384c]' : 'text-[#7e8e9f]'
                }`}>
                  {m.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          onClick={handleReset}
          className="p-2 rounded-xl neuro-btn text-[#556377] hover:text-[#ea384c]"
          title="重新开始"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-xl neuro-btn text-[#556377] hover:text-black disabled:opacity-30"
          title="上一阶段"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="py-2 px-5 rounded-2xl bg-gradient-to-r from-[#ea384c] to-[#ff4757] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? '暂停演进' : '自动回放'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === MILESTONES.length - 1}
          className="p-2 rounded-xl neuro-btn text-[#556377] hover:text-black disabled:opacity-30"
          title="下一阶段"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
