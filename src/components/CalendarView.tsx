import React, { useState } from 'react';
import { CALENDAR_EVENTS } from '../data/mockData';
import { CalendarEvent } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Eye, 
  Heart, 
  BarChart2, 
  Clock, 
  Sparkles,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface CalendarViewProps {
  onNavigateToCreative?: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigateToCreative }) => {
  const [selectedDay, setSelectedDay] = useState<number>(6);
  const [currentMonth, setCurrentMonth] = useState('2026年10月');

  // October 2026 calendar starts on Thursday (index 4 in 1-7)
  // Let's create the 31 days with padding
  const totalDays = 31;
  const startDayOffset = 3; // Thursday (Mon=0, Tue=1, Wed=2, Thu=3)

  const activeEvent = CALENDAR_EVENTS.find((e) => e.dayNumber === selectedDay);

  return (
    <div className="w-full min-h-[calc(100vh-65px)] px-8 py-6 flex flex-col justify-between">
      {/* Top Header (Frame 0:25 - 0:29) */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neuro-flat-sm border border-white/70 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#ea384c]" />
          <span className="text-[11px] font-bold tracking-wider text-[#495467] uppercase">
            CALENDAR · 日历
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#191f2c] tracking-tight">
          把节奏，摊在日历上。
        </h1>
        <p className="text-xs text-[#8a98ab] font-medium tracking-wide mt-1 font-mono">
          Publishing rhythm day by day — and what's planned next.
        </p>

        {/* 4 Stats Cards (Frame 0:26) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="neuro-flat rounded-2xl p-4 border border-white/80">
            <p className="text-[11px] font-bold text-[#8492a5] uppercase tracking-wider">本月累计发布</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#191f2c]">9</span>
              <span className="text-xs text-[#8e9caf] font-bold">篇作品</span>
            </div>
          </div>
          <div className="neuro-flat rounded-2xl p-4 border border-white/80">
            <p className="text-[11px] font-bold text-[#8492a5] uppercase tracking-wider">本月曝光总量</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#ea384c]">152,865</span>
              <span className="text-xs text-emerald-600 font-bold">+28%</span>
            </div>
          </div>
          <div className="neuro-flat rounded-2xl p-4 border border-white/80">
            <p className="text-[11px] font-bold text-[#8492a5] uppercase tracking-wider">平均发文速度</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#191f2c]">1.0</span>
              <span className="text-xs text-[#8e9caf] font-bold">篇 / 周</span>
            </div>
          </div>
          <div className="neuro-flat rounded-2xl p-4 border border-white/80">
            <p className="text-[11px] font-bold text-[#8492a5] uppercase tracking-wider">最佳发布窗口</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#191f2c]">周日 18:00</span>
              <span className="text-xs text-[#ea384c] font-bold">完播率峰值</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area: Calendar Grid on Left + Selected Day Panel on Right */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start">
        {/* Calendar Grid Container */}
        <div className="flex-1 neuro-flat rounded-3xl p-6 border border-white/80 space-y-4 w-full shadow-sm">
          {/* Calendar Header Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200/70">
            <div className="flex items-center gap-3">
              <span className="text-base font-extrabold text-[#191f2c]">{currentMonth}</span>
              <span className="text-xs font-mono text-[#8a97aa]">October 2026</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="neuro-btn p-1.5 rounded-xl text-[#526074]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="neuro-btn px-3 py-1 rounded-xl text-xs font-semibold text-[#1f2633]">
                今天
              </button>
              <button className="neuro-btn p-1.5 rounded-xl text-[#526074]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-[#718095]">
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
            <span className="text-[#ea384c]">日</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2.5">
            {/* Empty offset days for start of month */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 rounded-2xl opacity-20 neuro-inset" />
            ))}

            {/* October 1 to 31 */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1;
              const isSelected = selectedDay === day;
              const event = CALENDAR_EVENTS.find((e) => e.dayNumber === day);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-22 p-2 rounded-2xl cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'neuro-flat border-2 border-[#ea384c] ring-2 ring-red-100 shadow-md font-bold'
                      : 'neuro-flat-sm border border-white/80 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs ${
                        isSelected ? 'text-[#ea384c] font-black' : 'text-[#354051]'
                      }`}
                    >
                      {day}
                    </span>
                    {event && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          event.status === 'published'
                            ? 'bg-[#ea384c] shadow-[0_0_6px_#ea384c]'
                            : 'bg-indigo-400'
                        }`}
                      />
                    )}
                  </div>

                  {/* Day Content Badges */}
                  {event ? (
                    <div className="mt-1">
                      <div className="p-1 rounded-lg bg-red-50/80 border border-red-100 text-[10px] text-[#ea384c] line-clamp-1 font-semibold">
                        {event.title}
                      </div>
                      {event.views && (
                        <span className="text-[9px] text-[#8e9caf] block mt-0.5">
                          {(event.views / 1000).toFixed(1)}k 播放
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-[10px] text-transparent hover:text-[#a0adc0] transition-colors">
                      + 排期
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Panel for Selected Day (Frame 0:27 - 0:29) */}
        <div className="w-full lg:w-[380px] neuro-flat rounded-3xl p-5 border border-white/80 space-y-4 shrink-0 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200/60">
            <span className="text-xs font-bold text-[#353f4f]">
              10月{selectedDay}日 详细排期与复盘
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-[#ea384c] font-bold">
              {activeEvent ? '有发文安排' : '空闲日'}
            </span>
          </div>

          {activeEvent ? (
            <div className="space-y-3">
              {activeEvent.cover && (
                <div className="rounded-2xl overflow-hidden neuro-inset p-1">
                  <img
                    src={activeEvent.cover}
                    alt={activeEvent.title}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-[#191f2c] leading-snug">
                  {activeEvent.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#718095]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#ea384c]" /> 14:30 发布
                  </span>
                  <span>·</span>
                  <span className="text-emerald-600 font-bold">
                    {activeEvent.status === 'published' ? '已正式发布' : '排期审核完毕'}
                  </span>
                </div>
              </div>

              {/* Stats for this day */}
              {activeEvent.views && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="neuro-inset rounded-xl p-2.5 text-center">
                    <span className="text-[10px] text-[#8e9caf] block">播放 / 阅读</span>
                    <span className="text-base font-extrabold text-[#191f2c]">
                      {activeEvent.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="neuro-inset rounded-xl p-2.5 text-center">
                    <span className="text-[10px] text-[#8e9caf] block">互动点赞</span>
                    <span className="text-base font-extrabold text-[#ea384c]">
                      {activeEvent.likes?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2 neuro-inset rounded-2xl">
              <CalendarIcon className="w-8 h-8 text-[#98a6b8] mx-auto opacity-60" />
              <p className="text-xs text-[#6e7b8f]">该日期暂无发布排期</p>
              <p className="text-[10px] text-[#98a7b9]">可从灵感池选择已就绪卡片排期到今天</p>
            </div>
          )}

          {/* Weekly Rhythm Sparkline / Chart (Frame 0:27 - 0:29) */}
          <div className="neuro-flat-sm rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#353f4f]">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-[#ea384c]" />
                每周节奏 (Weekly rhythm)
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">稳定输出</span>
            </div>

            {/* Bar Chart Columns for 7 days */}
            <div className="flex items-end justify-between h-20 pt-4 px-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 bg-gray-200 rounded-t-md h-8" />
                <span className="text-[9px] text-[#8e9caf]">一</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 bg-[#ea384c] rounded-t-md h-14" />
                <span className="text-[9px] text-[#ea384c] font-bold">二</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 bg-gray-200 rounded-t-md h-6" />
                <span className="text-[9px] text-[#8e9caf]">三</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 bg-gray-200 rounded-t-md h-10" />
                <span className="text-[9px] text-[#8e9caf]">四</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 bg-gray-200 rounded-t-md h-5" />
                <span className="text-[9px] text-[#8e9caf]">五</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 bg-gray-300 rounded-t-md h-12" />
                <span className="text-[9px] text-[#8e9caf]">六</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-4 bg-gradient-to-t from-[#ea384c] to-[#ff6b6b] rounded-t-md h-16 shadow-sm" />
                <span className="text-[9px] text-[#ea384c] font-extrabold">日</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onNavigateToCreative}
            className="w-full neuro-btn-red py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>为 10月{selectedDay}日 排期新内容</span>
          </button>
        </div>
      </div>
    </div>
  );
};
