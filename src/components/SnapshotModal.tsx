import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Download, 
  FileJson, 
  Upload, 
  Share2, 
  Check, 
  Copy, 
  Sparkles, 
  Layers,
  ZoomIn,
  Link2,
  Calendar,
  Eye
} from 'lucide-react';

export interface SnapshotConfig {
  version: string;
  timestamp: string;
  title: string;
  mode: 'orbital' | 'mindmap';
  mindMapLayoutMode?: 'tree' | 'cluster';
  zoomScale: number;
  panOffset: { x: number; y: number };
  satellitePositions: Record<string, { x: number; y: number }>;
  relationLabels: Record<string, { label: string; type: string; color: string }>;
  connectionStrengths: Record<string, number>;
  clusteredNodes?: any[];
  distilledSummaries?: Record<string, { summary: string; timestamp: number }>;
  stats: {
    totalNodes: number;
    totalConnections: number;
    activeRelations: number;
  };
}

interface SnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: SnapshotConfig;
  onImportConfig: (config: SnapshotConfig) => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onImportConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'json' | 'import'>('export');
  const [isCopied, setIsCopied] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle PNG Export via high-resolution canvas drawing
  const handleExportPNG = () => {
    setIsExportingImage(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Neumorphic Background
      const bgGrad = ctx.createRadialGradient(800, 500, 50, 800, 500, 900);
      bgGrad.addColorStop(0, '#f0f3f8');
      bgGrad.addColorStop(1, '#dfe5ed');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1000);

      // Grid dots
      ctx.fillStyle = 'rgba(160, 175, 195, 0.25)';
      for (let x = 40; x < 1600; x += 40) {
        for (let y = 40; y < 1000; y += 40) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Draw Header & Watermark
      ctx.fillStyle = '#191f2c';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('KUAN NEURAL STUDIO | 创作者数字化大脑快照', 60, 70);

      ctx.fillStyle = '#ea384c';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('让每一条链接，双向生长。', 60, 105);

      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText(`快照生成时间: ${new Date().toLocaleString()} | 视口缩放: ${Math.round(currentConfig.zoomScale * 100)}% | 视图形态: ${currentConfig.mode === 'orbital' ? '星系轨道' : '思维导图'}`, 60, 135);

      // 3. Central Core representation
      const centerX = 800;
      const centerY = 540;

      // Glow behind core
      const coreGlow = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 180);
      coreGlow.addColorStop(0, 'rgba(234, 56, 76, 0.35)');
      coreGlow.addColorStop(0.7, 'rgba(234, 56, 76, 0.08)');
      coreGlow.addColorStop(1, 'rgba(234, 56, 76, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
      ctx.fill();

      // Connections and satellite nodes
      const satellites = [
        { id: 'arch', name: '核心架构 (19)', x: centerX + (currentConfig.satellitePositions.arch?.x || 0) * 1.5, y: centerY + (currentConfig.satellitePositions.arch?.y || -220) * 1.3, color: '#0284c7' },
        { id: 'library', name: '作品库 (24)', x: centerX + (currentConfig.satellitePositions.library?.x || -290) * 1.5, y: centerY + (currentConfig.satellitePositions.library?.y || -10) * 1.3, color: '#8b5cf6' },
        { id: 'ideas', name: '灵感卡片 (11)', x: centerX + (currentConfig.satellitePositions.ideas?.x || -220) * 1.5, y: centerY + (currentConfig.satellitePositions.ideas?.y || 180) * 1.3, color: '#10b981' },
        { id: 'drafts', name: '创作草稿 (6)', x: centerX + (currentConfig.satellitePositions.drafts?.x || 270) * 1.5, y: centerY + (currentConfig.satellitePositions.drafts?.y || -120) * 1.3, color: '#f59e0b' },
        { id: 'scheduled', name: '待发布 (5)', x: centerX + (currentConfig.satellitePositions.scheduled?.x || 230) * 1.5, y: centerY + (currentConfig.satellitePositions.scheduled?.y || 170) * 1.3, color: '#ea384c' },
      ];

      // Draw connection lines with relationship labels
      satellites.forEach((sat) => {
        ctx.strokeStyle = 'rgba(234, 56, 76, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const midX = (centerX + sat.x) / 2;
        const midY = (centerY + sat.y) / 2 - 20;
        ctx.quadraticCurveTo(midX, midY, sat.x, sat.y);
        ctx.stroke();

        // Relation label badge
        const rel = currentConfig.relationLabels[sat.id];
        if (rel) {
          ctx.fillStyle = '#1e293b';
          ctx.roundRect ? ctx.roundRect(midX - 32, midY - 14, 64, 26, 8) : ctx.fillRect(midX - 32, midY - 14, 64, 26);
          ctx.fill();
          ctx.strokeStyle = rel.color || '#ea384c';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(rel.label, midX, midY);
        }

        // Draw node card on canvas
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 6;
        const cardW = 160;
        const cardH = 50;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(sat.x - cardW / 2, sat.y - cardH / 2, cardW, cardH, 14);
        } else {
          ctx.rect(sat.x - cardW / 2, sat.y - cardH / 2, cardW, cardH);
        }
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Border
        ctx.strokeStyle = sat.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node text
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sat.name, sat.x, sat.y);
      });

      // Draw Center Hub
      ctx.fillStyle = '#191f2c';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ea384c';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('神经中枢骨干', centerX, centerY - 8);
      ctx.fillStyle = '#ea384c';
      ctx.font = '12px sans-serif';
      ctx.fillText('505 衍生链接', centerX, centerY + 14);

      // 4. Download Trigger
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `kuan-neural-snapshot-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('PNG export failed', e);
    } finally {
      setIsExportingImage(false);
    }
  };

  // Handle JSON Export
  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(currentConfig, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `kuan-neural-config-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handle Copy Slice Markdown
  const handleCopySlice = () => {
    const summaryText = `### 🧠 KUAN NEURAL STUDIO | 知识图谱快照切片
- **生成时间**：${new Date(currentConfig.timestamp).toLocaleString()}
- **视口模式**：${currentConfig.mode === 'orbital' ? '星系轨道神经态' : '思维导图层级态'}
- **缩放比例**：${Math.round(currentConfig.zoomScale * 100)}%
- **核心骨干节点**：${currentConfig.stats.totalNodes} 个
- **双向生长链接**：${currentConfig.stats.totalConnections} 条
- **自定义语义标签**：${Object.entries(currentConfig.relationLabels)
      .map(([k, v]) => `[${k} -> ${v.label}]`)
      .join(', ')}

*Every link grows both ways.*`;

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle Import JSON File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.satellitePositions || parsed.relationLabels || parsed.version) {
          onImportConfig(parsed);
          setImportSuccess(true);
          setImportError(null);
          setTimeout(() => {
            setImportSuccess(false);
            onClose();
          }, 1200);
        } else {
          setImportError('JSON 配置文件格式不符，缺少节点坐标或关系数据');
        }
      } catch (err: any) {
        setImportError(`JSON 解析失败: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyPastedJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      onImportConfig(parsed);
      setImportSuccess(true);
      setImportError(null);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setImportError(`JSON 格式错误: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl neuro-flat rounded-3xl p-6 border border-white/90 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#ea384c] to-[#ff6b81] text-white flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191f2c]">生成与归档知识快照</h3>
              <p className="text-xs text-[#718096]">
                导出高分辨率视觉切片、下载 JSON 布局拓扑或恢复历史切片
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8d9baa] hover:text-[#191f2c] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-2xl neuro-inset text-xs font-bold">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-white shadow text-[#ea384c]'
                : 'text-[#627083] hover:text-black'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出高清图片 / 切片</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'json'
                ? 'bg-white shadow text-[#ea384c]'
                : 'text-[#627083] hover:text-black'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON 配置文件</span>
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-white shadow text-[#ea384c]'
                : 'text-[#627083] hover:text-black'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>导入历史快照</span>
          </button>
        </div>

        {/* Tab 1: Export Image & Summary */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            {/* Snapshot Preview Card */}
            <div className="p-4 rounded-2xl neuro-inset bg-gradient-to-br from-white/60 to-gray-50/80 border border-white/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#191f2c] flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#ea384c]" />
                  <span>当前画布切片拓扑</span>
                </span>
                <span className="text-[11px] text-[#718096] font-mono">
                  {new Date(currentConfig.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Snapshot Stats Grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white/80 border border-gray-100 shadow-xs">
                  <div className="text-[10px] text-[#8695a8] font-medium">当前视图模式</div>
                  <div className="text-xs font-bold text-[#191f2c] mt-0.5">
                    {currentConfig.mode === 'orbital' ? '星系轨道' : '思维导图'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-gray-100 shadow-xs">
                  <div className="text-[10px] text-[#8695a8] font-medium">视口缩放比</div>
                  <div className="text-xs font-bold text-[#ea384c] mt-0.5">
                    {Math.round(currentConfig.zoomScale * 100)}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-gray-100 shadow-xs">
                  <div className="text-[10px] text-[#8695a8] font-medium">知识节点数</div>
                  <div className="text-xs font-bold text-[#191f2c] mt-0.5">
                    {currentConfig.stats.totalNodes} 核心点
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-gray-100 shadow-xs">
                  <div className="text-[10px] text-[#8695a8] font-medium">语义连线数</div>
                  <div className="text-xs font-bold text-[#0284c7] mt-0.5">
                    {currentConfig.stats.totalConnections} 条关系
                  </div>
                </div>
              </div>

              {/* Semantic Relations pill previews */}
              <div className="pt-2 border-t border-gray-200/50">
                <div className="text-[10px] text-[#8492a5] mb-1.5 font-bold">已标记的语义关系标签:</div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(currentConfig.relationLabels).map(([id, rel]) => (
                    <span 
                      key={id}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: rel.color || '#ea384c' }}
                    >
                      {id}: {rel.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleExportPNG}
                disabled={isExportingImage}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#ea384c] to-[#ff4757] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{isExportingImage ? '正在渲染高清快照...' : '导出高分辨率图片 (PNG)'}</span>
              </button>

              <button
                onClick={handleCopySlice}
                className="py-3 px-4 rounded-2xl neuro-btn text-xs font-bold text-[#445062] hover:text-[#ea384c] flex items-center gap-1.5 border border-white/80 shadow-sm transition-all"
              >
                {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                <span>{isCopied ? '已复制快照切片' : '复制切片分享文本'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: JSON Configuration View & Export */}
        {activeTab === 'json' && (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl neuro-inset bg-gray-900 text-gray-200 font-mono text-[11px] max-h-56 overflow-y-auto space-y-1">
              <pre className="text-gray-300">
                {JSON.stringify(
                  {
                    version: currentConfig.version,
                    timestamp: currentConfig.timestamp,
                    mode: currentConfig.mode,
                    zoomScale: currentConfig.zoomScale,
                    panOffset: currentConfig.panOffset,
                    satellitePositions: currentConfig.satellitePositions,
                    relationLabels: currentConfig.relationLabels,
                    connectionStrengths: currentConfig.connectionStrengths,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex items-center justify-between text-xs text-[#718096]">
              <span>包含完整节点空间坐标、语义连线、能量脉冲频率与视口参数</span>
              <button
                onClick={handleExportJSON}
                className="py-2.5 px-4 rounded-xl bg-[#191f2c] text-white font-bold text-xs flex items-center gap-2 hover:bg-black transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 JSON 配置文件</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Import JSON */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#2d3748] flex items-center justify-between">
                <span>粘贴 JSON 配置代码或直接上传文件</span>
                <span className="text-[10px] text-[#718096]">支持恢复过往排版与语义标签</span>
              </label>
              <textarea
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="在此粘贴 .json 快照配置内容..."
                rows={5}
                className="w-full p-3 rounded-2xl neuro-inset text-xs font-mono border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-[#ea384c]"
              />
            </div>

            {importError && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                {importError}
              </div>
            )}

            {importSuccess && (
              <div className="p-2.5 rounded-xl bg-green-50 text-green-700 text-xs font-medium border border-green-200 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-600" />
                <span>快照配置导入成功！正在应用画布布局与语义标签...</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-4 rounded-xl neuro-btn text-xs font-bold text-[#445062] hover:text-[#191f2c] flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>从本地文件加载 (.json)</span>
              </button>

              <button
                onClick={handleApplyPastedJson}
                disabled={!importJsonText.trim()}
                className="py-2.5 px-5 rounded-xl bg-[#ea384c] text-white text-xs font-bold hover:bg-red-600 disabled:opacity-40 transition-all shadow-md"
              >
                应用快照排版
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
