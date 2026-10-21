import React, { useState } from 'react';
import { 
  X, 
  Tag, 
  Zap, 
  Trash2, 
  Check, 
  ArrowRight, 
  Sparkles,
  Flame,
  Activity
} from 'lucide-react';

export interface RelationLabelData {
  label: string;
  type: string;
  color: string;
}

interface RelationLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  sourceNodeName: string;
  targetNodeName: string;
  currentLabel?: RelationLabelData;
  currentStrength: number;
  onSaveLabel: (connectionId: string, data: RelationLabelData) => void;
  onRemoveLabel: (connectionId: string) => void;
  onBoostStrength: (connectionId: string) => void;
}

const PRESET_RELATIONS: { label: string; type: string; color: string; desc: string }[] = [
  { label: '定义', type: 'define', color: '#0284c7', desc: '界定基础概念与公理' },
  { label: '包含', type: 'contains', color: '#10b981', desc: '子集拆解与模块归属' },
  { label: '衍生', type: 'derive', color: '#8b5cf6', desc: '思想外延与二次创作' },
  { label: '反驳', type: 'refute', color: '#ef4444', desc: '批判反思与边界界定' },
  { label: '参考', type: 'reference', color: '#f59e0b', desc: '灵感借鉴与双向反链' },
  { label: '飞轮驱动', type: 'flywheel', color: '#ea384c', desc: '商业增长与自动化飞轮' },
  { label: '协同演化', type: 'synergy', color: '#ec4899', desc: '双脑联动与多维协同' },
];

export const RelationLabelModal: React.FC<RelationLabelModalProps> = ({
  isOpen,
  onClose,
  connectionId,
  sourceNodeName,
  targetNodeName,
  currentLabel,
  currentStrength,
  onSaveLabel,
  onRemoveLabel,
  onBoostStrength,
}) => {
  const [selectedLabel, setSelectedLabel] = useState(currentLabel?.label || '衍生');
  const [selectedType, setSelectedType] = useState(currentLabel?.type || 'derive');
  const [selectedColor, setSelectedColor] = useState(currentLabel?.color || '#8b5cf6');
  const [customText, setCustomText] = useState(currentLabel?.label || '');

  if (!isOpen) return null;

  // Pulse speed formula: duration in seconds
  const pulseDuration = Math.max(0.65, 3.2 - currentStrength * 0.28).toFixed(2);
  const pulseSpeedMultiple = (3.2 / parseFloat(pulseDuration)).toFixed(1);

  const handleSelectPreset = (preset: typeof PRESET_RELATIONS[0]) => {
    setSelectedLabel(preset.label);
    setSelectedType(preset.type);
    setSelectedColor(preset.color);
    setCustomText(preset.label);
  };

  const handleSave = () => {
    const finalLabel = customText.trim() || selectedLabel;
    onSaveLabel(connectionId, {
      label: finalLabel,
      type: selectedType,
      color: selectedColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md neuro-flat rounded-3xl p-6 border border-white/90 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-md transition-colors"
              style={{ backgroundColor: selectedColor }}
            >
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191f2c]">设定连线语义关系</h3>
              <p className="text-[11px] text-[#78889b]">
                双向链接语义化与连接活跃度调控
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8d9baa] hover:text-[#191f2c] hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Connection Flow Visual */}
        <div className="p-3 rounded-2xl neuro-inset bg-gradient-to-r from-gray-50 to-white flex items-center justify-between text-xs font-bold text-[#1f2633] border border-white/80">
          <span className="truncate max-w-[120px] text-left">{sourceNodeName}</span>
          <div className="flex flex-col items-center gap-0.5 px-3">
            <div 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-xs"
              style={{ backgroundColor: selectedColor }}
            >
              {customText.trim() || selectedLabel}
            </div>
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#ea384c] to-transparent my-0.5" />
          </div>
          <span className="truncate max-w-[120px] text-right">{targetNodeName}</span>
        </div>

        {/* Pulse Speed / Strength Indicator (Algorithm) */}
        <div className="p-3 rounded-2xl neuro-flat-sm border border-white/90 space-y-2 bg-gradient-to-br from-white/70 to-red-50/30">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#2d3748] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#ea384c]" />
              <span>神经能量流速算法</span>
            </span>
            <span className="text-[11px] font-extrabold text-[#ea384c]">
              {pulseSpeedMultiple}x 流速 ({pulseDuration}s/周期)
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#69788d]">
            <span>当前访问与引用权重: <strong>{currentStrength}</strong> 次</span>
            <button
              onClick={() => onBoostStrength(connectionId)}
              className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-[#ea384c] font-bold border border-red-200/60 flex items-center gap-1 transition-all text-[10px]"
            >
              <Zap className="w-3 h-3 text-[#ea384c]" />
              <span>+1 激活流速</span>
            </button>
          </div>

          <div className="w-full bg-gray-200/70 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#ea384c] to-[#ff6b81] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, currentStrength * 10)}%` }}
            />
          </div>
        </div>

        {/* Preset Relation Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#2d3748]">
            选择预设语义关系:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_RELATIONS.map((preset) => {
              const isSelected = selectedLabel === preset.label;
              return (
                <button
                  key={preset.label}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 border ${
                    isSelected
                      ? 'border-transparent text-white shadow-md scale-102'
                      : 'neuro-btn border-white/80 text-[#4c596d] hover:text-black'
                  }`}
                  style={isSelected ? { backgroundColor: preset.color } : {}}
                >
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#2d3748]">
            或输入自定义关系名称:
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="例如：反向推导、前置基础、飞轮反哺..."
            className="w-full p-2.5 rounded-xl neuro-inset text-xs font-medium border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#ea384c]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200/80">
          {currentLabel ? (
            <button
              onClick={() => {
                onRemoveLabel(connectionId);
                onClose();
              }}
              className="py-2 px-3 rounded-xl text-xs text-red-500 hover:bg-red-50 flex items-center gap-1 font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清除标签</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl neuro-btn text-xs font-semibold text-[#5a677a]"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-5 rounded-xl bg-[#ea384c] text-white text-xs font-bold hover:bg-red-600 transition-all shadow-md flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>保存关系</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
