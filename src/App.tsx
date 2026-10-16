/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, WorkItem } from './types';
import { Header } from './components/Header';
import { WorkbenchView } from './components/WorkbenchView';
import { LibraryView } from './components/LibraryView';
import { CreativeView } from './components/CreativeView';
import { InspirationView } from './components/InspirationView';
import { CalendarView } from './components/CalendarView';
import { NewContentModal } from './components/NewContentModal';
import { WORK_ITEMS } from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('workbench');
  const [workbenchMode, setWorkbenchMode] = useState<'orbital' | 'mindmap'>('orbital');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedWorkForCreative, setSelectedWorkForCreative] = useState<WorkItem | null>(WORK_ITEMS[0]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNewContent = (data: any) => {
    showNotification(`成功创建节点「${data.title}」，已自动生成 3 条双向神经链接！`);
  };

  return (
    <div className="min-h-screen bg-[#ebedf2] text-[#1e2229] flex flex-col font-sans selection:bg-[#ea384c] selection:text-white">
      {/* Top Header Navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        workbenchMode={workbenchMode}
        onToggleWorkbenchMode={() =>
          setWorkbenchMode((prev) => (prev === 'orbital' ? 'mindmap' : 'orbital'))
        }
      />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-black/85 backdrop-blur-md text-white text-xs font-semibold shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-[#ea384c] animate-ping" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'workbench' && (
          <WorkbenchView
            mode={workbenchMode}
            onToggleMode={(m) => setWorkbenchMode(m)}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
            onSelectWorkForCreative={(work) => {
              setSelectedWorkForCreative(work);
              setCurrentTab('creative');
            }}
          />
        )}

        {currentTab === 'library' && (
          <LibraryView
            onSelectWorkForCreative={(work) => {
              setSelectedWorkForCreative(work);
              setCurrentTab('creative');
            }}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'creative' && (
          <CreativeView initialWorkRef={selectedWorkForCreative} />
        )}

        {currentTab === 'inspiration' && (
          <InspirationView onNavigateToCreative={() => setCurrentTab('creative')} />
        )}

        {currentTab === 'calendar' && (
          <CalendarView onNavigateToCreative={() => setCurrentTab('creative')} />
        )}
      </main>

      {/* New Content Modal */}
      <NewContentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateNewContent}
      />
    </div>
  );
}
