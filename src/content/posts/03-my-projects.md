---
title: 我的项目们 🚀
published: 2026-06-02
description: '整理一下目前做过的一些项目——从航天模拟器 MOD 到 AI 工具，从 API 采集到学习应用。'
image: ''
tags: ['项目']
category: ''
draft: false 
lang: ''
---

趁着刚开始写博客的热乎劲，把之前做的项目整理一下。

大部分项目都是因为"诶这个好像挺有意思"就开干了，所以种类有点杂（但这也挺符合我兴趣广泛的风格对吧 😅）。下面按类别来列一下。

## 航天模拟器相关

这一块应该是数量最多的，毕竟我本来就喜欢航天模拟类游戏，加上自己也会写代码，那自然就是——**给我玩的游戏写 MOD**。

### ConsoleMOD

**SFS（Spaceflight Simulator）的一个模组，给游戏控制台增加了更多命令。**

原版游戏的控制台功能比较基础，这个 MOD 加了不少实用指令，方便调试和扩展。用 C# 写的，基于游戏的模组框架。

🔗 [GitHub](https://github.com/DarkSpaceY/ConsoleMOD)

### FrameRateLockMod

**另一个 Unity 模组，锁定应用帧率并同步物理时间步长。**

玩航天模拟器的时候帧率波动会影响物理计算的稳定性（尤其是火箭飞起来之后），这个模组就是解决这个问题的。把帧率锁在你想要的值，同时让物理引擎的时间步长跟着对齐。

🔗 [GitHub](https://github.com/DarkSpaceY/FrameRateLockMod)

### PySFS

**SFS 的 Python 工具库。**

算是一个辅助工具集，用 Python 和 SFS 游戏数据进行交互。目前 star 最多（4个，别笑），说明还是有人需要的吧（大概）。

🔗 [GitHub](https://github.com/DarkSpaceY/PySFS)

## AI / LLM 相关

### Ollama-mindmap

**基于本地 Ollama 模型的思维导图生成工具。**

早期做的一个小工具，通过本地运行的 Ollama 模型（不需要联网，数据都在本地），把输入的内容自动生成思维导图。Python 写的，算是我在 LLM 应用方面的第一次尝试。

🔗 [GitHub](https://github.com/DarkSpaceY/Ollama-mindmap)

### Agent-WorkFlow

**AI Agent 工作流框架。**

用 Python 写的一个 Agent 编排框架。具体来说就是定义 Agent 的执行流程、任务分配之类的。目前还在早期阶段，之后有更多进展再详细写。

🔗 [GitHub](https://github.com/DarkSpaceY/Agent-WorkFlow)

### CAA-based-emoAI

**基于 CAA（Concept Activation Attribution）的情感强化 LLM 交互工具。**

这个项目的核心想法是：通过 CAA 概念向量给大模型添加"情感激活加成"——让 AI 在回应时能够理解和带入特定的情感维度（愉悦/悲伤/愤怒/恐惧/中立）。实现了 5 种情绪触发模式（DA/SE/OX/COR/NE），支持 CLI 交互、探索模式、以及自定义配置文件。

技术栈上基于 HuggingFace Transformers，用 PyTorch 做向量计算。算是我在 AI 情感/人格控制方面的一次实践尝试。

🔗 [GitHub](https://github.com/DarkSpaceY/CAA-based-emoAI)

### NexLearn

**AI for Education 方向的交互式学习应用，用 TypeScript 写的。**

GitHub 上目前是 v1.0，但实际上我已经在本地重写到了 v2.0——页面和操作逻辑全都改了一遍。等差不多了再推上来。

🔗 [GitHub](https://github.com/DarkSpaceY/NexLearn)

---

## 还有一些在本地躺着的……

除了上面这些，本地还有不少做到一半的项目——怎么说呢，就是"想法很丰满，实现到一半发现下一个想法更诱人"的那种状态 🤷。之后慢慢整理，做完了再补上来。

如果你对哪个项目感兴趣，欢迎来 GitHub 上聊聊（或者提 issue 催更也 ok）。下一篇见～ 🚀
