# Frontend Refactor Plan

## Goal

在不改变现有桌面端 UI 观感的前提下，完成前端页面架构重构：

- 将当前站点从单个大型 `index.html` 的伪路由结构，重构为真实多页路由
- 规范文件组织、目录结构、页面命名和内容组织方式
- 提升后续内容维护、页面扩展和路由管理的可维护性

## Top Constraints

- 这是一次架构重构，不是视觉改版
- 用户应基本感受不到页面 UI 变化
- 桌面端当前展示效果是最高优先级基准
- 移动端不是本次重点，只需保证不明显损坏
- 允许修复不影响 UI 的结构问题、命名问题和路径问题
- 不做旧链接兼容
- 不做双语路由

## Final Decisions

### Tech Stack

- 使用 `Astro`
- 使用静态站点输出，构建时生成真实 HTML 页面
- 可以引入 `Tailwind CSS`，但只能辅助整理，不能主导视觉重写
- 优先保留现有 CSS 的视觉结果

### Routing

- 使用真实多页路由
- 部署路径为根路径
- 一级导航全部拆成独立页面
- 路由结构如下：
  - `/`
  - `/about`
  - `/news`
  - `/news/:slug`
  - `/executive-committee`
  - `/activities`
  - `/activities/:slug`
  - `/learning-materials`

### Content Model

- `activities` 和 `news` 为两个独立内容集合
- 使用 `Astro content collections`
- 内容格式为 `Markdown + frontmatter`
- 文件名即 slug
- slug 不单独手写字段，优先由文件名承担
- 内容目录不按年份分文件夹，统一平铺，便于维护
- Markdown 正文允许少量原生 HTML

### Page Strategy

- 首页只保留当前默认 `home` 内容
- 一级页面全部改成独立页面，不再使用 `showContent()` 这类页内伪路由
- `About`、`Executive Committee`、`Learning Materials` 先实现为普通 `.astro` 页面
- 所有一级页面共享同一套顶部标题区与导航条外观
- 访客计数器保留，并保持当前右下角固定样式与位置

### List Pages

- `Activities` 列表从 content collection 自动生成
- `Activities` 展示方式保持当前按年份 / 月份分组的样式
- `News` 列表从 content collection 自动生成
- `News` 展示方式保持接近当前的图片区块式展示
- `News` 支持两类条目：
  - `internal`：站内详情页
  - `external`：直接跳转外部链接

### File Naming

- 页面文件统一使用 `kebab-case`
- 资源目录统一改为英文命名
- 图片文件名本次不强制统一替换，可后续逐步处理
- 静态资源目录命名优先清晰、可读、可长期维护

## Suggested Structure

```text
public/
  fonts/
  images/
    activities/
    news/
  ...

src/
  content/
    activities/
      some-activity.md
    news/
      some-news.md
  layouts/
    site-layout.astro
    activity-detail-layout.astro
    news-detail-layout.astro
  pages/
    index.astro
    about.astro
    activities.astro
    executive-committee.astro
    learning-materials.astro
    news.astro
    activities/[slug].astro
    news/[slug].astro
  styles/
    global.css
```

## Content Schema Direction

### Activities

建议字段：

- `title`
- `date`
- `year`
- `month`
- `summary`
- `cover`
- `images`

说明：

- 详情页路径来自文件名
- 列表分组使用 `year` 和 `month`
- 正文主体写在 Markdown 内容区

### News

建议字段：

- `title`
- `date`
- `summary`
- `cover`
- `type`
- `externalUrl`

说明：

- `type` 取值为 `internal` 或 `external`
- `internal` 新闻生成站内详情页
- `external` 新闻在列表中直接跳转外链

## Shared Layer Scope

本次只抽取最小必要共享层：

- 全站公共布局
- `activity` 详情模板
- `news` 详情模板

不做过度组件化，不把页面拆得过碎。

## Migration Scope

- 一次性迁移现有页面内容到新架构
- 一次性完成一级导航页面拆分
- 一次性完成 `activities` / `news` 内容建模
- 同步整理资源目录结构

## Implementation Principles

- 先保页面视觉一致，再做结构升级
- 先保留现有信息层级，再做文件整理
- 先做真实路由和内容建模，再做目录与资源清理
- 不为了“更现代”而主动改变原有页面表现

## Recommended Execution Order

1. 初始化 `Astro` 项目结构与基础配置
2. 建立全站公共布局，复刻当前顶部标题区、导航和全局样式
3. 迁移首页与一级页面：`about`、`executive-committee`、`learning-materials`
4. 建立 `activities` 和 `news` content collections 及 schema
5. 迁移 `Activities` 内容，并保持当前列表分组方式
6. 迁移 `News` 内容，并支持 `internal` / `external`
7. 保留并接入访客计数器
8. 统一静态资源目录结构与资源引用路径
9. 对照当前站点逐页校验，确保桌面端 UI 基本无感变化

## Definition Of Done

当以下条件同时满足时，本次重构完成：

- 所有一级导航页面都已使用真实路由
- `Activities` 和 `News` 均完成内容驱动化
- 页面文件、内容文件、资源目录结构已规范化
- 桌面端页面视觉与当前站点基本一致
- 用户使用时基本感受不到 UI 变化
- 原有 `index.html` 里的伪路由逻辑不再承担站点主结构
