import React, { useState, useRef, useEffect, useId } from 'react';
import { NeuralSphere } from './NeuralSphere';
import { NodeInspectorDrawer } from './NodeInspectorDrawer';
import { SATELLITE_NODES, WORK_ITEMS, MIND_MAP_TREE } from '../data/mockData';
import { WorkItem, SatelliteNode } from '../types';
import { 
  Sparkles, 
  Send, 
  Search, 
  Maximize2, 
  ChevronRight, 
  Filter, 
  Layers, 
  Share2, 
  GitBranch, 
  FolderGit2,
  BookOpen,
  Calendar,
  Flame,
  ArrowRight,
  Move,
  RotateCcw,
  GripVertical,
  ZoomIn,
  ZoomOut,
  Hand,
  Compass
} from 'lucide-react';

interface WorkbenchViewProps {
  mode: 'orbital' | 'mindmap';
  onToggleMode: (mode: 'orbital' | 'mindmap') => void;
  onNavigateToTab: (tab: any) => void;
  onSelectWorkForCreative?: (work: WorkItem) => void;
}

// Initial Orbital satellite node offsets relative to center (0, 0)
const DEFAULT_SATELLITE_OFFSETS: Record<string, { x: number; y: number }> = {
  arch: { x: 0, y: -220 },       // 19 核心架构 (Top)
  library: { x: -290, y: -10 },   // 24 作品库 (Left)
  ideas: { x: -220, y: 180 },     // 11 灵感卡片 (Bottom Left)
  drafts: { x: 270, y: -120 },    // 6 创作草稿 (Top Right)
  scheduled: { x: 230, y: 170 },  // 5 待发布 (Bottom Right)
};

export const WorkbenchView: React.FC<WorkbenchViewProps> = ({
  mode,
  onToggleMode,
  onNavigateToTab,
  onSelectWorkForCreative,
}) => {
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(WORK_ITEMS[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('library');
  const [selectedLeafId, setSelectedLeafId] = useState<string>('opus-35-node');
  const [searchQuery, setSearchQuery] = useState('');
  const [copilotAnswer, setCopilotAnswer] = useState<string | null>(null);

  // Hover states for SVG neural energy pulse animation
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredLeafId, setHoveredLeafId] = useState<string | null>(null);

  // Zoom & Pan states for Mind Map canvas
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({
    x: 0,
    y: 0,
    startPanX: 0,
    startPanY: 0,
  });

  // Orbital Satellite positions state
  const [satellitePositions, setSatellitePositions] = useState<Record<string, { x: number; y: number }>>(
    DEFAULT_SATELLITE_OFFSETS
  );

  // Dragging state for orbital nodes
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number; moved: boolean }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });

  // Mind map tree state for reordering & offsets
  const [mindMapData, setMindMapData] = useState(MIND_MAP_TREE);
  const [draggedLeafIndex, setDraggedLeafIndex] = useState<{ branchId: string; leafIndex: number } | null>(null);
  const [dragOverLeafIndex, setDragOverLeafIndex] = useState<{ branchId: string; leafIndex: number } | null>(null);
  
  // Custom offsets for mind map branches/nodes
  const [branchOffsets, setBranchOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingBranchId, setDraggingBranchId] = useState<string | null>(null);
  const branchDragRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number; moved: boolean }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
    moved: false,
  });

  // Container refs for measuring center
  const orbitalContainerRef = useRef<HTMLDivElement>(null);
  const mindMapCanvasRef = useRef<HTMLDivElement>(null);

  // Drag refs to track live dragging synchronously without state delay
  const activeOrbitalDragId = useRef<string | null>(null);
  const activeBranchDragId = useRef<string | null>(null);
  const isPanningActiveRef = useRef<boolean>(false);

  // Unified drag start handler for orbital satellite nodes
  const handleStartDrag = (e: React.MouseEvent | React.PointerEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    activeOrbitalDragId.current = id;
    const currentPos = satellitePositions[id] || { x: 0, y: 0 };
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentPos.x,
      startY: currentPos.y,
      moved: false,
    };
    setDraggingNodeId(id);
  };

  const handleEndDrag = (node?: SatelliteNode) => {
    const moved = dragStartRef.current.moved;
    activeOrbitalDragId.current = null;
    setDraggingNodeId(null);
    if (!moved && node) {
      handleSatelliteClick(node);
    }
  };

  // Unified branch drag start
  const handleStartBranchDrag = (e: React.MouseEvent | React.PointerEvent, branchId: string) => {
    e.preventDefault();
    e.stopPropagation();
    activeBranchDragId.current = branchId;
    const currentOffset = branchOffsets[branchId] || { x: 0, y: 0 };
    branchDragRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentOffset.x,
      startY: currentOffset.y,
      moved: false,
    };
    setDraggingBranchId(branchId);
  };

  // Canvas Pan Handlers
  const handleCanvasPanStart = (e: React.MouseEvent) => {
    // Only pan if clicking on canvas background or holding space/middle click
    if (e.target !== e.currentTarget && !(e.target as HTMLElement).classList.contains('canvas-pannable-bg')) {
      return;
    }
    e.preventDefault();
    isPanningActiveRef.current = true;
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panOffset.x,
      startPanY: panOffset.y,
    };
  };

  // Mouse wheel zoom
  const handleCanvasWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = -e.deltaY * 0.0012;
    setZoomScale((prev) => {
      const next = prev + zoomFactor;
      return Math.min(2.0, Math.max(0.5, parseFloat(next.toFixed(2))));
    });
  };

  // Zoom control buttons
  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(2.0, parseFloat((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(0.5, parseFloat((prev - 0.15).toFixed(2))));
  };

  const handleResetView = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Persistent window-level smooth dragging and panning listener
  useEffect(() => {
    const handleMove = (e: MouseEvent | PointerEvent) => {
      // 1. Orbital node dragging
      const orbitalId = activeOrbitalDragId.current;
      if (orbitalId) {
        const dx = e.clientX - dragStartRef.current.mouseX;
        const dy = e.clientY - dragStartRef.current.mouseY;
        if (Math.hypot(dx, dy) > 2) {
          dragStartRef.current.moved = true;
        }
        setSatellitePositions((prev) => ({
          ...prev,
          [orbitalId]: {
            x: dragStartRef.current.startX + dx,
            y: dragStartRef.current.startY + dy,
          },
        }));
      }

      // 2. Branch spatial dragging
      const branchId = activeBranchDragId.current;
      if (branchId) {
        const dx = e.clientX - branchDragRef.current.mouseX;
        const dy = e.clientY - branchDragRef.current.mouseY;
        if (Math.hypot(dx, dy) > 2) {
          branchDragRef.current.moved = true;
        }
        setBranchOffsets((prev) => ({
          ...prev,
          [branchId]: {
            x: branchDragRef.current.startX + dx,
            y: branchDragRef.current.startY + dy,
          },
        }));
      }

      // 3. Canvas panning
      if (isPanningActiveRef.current) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        setPanOffset({
          x: panStartRef.current.startPanX + dx,
          y: panStartRef.current.startPanY + dy,
        });
      }
    };

    const handleUp = () => {
      activeOrbitalDragId.current = null;
      activeBranchDragId.current = null;
      isPanningActiveRef.current = false;
      setDraggingNodeId(null);
      setDraggingBranchId(null);
      setIsPanning(false);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  // Mind map drag-to-reorder handlers
  const handleLeafDragStart = (branchId: string, leafIndex: number) => {
    setDraggedLeafIndex({ branchId, leafIndex });
  };

  const handleLeafDragOver = (e: React.DragEvent, branchId: string, leafIndex: number) => {
    e.preventDefault();
    setDragOverLeafIndex({ branchId, leafIndex });
  };

  const handleLeafDrop = (targetBranchId: string, targetIndex: number) => {
    if (!draggedLeafIndex) return;
    const { branchId: sourceBranchId, leafIndex: sourceIndex } = draggedLeafIndex;

    setMindMapData((prev) => {
      const newBranches = [...(prev.children || [])];
      const sourceBranch = newBranches.find((b) => b.id === sourceBranchId);
      const targetBranch = newBranches.find((b) => b.id === targetBranchId);

      if (!sourceBranch || !targetBranch || !sourceBranch.children || !targetBranch.children) {
        return prev;
      }

      const [movedItem] = sourceBranch.children.splice(sourceIndex, 1);
      targetBranch.children.splice(targetIndex, 0, movedItem);

      sourceBranch.count = sourceBranch.children.length;
      targetBranch.count = targetBranch.children.length;

      return {
        ...prev,
        children: newBranches,
      };
    });

    setDraggedLeafIndex(null);
    setDragOverLeafIndex(null);
  };

  // Reset positions to default
  const handleResetLayout = () => {
    setSatellitePositions(DEFAULT_SATELLITE_OFFSETS);
    setBranchOffsets({});
    setMindMapData(MIND_MAP_TREE);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleSatelliteClick = (node: SatelliteNode) => {
    setActiveCategory(node.id);
    onToggleMode('mindmap');
  };

  const handleLeafClick = (leaf: any) => {
    setSelectedLeafId(leaf.id);
    const matched = WORK_ITEMS.find((w) => w.id === leaf.workId) || WORK_ITEMS[0];
    setSelectedWork(matched);
    setIsDrawerOpen(true);
  };

  const handleCopilotQuery = (query: string) => {
    setSearchQuery(query);
    setCopilotAnswer(
      `【神经大脑检索】针对「${query}」：知识库中已检索到 3 个高频交汇点——《Opus 3.5 创作面板》和《Obsidian+Cursor》均引用了此概念。建议下一步选题：【双向神经系统从碎片到成文】，预期互动率可达 3.8% 以上。`
    );
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden px-8 py-6">
      {/* Top Left Title & Stats (Always visible in Workbench) */}
      <div className="z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neuro-flat-sm border border-white/70 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#ea384c] animate-ping" />
          <span className="text-[11px] font-bold tracking-wider text-[#495467] uppercase">
            KUAN NEURAL STUDIO | 创作者大脑
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#191f2c] tracking-tight leading-tight">
          让每一条链接，<br />
          <span className="bg-gradient-to-r from-[#191f2c] via-[#ea384c] to-[#191f2c] bg-clip-text text-transparent">
            双向生长。
          </span>
        </h1>
        <p className="text-xs text-[#8a98ab] font-medium tracking-wide mt-1.5 font-mono">
          Every link grows both ways.
        </p>
        <p className="text-xs text-[#5f6c80] font-medium mt-2.5 flex items-center gap-2">
          <span>1 个神经中枢</span>
          <span className="text-[#cbd5e1]">·</span>
          <span>46 核心思想</span>
          <span className="text-[#cbd5e1]">·</span>
          <span>505 衍生链接</span>
          <span className="text-[#cbd5e1]">·</span>
          <span>219 内容资产</span>
        </p>
      </div>

      {/* Top Right Floating Filter & Legend & Reset */}
      <div className="absolute top-6 right-8 z-20 flex flex-col items-end gap-3">
        {/* Reset Layout Button & Drag Tip Pill */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full neuro-flat-sm text-[10px] font-semibold text-[#667588] border border-white/70 flex items-center gap-1.5">
            <Move className="w-3 h-3 text-[#ea384c]" />
            <span>
              {mode === 'orbital' ? '悬停节点激活神经脉冲 · 拖拽调整轨道' : '按住空白平移画布 · 滚轮缩放导图'}
            </span>
          </span>

          <button
            onClick={handleResetLayout}
            className="neuro-btn px-2.5 py-1 rounded-full text-[11px] font-medium text-[#505d70] hover:text-[#ea384c] flex items-center gap-1 border border-white/70 shadow-sm"
            title="重置星系与思维导图默认坐标与缩放"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置视口与布局</span>
          </button>
        </div>

        {/* Legend */}
        <div className="neuro-flat rounded-2xl p-3 border border-white/70 text-xs space-y-1.5 w-44 shadow-sm">
          <div className="text-[10px] font-bold text-[#8d9baa] uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>网络概览</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea384c]" />
          </div>
          <div className="flex justify-between items-center text-[#4b5668]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ea384c]" /> 核心思想
            </span>
            <span className="font-bold text-[#1f2633]">46</span>
          </div>
          <div className="flex justify-between items-center text-[#4b5668]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 已发作品
            </span>
            <span className="font-bold text-[#1f2633]">24</span>
          </div>
          <div className="flex justify-between items-center text-[#4b5668]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> 衍生链接
            </span>
            <span className="font-bold text-[#1f2633]">505</span>
          </div>
          <div className="flex justify-between items-center text-[#4b5668]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 灵感卡片
            </span>
            <span className="font-bold text-[#1f2633]">11</span>
          </div>
          <div className="flex justify-between items-center text-[#4b5668]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> 待发布
            </span>
            <span className="font-bold text-[#1f2633]">5</span>
          </div>
        </div>

        {/* View Mode Switcher Pill */}
        <div className="neuro-flat rounded-full p-1 border border-white/80 flex items-center text-xs font-semibold shadow-sm">
          <button
            onClick={() => onToggleMode('orbital')}
            className={`px-3 py-1 rounded-full transition-all ${
              mode === 'orbital'
                ? 'neuro-btn-active text-[#1c222e] font-bold'
                : 'text-[#6c798d] hover:text-[#1c222e]'
            }`}
          >
            星系中枢
          </button>
          <button
            onClick={() => onToggleMode('mindmap')}
            className={`px-3 py-1 rounded-full transition-all ${
              mode === 'mindmap'
                ? 'neuro-btn-active text-[#1c222e] font-bold'
                : 'text-[#6c798d] hover:text-[#1c222e]'
            }`}
          >
            脑图分支
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 flex items-center justify-center my-4 min-h-[440px]">
        {mode === 'orbital' ? (
          /* ========================================================
             MODE A: ORBITAL CONSTELLATION VIEW (Video 0:03 - 0:11)
             With SVG Neural Pulse Flow Animations & Interactive Drag!
             ======================================================== */
          <div
            ref={orbitalContainerRef}
            className="relative flex items-center justify-center w-full h-[520px] select-none"
          >
            {/* Concentric Soft Orbital Rings */}
            <div className="absolute w-[540px] h-[540px] rounded-full border border-dashed border-[#ccd4e2]/70 pointer-events-none" />
            <div className="absolute w-[440px] h-[440px] rounded-full border border-solid border-[#d5dde9]/80 pointer-events-none" />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-[#ea384c]/30 pointer-events-none animate-spin [animation-duration:90s]" />

            {/* Dynamic SVG Connecting Lines with Real Neural Pulse Flows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
              <defs>
                <linearGradient id="orbitLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ea384c" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#ff758f" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a0aec0" stopOpacity="0.25" />
                </linearGradient>

                <linearGradient id="orbitActiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff3344" stopOpacity="1" />
                  <stop offset="50%" stopColor="#ff758f" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ff0033" stopOpacity="0.8" />
                </linearGradient>

                <radialGradient id="pulseSparkGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="40%" stopColor="#ff4d6d" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ea384c" stopOpacity="0" />
                </radialGradient>

                <filter id="glowNeural" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="blur1" />
                  <feGaussianBlur stdDeviation="1.5" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Render dynamic Bezier curve from center (0,0) to each satellite position */}
              {SATELLITE_NODES.map((node) => {
                const pos = satellitePositions[node.id] || { x: 0, y: 0 };
                const isDraggingThis = draggingNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                
                const midX = pos.x * 0.45;
                const midY = pos.y * 0.45;
                const pathId = `orbital-path-${node.id}`;
                const pathData = `M 0 0 Q ${midX} ${midY} ${pos.x} ${pos.y}`;

                return (
                  <g key={`svg-link-${node.id}`} style={{ transform: 'translate(50%, 50%)' }}>
                    {/* Underlying guide line */}
                    <path
                      id={pathId}
                      d={pathData}
                      stroke={isHovered || isDraggingThis ? 'url(#orbitActiveGrad)' : 'url(#orbitLineGrad)'}
                      strokeWidth={isHovered ? '3.5' : isDraggingThis ? '3' : '2'}
                      strokeDasharray={isHovered ? 'none' : '4 5'}
                      fill="none"
                      filter={isHovered ? 'url(#glowNeural)' : 'none'}
                      className="transition-all duration-300"
                    />

                    {/* Animated Energy Pulses (Flowing towards satellite node) */}
                    <circle r={isHovered ? 5.5 : 3.5} fill="url(#pulseSparkGrad)">
                      <animateMotion
                        dur={isHovered ? '1s' : '3.2s'}
                        repeatCount="indefinite"
                        path={pathData}
                        keyPoints="0;1"
                        keyTimes="0;1"
                      />
                    </circle>

                    {/* Secondary trailing particle on hover */}
                    {isHovered && (
                      <circle r="4" fill="#ffffff" opacity="0.9">
                        <animateMotion
                          dur="1s"
                          begin="0.4s"
                          repeatCount="indefinite"
                          path={pathData}
                          keyPoints="0;1"
                          keyTimes="0;1"
                        />
                      </circle>
                    )}

                    {/* Energy wave ripple at target point */}
                    {isHovered && (
                      <circle cx={pos.x} cy={pos.y} r="8" fill="none" stroke="#ea384c" strokeWidth="1.5">
                        <animate attributeName="r" values="6;16" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0" dur="1.2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Recessed Center Dish / Well */}
            <div className="relative w-[340px] h-[340px] rounded-full neuro-inset-deep flex items-center justify-center p-3 border border-white/60 z-10">
              {/* Outer decorative ring arc */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none -rotate-45">
                <circle
                  cx="170"
                  cy="170"
                  r="162"
                  stroke="rgba(234, 56, 76, 0.4)"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray="90 300"
                  strokeLinecap="round"
                />
              </svg>

              {/* 3D WebGL Neural Core */}
              <NeuralSphere
                size={300}
                pulsingIntensity={hoveredNodeId ? 1.6 : 1.2}
                onClick={() => onToggleMode('mindmap')}
                className="z-10"
              />

              {/* Center Tooltip on Hover */}
              <div 
                onClick={() => onToggleMode('mindmap')}
                className="absolute bottom-6 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-semibold text-white/95 border border-white/20 pointer-events-auto cursor-pointer hover:bg-black transition-colors flex items-center gap-1 shadow-lg z-20"
              >
                <span>点击展开知识图谱</span>
                <ChevronRight className="w-3 h-3 text-[#ea384c]" />
              </div>
            </div>

            {/* Draggable Orbiting Satellite Nodes */}
            {SATELLITE_NODES.map((node) => {
              const pos = satellitePositions[node.id] || { x: 0, y: 0 };
              const isDragging = draggingNodeId === node.id;
              const isLibrary = node.id === 'library';
              const isHovered = hoveredNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handleStartDrag(e, node.id)}
                  onMouseDown={(e) => handleStartDrag(e, node.id)}
                  onPointerUp={() => handleEndDrag(node)}
                  onMouseUp={() => handleEndDrag(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  style={{
                    transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                    touchAction: 'none',
                  }}
                  className={`absolute top-1/2 left-1/2 z-30 cursor-grab active:cursor-grabbing select-none transition-transform duration-150 ${
                    isDragging
                      ? 'scale-105 shadow-2xl ring-2 ring-[#ea384c] z-40'
                      : isHovered
                      ? 'scale-105 shadow-xl ring-2 ring-[#ea384c]/60'
                      : 'hover:scale-[1.03]'
                  }`}
                >
                  <div
                    className={`neuro-flat rounded-2xl p-3.5 border flex items-center gap-3 ${
                      isLibrary || isHovered
                        ? 'border-red-300/90 ring-1 ring-[#ea384c]/30'
                        : 'border-white/90'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#1d2330] flex items-center justify-center relative overflow-hidden shadow-inner shrink-0">
                      <div
                        className={`w-3.5 h-3.5 rounded-full ${
                          node.id === 'library'
                            ? 'bg-gradient-to-tr from-[#ea384c] to-[#ff4d6d] shadow-[0_0_8px_#ea384c]'
                            : node.id === 'arch'
                            ? 'bg-gradient-to-tr from-[#ea384c] to-[#ff758f] animate-pulse'
                            : node.id === 'drafts'
                            ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
                            : node.id === 'scheduled'
                            ? 'bg-indigo-500'
                            : 'bg-amber-400'
                        }`}
                      />
                      {isHovered && (
                        <div className="absolute inset-0 bg-red-500/20 animate-ping rounded-full" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-sm font-extrabold ${
                            isLibrary || isHovered ? 'text-[#ea384c]' : 'text-[#191f2c]'
                          }`}
                        >
                          {node.count}
                        </span>
                        <span className="text-xs font-bold text-[#4c576a]">{node.name}</span>
                        {isLibrary && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-100 text-[#ea384c] font-bold">
                            活跃
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#8e9caf] whitespace-nowrap">{node.desc}</p>
                    </div>

                    <div className="flex items-center gap-1 text-[#a3b0c2] pl-1">
                      <GripVertical className="w-3.5 h-3.5 opacity-50 hover:opacity-100 cursor-grab" />
                      <ChevronRight className="w-4 h-4 hover:text-[#ea384c] transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================
             MODE B: MIND MAP & HIERARCHICAL GRAPH (Video 0:12 - 0:16)
             With Pan & Zoom Canvas, Dynamic SVG Beziers, Energy Pulses!
             ======================================================== */
          <div className="relative w-full flex items-start gap-8 min-h-[500px]">
            {/* Left Category Spine + Mini Neural Core (Fixed dock) */}
            <div className="w-64 neuro-flat rounded-3xl p-4 border border-white/80 space-y-4 shrink-0 z-20 shadow-md">
              {/* Mini 3D Core in Left Dock */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200/70">
                <div className="w-14 h-14 rounded-2xl neuro-inset flex items-center justify-center overflow-hidden shrink-0">
                  <NeuralSphere size={56} interactive={false} pulsingIntensity={hoveredLeafId ? 1.4 : 0.8} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#1f2633]">神经中枢骨干</h3>
                  <p className="text-[10px] text-[#8997aa]">5 大聚类 · 505 连结</p>
                </div>
              </div>

              {/* Major Clusters List */}
              <div className="space-y-1.5">
                {SATELLITE_NODES.map((node) => {
                  const isActive = activeCategory === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setActiveCategory(node.id)}
                      className={`p-2.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between text-xs ${
                        isActive
                          ? 'neuro-btn-active border border-[#ea384c]/40 font-bold text-[#191f2c]'
                          : 'neuro-btn text-[#556276] hover:text-[#191f2c]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-[#ea384c] shadow-[0_0_6px_#ea384c]' : 'bg-[#9eaab9]'
                          }`}
                        />
                        <span>{node.name}</span>
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                          isActive ? 'bg-red-500 text-white' : 'bg-gray-200/70 text-[#606e81]'
                        }`}
                      >
                        {node.count}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-gray-200/60">
                <button
                  onClick={() => onToggleMode('orbital')}
                  className="w-full py-2 neuro-btn rounded-xl text-xs font-semibold text-[#576478] hover:text-[#1a202c] flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>返回星系视图</span>
                </button>
              </div>
            </div>

            {/* Mind Map Canvas (With Pan & Zoom Container) */}
            <div
              ref={mindMapCanvasRef}
              onMouseDown={handleCanvasPanStart}
              onWheel={handleCanvasWheel}
              className={`flex-1 neuro-inset rounded-3xl p-6 border border-white/60 relative overflow-hidden min-h-[540px] select-none canvas-pannable-bg ${
                isPanning ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              style={{
                backgroundImage: 'radial-gradient(rgba(180, 192, 210, 0.4) 1px, transparent 0)',
                backgroundSize: '24px 24px',
                backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
              }}
            >
              {/* Floating Canvas Zoom & Pan Control Bar */}
              <div className="absolute bottom-4 right-4 z-30 neuro-flat rounded-full p-1.5 border border-white/90 flex items-center gap-1.5 shadow-lg">
                <button
                  onClick={handleZoomOut}
                  className="w-7 h-7 rounded-full neuro-btn flex items-center justify-center text-[#556377] hover:text-[#ea384c]"
                  title="缩小画布 (Zoom Out)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleResetView}
                  className="px-2.5 py-1 rounded-full neuro-btn text-[10px] font-bold text-[#1f2633] hover:text-[#ea384c]"
                  title="恢复 100% 比例并居中"
                >
                  {Math.round(zoomScale * 100)}%
                </button>

                <button
                  onClick={handleZoomIn}
                  className="w-7 h-7 rounded-full neuro-btn flex items-center justify-center text-[#556377] hover:text-[#ea384c]"
                  title="放大画布 (Zoom In)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <div className="w-[1px] h-4 bg-gray-300 mx-0.5" />

                <button
                  onClick={handleResetView}
                  className="w-7 h-7 rounded-full neuro-btn flex items-center justify-center text-[#556377] hover:text-[#ea384c]"
                  title="居中重置视口"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Breadcrumb Path & Tooltip (Stationary inside top canvas) */}
              <div className="flex items-center justify-between mb-4 z-20 relative pointer-events-none">
                <div className="flex items-center gap-2 text-xs text-[#7c8b9e] pointer-events-auto">
                  <span>创作者大脑</span>
                  <ChevronRight className="w-3 h-3 text-[#9fb0c4]" />
                  <span className="font-semibold text-[#444f61]">24 作品库</span>
                  <ChevronRight className="w-3 h-3 text-[#9fb0c4]" />
                  <span className="font-bold text-[#ea384c]">
                    {selectedWork?.title || 'Opus 3.5 彻底颠覆了我的创作面板'}
                  </span>
                </div>

                <div className="text-[10px] text-[#8391a3] flex items-center gap-1.5 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/80 shadow-sm pointer-events-auto">
                  <Hand className="w-3 h-3 text-[#ea384c]" />
                  <span>按住空白平移 · 滚轮缩放 · 悬停节点流转能量</span>
                </div>
              </div>

              {/* Scalable & Pannable Mind Map Content Container */}
              <div
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                  transformOrigin: '0 0',
                  transition: isPanning ? 'none' : 'transform 0.08s ease-out',
                }}
                className="relative flex items-start gap-12 pt-4 pl-2 min-w-[780px]"
              >
                {/* Dynamic SVG Neural Lines for Mind Map Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                  <defs>
                    <linearGradient id="mindmapPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ea384c" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="activeMindmapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff1744" stopOpacity="1" />
                      <stop offset="100%" stopColor="#ea384c" stopOpacity="0.85" />
                    </linearGradient>
                  </defs>

                  {/* SVG Bezier Lines from Root to Branch 1 & Branch 2 */}
                  <g>
                    {/* Path to Branch 1 */}
                    <path
                      d="M 190 120 C 230 120, 240 50, 270 50"
                      stroke={hoveredLeafId ? 'url(#activeMindmapGrad)' : 'url(#mindmapPulseGrad)'}
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <circle r="3.5" fill="#ea384c">
                      <animateMotion
                        dur={hoveredLeafId ? '1.2s' : '3s'}
                        repeatCount="indefinite"
                        path="M 190 120 C 230 120, 240 50, 270 50"
                      />
                    </circle>

                    {/* Path to Branch 2 */}
                    <path
                      d="M 190 120 C 230 120, 240 370, 270 370"
                      stroke="url(#mindmapPulseGrad)"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <circle r="3" fill="#ea384c">
                      <animateMotion
                        dur="3.8s"
                        repeatCount="indefinite"
                        path="M 190 120 C 230 120, 240 370, 270 370"
                      />
                    </circle>
                  </g>
                </svg>

                {/* Level 1: Category Root Node */}
                <div className="shrink-0 mt-20 z-10">
                  <div className="neuro-flat rounded-2xl p-4 border-2 border-[#ea384c] shadow-lg flex items-center gap-3 w-48 hover:scale-102 transition-transform">
                    <div className="w-8 h-8 rounded-xl bg-[#ea384c] text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                      24
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1f2633]">作品库</h4>
                      <p className="text-[10px] text-[#8e9caf]">全部已发布内容</p>
                    </div>
                  </div>
                </div>

                {/* Level 2: Sub-branches (Draggable groups & re-orderable leaves) */}
                <div className="flex-1 space-y-10 z-10">
                  {mindMapData.children?.map((branch) => {
                    const offset = branchOffsets[branch.id] || { x: 0, y: 0 };
                    const isDraggingBranch = draggingBranchId === branch.id;

                    return (
                      <div
                        key={branch.id}
                        style={{
                          transform: `translate(${offset.x}px, ${offset.y}px)`,
                          transition: isDraggingBranch ? 'none' : 'transform 0.15s ease',
                        }}
                        className="relative"
                      >
                        {/* Branch Header Pill with drag handle */}
                        <div
                          onPointerDown={(e) => handleStartBranchDrag(e, branch.id)}
                          onMouseDown={(e) => handleStartBranchDrag(e, branch.id)}
                          className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl neuro-flat border border-white/90 text-xs font-bold text-[#2d3645] mb-3 cursor-grab active:cursor-grabbing select-none shadow-sm ${
                            isDraggingBranch ? 'ring-2 ring-[#ea384c] shadow-lg' : 'hover:scale-[1.01]'
                          }`}
                        >
                          <GripVertical className="w-3.5 h-3.5 text-[#97a5b7]" />
                          <span className="w-2 h-2 rounded-full bg-[#ea384c]" />
                          <span>{branch.title}</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#ea384c] text-[10px] font-extrabold">
                            {branch.count}
                          </span>
                        </div>

                        {/* Leaf Node Items (Draggable for re-ordering & Neural pulse on hover) */}
                        <div className="ml-6 space-y-2.5 border-l-2 border-red-200/80 pl-4 py-1">
                          {branch.children?.map((leaf, leafIndex) => {
                            const isSelected = selectedLeafId === leaf.id;
                            const isHovered = hoveredLeafId === leaf.id;
                            const isDragOver =
                              dragOverLeafIndex?.branchId === branch.id &&
                              dragOverLeafIndex?.leafIndex === leafIndex;

                            return (
                              <div
                                key={leaf.id}
                                draggable
                                onDragStart={() => handleLeafDragStart(branch.id, leafIndex)}
                                onDragOver={(e) => handleLeafDragOver(e, branch.id, leafIndex)}
                                onDrop={() => handleLeafDrop(branch.id, leafIndex)}
                                onClick={() => handleLeafClick(leaf)}
                                onMouseEnter={() => setHoveredLeafId(leaf.id)}
                                onMouseLeave={() => setHoveredLeafId(null)}
                                className={`group p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between text-xs select-none ${
                                  isSelected
                                    ? 'neuro-flat border-2 border-[#ea384c] shadow-md ring-2 ring-red-100 font-bold'
                                    : isHovered
                                    ? 'neuro-flat border border-[#ea384c]/80 shadow-md scale-[1.015]'
                                    : 'neuro-flat-sm border border-white/80 hover:border-red-200 hover:scale-[1.01]'
                                } ${isDragOver ? 'border-dashed border-2 border-[#ea384c] scale-102 bg-red-50/50' : ''}`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-4">
                                  <GripVertical className="w-3.5 h-3.5 text-[#9cb0c4] opacity-40 group-hover:opacity-100 cursor-grab shrink-0" />
                                  <div className="relative shrink-0 flex items-center justify-center">
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        isSelected || isHovered
                                          ? 'bg-[#ea384c] shadow-[0_0_8px_#ea384c]'
                                          : 'bg-[#98a5b6] group-hover:bg-[#ea384c]'
                                      }`}
                                    />
                                    {isHovered && (
                                      <span className="absolute w-4 h-4 rounded-full bg-red-400/40 animate-ping" />
                                    )}
                                  </div>
                                  <span
                                    className={`truncate text-xs ${
                                      isSelected || isHovered ? 'text-[#191f2c] font-bold' : 'text-[#444e60]'
                                    }`}
                                  >
                                    {leaf.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 text-[11px] text-[#8694a7]">
                                  {leaf.views && (
                                    <span className="px-2 py-0.5 rounded-md bg-gray-100 font-medium">
                                      {leaf.views} 播放
                                    </span>
                                  )}
                                  <span>{leaf.date}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-[#98a6b8] group-hover:text-[#ea384c] transition-colors" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Dock Bar (Frame 0:03 - 0:11) */}
      <div className="z-10 w-full max-w-4xl mx-auto neuro-flat rounded-3xl p-4 border border-white/80 space-y-3 shadow-lg">
        {/* Top row: 4 key counters */}
        <div className="grid grid-cols-4 gap-3 text-center pb-3 border-b border-gray-200/60">
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-xl font-extrabold text-[#191f2c]">46</span>
            <p className="text-[11px] text-[#78869a] font-medium">核心概念</p>
          </div>
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-xl font-extrabold text-[#191f2c]">505</span>
            <p className="text-[11px] text-[#78869a] font-medium">衍生链接</p>
          </div>
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-xl font-extrabold text-[#191f2c]">219</span>
            <p className="text-[11px] text-[#78869a] font-medium">内容资产</p>
          </div>
          <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigateToTab('library')}>
            <span className="text-xl font-extrabold text-[#ea384c]">24</span>
            <p className="text-[11px] text-[#78869a] font-medium">发布作品</p>
          </div>
        </div>

        {/* Bottom row: Ask your graph search box & quick suggestion chips */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCopilotQuery(searchQuery)}
              placeholder="随时提问你的知识库 · Ask your graph..."
              className="w-full neuro-inset text-xs font-medium px-4 py-2.5 rounded-full text-[#1f2633] placeholder-[#8d9baa] border border-white/80 focus:outline-none focus:ring-2 focus:ring-[#ea384c]/50"
            />
            <button
              onClick={() => handleCopilotQuery(searchQuery || '推荐下一篇选题')}
              className="absolute right-1.5 top-1.5 w-7 h-7 rounded-full neuro-btn-red flex items-center justify-center text-white"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
            <button
              onClick={() => handleCopilotQuery('下一篇写什么')}
              className="px-3 py-1 rounded-full neuro-btn text-[11px] font-semibold text-[#505c6f] hover:text-[#ea384c] shrink-0"
            >
              ✨ 下一篇写什么
            </button>
            <button
              onClick={() => handleCopilotQuery('查找未关联笔记')}
              className="px-3 py-1 rounded-full neuro-btn text-[11px] font-semibold text-[#505c6f] hover:text-[#ea384c] shrink-0"
            >
              🔍 孤岛笔记
            </button>
            <button
              onClick={() => handleCopilotQuery('分析互动趋势')}
              className="px-3 py-1 rounded-full neuro-btn text-[11px] font-semibold text-[#505c6f] hover:text-[#ea384c] shrink-0"
            >
              📈 趋势预测
            </button>
          </div>
        </div>

        {/* Copilot Response Bubble if triggered */}
        {copilotAnswer && (
          <div className="p-3 rounded-2xl bg-white/90 border border-red-200 text-xs text-[#2b3341] flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#ea384c] shrink-0 mt-0.5" />
              <p className="leading-relaxed">{copilotAnswer}</p>
            </div>
            <button
              onClick={() => setCopilotAnswer(null)}
              className="text-[#96a3b5] hover:text-black text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Node Inspector Drawer */}
      <NodeInspectorDrawer
        work={selectedWork}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigateToCreative={(work) => {
          setIsDrawerOpen(false);
          if (onSelectWorkForCreative) onSelectWorkForCreative(work);
          onNavigateToTab('creative');
        }}
      />
    </div>
  );
};
