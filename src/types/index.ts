export type TabType = 'workbench' | 'library' | 'creative' | 'inspiration' | 'calendar';

export interface WorkItem {
  id: string;
  title: string;
  category: string;
  type: 'video' | 'article' | 'review';
  cover: string;
  publishDate: string;
  views: number;
  likes: number;
  comments: number;
  bookmarks: number;
  completionRate?: string;
  interactionRate: string;
  summary: string;
  linksCount: number;
  backlinksCount: number;
  platformSplit?: {
    platform: string;
    percentage: number;
    color: string;
  }[];
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
}

export interface MindMapNode {
  id: string;
  title: string;
  type: 'category' | 'branch' | 'leaf';
  count?: number;
  views?: string;
  likes?: number;
  date?: string;
  active?: boolean;
  workId?: string;
  children?: MindMapNode[];
}

export interface SatelliteNode {
  id: string;
  name: string;
  count: number;
  desc: string;
  angle: number; // in degrees around the core
  distance: number; // radius from center
  color?: string;
}

export interface IdeaItem {
  id: string;
  title: string;
  content: string;
  column: 'inbox' | 'thinking' | 'ready';
  tag: string;
  tagColor: string;
  date: string;
  linkedWorkTitle?: string;
  sourceUrl?: string;
}

export interface DraftDoc {
  id: string;
  title: string;
  category: string;
  wordCount: number;
  updatedAt: string;
  status: 'draft' | 'polishing' | 'ready';
  tags: string[];
  content: string;
  linkedNotes: {
    id: string;
    title: string;
    type: string;
    matchScore: number;
  }[];
}

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  title: string;
  type: 'video' | 'article';
  views?: number;
  likes?: number;
  status: 'published' | 'scheduled';
  cover?: string;
}
