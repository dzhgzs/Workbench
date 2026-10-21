import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI if GEMINI_API_KEY is configured
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API endpoint for AI distillation
app.post('/api/ai/distill', async (req, res) => {
  try {
    const { id, title, content, category, tags } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (ai) {
      try {
        const prompt = `你是一个创作者知识图谱与第二大脑系统专家。请针对以下知识节点的笔记内容进行深度提炼，生成一段极具洞察力、凝练精辟的核心认知摘要（30到45字之间），直击知识的本质逻辑与行动指南：
【节点名称】：${title}
【所属主题】：${category || '核心知识库'}
【相关标签】：${Array.isArray(tags) ? tags.join(', ') : (tags || '思维模型')}
【笔记详情】：${content || title}

要求：直接输出一段精炼文字，不要带任何前缀标号或引号。`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const summary = response.text?.trim();
        if (summary) {
          return res.json({ summary, source: 'gemini' });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using heuristic distillation:', geminiError?.message);
      }
    }

    // Heuristic fallback distillation for fast instant feedback & robustness
    const fallbackDistillations: Record<string, string> = {
      'opus-35-node': '通过自动化多模型工作流，将知识摄入至产出周期压缩60%，构筑创作者的高吞吐量个人数字杠杆。',
      'ai-prompt-node': '摒弃表面提示词咒语，以约束条件、意图解构与上下文工程构筑不可替代的深度认知护城河。',
      'vibe-coding-node': '打破传统编码与直觉边界，借助AI极速试错原型，实现从偶发灵感到全功能上线产品的飞轮。',
      'code-dead-node': '工程师从语法实现者跃升为高阶系统架构师与价值定义者，全局架构力成为最持久的终局价值。',
      'workflow-2024-node': '打通灵感捕获、双向反链与多平台发布闭环，使沉睡的历史笔记转变为自动增值的动态智库。',
      'obsidian-cursor-node': '双大脑联动架构：Obsidian负责原子认知沉淀，Cursor实现敏捷调取与智能化创作协同。',
      'zettelkasten-node': '打破传统树形分类固化，通过知识原子卡片网状双向涌现自组织，形成高互动生长的思考网络。',
      'reading-method-node': '拒绝被动翻阅，以既有知识图谱交汇点为锚进行穿透式榨取，即刻转化为可复用的行动卡片。',
      'solopreneur-node': '以数字化知识资产为核心杠杆，将认知产品化与自动化分发，实现零边际成本的个人商业闭环。',
      'creator-burnout-node': '解耦创作心智负担，通过模块化灵感卡片池与节奏化排期缓冲，建立反脆弱的可持续创作机制。',
      '19 核心架构': '系统知识骨干与核心基石认知，连接五大关键子领域，主导整体知识体系的双向滋养。',
      '24 作品库': '已发布的成熟视频与图文资产，是向外部世界交付影响力的商业飞轮实体。',
      '11 灵感卡片': '碎片化火花与偶发思考的收集缓冲池，经由双向链接持续沉淀为长青原子笔记。',
      '6 创作草稿': '处于打磨阶段的半成品内容，融合多源参考反链，正向成品阶段快速演化。',
      '5 待发布': '排期中已锁定的发布队列，衔接内容日历与多平台分发调度。'
    };

    const localSummary = (id && fallbackDistillations[id]) || fallbackDistillations[title] || 
      `【核心要义】围绕「${title}」：重构知识流转闭环，将碎片经验转化为可复利的第二大脑认知资产。`;

    return res.json({ summary: localSummary, source: 'heuristic' });
  } catch (error: any) {
    console.error('Distill error:', error);
    res.status(500).json({ error: error.message || 'Distill failed' });
  }
});

async function startServer() {
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      host: '0.0.0.0',
    },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Neural Studio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
