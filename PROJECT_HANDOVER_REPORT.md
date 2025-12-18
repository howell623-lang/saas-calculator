# 项目移交报告：Micro SaaS Calculator Factory

## 1. 项目概览
本项目是一个基于 **Next.js (App Router)** 和 **Tailwind CSS** 构建的自动化计算器工厂。它通过 JSON 配置文件驱动，能够快速生成 SEO 友好的计算器页面，并集成了 Google AdSense 广告和 Python 自动化工具。

## 2. 当前进度总结
项目已进入稳定运行阶段，核心功能已全部实现：

### 核心架构
- **数据驱动**：所有计算器逻辑、SEO 元数据和 FAQ 均存储在 `app/data/tools/*.json`。
- **动态路由**：采用 Next.js 动态路由 `/[slug]`，实现零代码增加新页面。
- **SEO 优化**：自动生成的 `sitemap.ts` 和 `robots.ts` 确保新工具能被搜索引擎快速抓取。

### 自动化能力
- **Python 脚本 (`generate_tools.py`)**：支持 Mock 模式和 Gemini AI 模式，可自动生成符合 Schema 的计算器 JSON。
- **趋势抓取**：支持从 Google News RSS 获取热门话题并自动生成相关工具。
- **每日自动运行**：集成 shell 脚本和 GitHub Actions，实现每日定时生成、提交并推送新工具。

### 商业化集成
- **Google AdSense**：已完成技术集成，包括 `layout.tsx` 的全局脚本、`AdSlot` 组件、`ads.txt` 以及广告开关（AdsToggle）。
- **状态确认**：AdSense 后台已显示为“已启用”，广告位已在首页和工具页正确布局。

---

## 3. 后续开发 SOP (标准作业程序)

### A. 增加新计算器（手动）
1. 在 `app/data/tools/` 目录下创建一个新的 `.json` 文件。
2. 确保 `slug` 唯一，且 `formula` 逻辑正确。
3. 运行 `npm run dev` 在本地预览效果。
4. 提交并推送至 GitHub，Vercel 会自动部署。

### B. 自动化生成（AI 模式）
1. 确保环境变量 `GEMINI_API_KEY` 已设置。
2. 更新 `app/scripts/topics.txt`，添加感兴趣的主题。
3. 运行 `npm run generate:daily` 执行每日生成任务（默认 20 个）。
4. 检查 `app/data/tool_generation_log.csv` 确认生成记录。

### C. 广告位管理
- **全局开关**：用户可以通过页面上的 `AdsToggle` 组件关闭广告，该状态保存在浏览器的 `localStorage` 中。
- **新增广告位**：直接在需要的位置引入 `<AdSlot slotName="your-name" />` 即可。

---

## 4. 技术栈参考
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend/Logic**: JSON-based formulas (JavaScript string execution)
- **Automation**: Python 3.x, Google Generative AI (Gemini)
- **Deployment**: Vercel + GitHub Actions

## 5. 待办事项与优化建议
- [ ] **性能优化**：随着 JSON 文件增多，考虑在加载所有配置时引入缓存机制。
- [ ] **UI/UX**：可以为计算器结果增加更多的可视化图表支持。
- [ ] **多语言**：目前以英文为主，未来可扩展多语言 JSON 支持。

---
**报告人**: Cline (AI Engineer)
**日期**: 2025-12-19
