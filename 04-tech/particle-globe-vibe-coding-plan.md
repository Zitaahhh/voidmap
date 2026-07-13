# VoidMap Particle Globe Demo：Vibe Coding 执行计划

> 基于：`/Users/zita/voidmap/02-product/voidmap-particle-globe-demo-prd-v0.1.md`  
> 目标：一步一步把 PRD 变成可运行的 Next.js + React Three Fiber Demo。  
> 原则：每一步都必须能运行、能看见结果、能验证，不一次性做太大。

---

## 0. 打开 PRD 文件

### Finder 打开

```bash
open -R /Users/zita/voidmap/02-product/voidmap-particle-globe-demo-prd-v0.1.md
```

### TextEdit 打开

```bash
open -a TextEdit /Users/zita/voidmap/02-product/voidmap-particle-globe-demo-prd-v0.1.md
```

### VS Code 打开，如果安装了 code 命令

```bash
code /Users/zita/voidmap/02-product/voidmap-particle-globe-demo-prd-v0.1.md
```

### Cursor 打开，如果安装了 cursor 命令

```bash
cursor /Users/zita/voidmap/02-product/voidmap-particle-globe-demo-prd-v0.1.md
```

---

## 1. Vibe Coding 总方法

不要一次性说“帮我做完整产品”。每次只让 agent 做一个小 milestone：

```text
读取 PRD 的某一节 → 实现一个小功能 → 本地运行 → 截图/检查 → 修复 → 继续下一步
```

每一步都要求：

1. 写代码；
2. 运行项目；
3. 修复报错；
4. 告诉我改了哪些文件；
5. 给我下一步建议。

---

## 2. 推荐项目目录

建议把真实前端 Demo 放在：

```text
/Users/zita/voidmap/apps/particle-globe-demo
```

最终结构：

```text
/Users/zita/voidmap
├── 02-product/
│   └── voidmap-particle-globe-demo-prd-v0.1.md
├── 04-tech/
│   └── particle-globe-vibe-coding-plan.md
└── apps/
    └── particle-globe-demo/
        ├── app/
        ├── components/
        ├── data/
        ├── lib/
        └── styles/
```

---

## 3. Step 1：创建 Next.js 项目

### 给 agent 的 prompt

```text
读取 /Users/zita/voidmap/02-product/voidmap-particle-globe-demo-prd-v0.1.md。

请创建 Next.js + TypeScript 项目到：
/Users/zita/voidmap/apps/particle-globe-demo

要求：
1. 使用 app router；
2. 安装 three、@react-three/fiber、@react-three/drei、framer-motion；
3. 创建 PRD 中定义的目录结构；
4. 写入基础 globals.css 和设计 token；
5. npm run dev 能启动；
6. 启动后验证首页能打开。

不要一次性实现完整产品，只完成项目初始化和暗色空页面。
```

### 验收标准

- [ ] 项目目录存在；
- [ ] `npm run dev` 可启动；
- [ ] 首页是暗色背景；
- [ ] 无 TypeScript 报错。

---

## 4. Step 2：实现静态页面骨架 V0

### 给 agent 的 prompt

```text
基于 PRD 的页面布局和组件 Props，继续实现 V0 静态视觉版。

范围只包括：
1. HeroScene；
2. StoryCard；
3. ExplorerProfile；
4. BottomStatusBar；
5. VoidCTA；
6. mock signals 数据；
7. 桌面端左中右布局。

暂时不要做 Three.js 粒子地球，用一个占位圆形 Glow 代替。

完成后运行 npm run dev 验证页面。
```

### 验收标准

- [ ] 能看见 VoidMap 品牌；
- [ ] 左侧故事卡显示第一条 signal；
- [ ] 右侧档案显示探索者信息；
- [ ] 中间有粒子地球占位视觉；
- [ ] 底部状态栏存在。

---

## 5. Step 3：实现真实 ParticleGlobe

### 给 agent 的 prompt

```text
基于 PRD 的 12.5 Milestone 2，实现 ParticleGlobe。

要求：
1. 使用 React Three Fiber；
2. 用 BufferGeometry 生成 3000-5000 个粒子；
3. 粒子形成球体；
4. 球体慢速旋转；
5. 不要每帧 setState；
6. 保留现有左侧/右侧/底部 UI；
7. 本地运行并修复报错。
```

### 验收标准

- [ ] 中间出现粒子球；
- [ ] 粒子球慢速旋转；
- [ ] 页面不卡；
- [ ] 没有 console error。

---

## 6. Step 4：实现 SignalPoint 光点

### 给 agent 的 prompt

```text
基于 PRD 的 7 经纬度到球面坐标和 9.3 SignalPoint，继续实现城市光点。

要求：
1. 实现 lib/geo.ts 中的 latLngToVector3；
2. 把 data/signals.ts 里的 signals 渲染到球面上；
3. 每个光点使用 userColor；
4. selected 光点有 halo；
5. 初始 selectedSignalId 使用第一条 signal；
6. 本地运行验证。
```

### 验收标准

- [ ] 地球上能看见 5 个左右光点；
- [ ] 光点贴在球面上；
- [ ] selected 光点更亮；
- [ ] 无明显性能问题。

---

## 7. Step 5：实现 hover / click 故事切换

### 给 agent 的 prompt

```text
基于 PRD 的 12.7 Milestone 4，实现光点 hover / click 交互。

要求：
1. HeroScene 管理 selectedSignalId 和 hoveredSignalId；
2. hover 光点时 StoryCard 临时显示 hovered signal；
3. mouse leave 后回到 selected signal；
4. click 光点后固定 selected signal；
5. BottomStatusBar 同步 active signal；
6. StoryCard 切换要有轻微 fade + slide 动画。
```

### 验收标准

- [ ] hover 光点时故事卡变化；
- [ ] click 光点后故事被固定；
- [ ] 离开 hover 后回到 selected；
- [ ] 交互稳定。

---

## 8. Step 6：增加动效和质感

### 给 agent 的 prompt

```text
基于 PRD 的 10 动画 Timing 表和 12.8 Milestone 5，增加动效和视觉质感。

要求：
1. 页面淡入；
2. 光点 stagger 点亮；
3. StoryCard 切换动画；
4. CTA hover glow；
5. 背景径向光晕和轻微 noise；
6. 支持 prefers-reduced-motion。

注意：整体要安静、有呼吸，不要游戏 UI 感。
```

### 验收标准

- [ ] 页面进入有层次；
- [ ] 动效克制；
- [ ] 按钮 hover 有反馈；
- [ ] 不影响性能。

---

## 9. Step 7：响应式和性能优化

### 给 agent 的 prompt

```text
基于 PRD 的 12.9 Milestone 6，做响应式和性能优化。

要求：
1. 桌面端保持左中右布局；
2. 移动端改为纵向布局；
3. 移动端降低粒子数量；
4. 检查是否有每帧 React state；
5. 检查 npm run build；
6. 修复 build error。
```

### 验收标准

- [ ] 桌面端布局正常；
- [ ] 移动端不崩；
- [ ] `npm run build` 通过；
- [ ] 性能可接受。

---

## 10. Step 8：部署 Vercel

### 给 agent 的 prompt

```text
准备部署 particle-globe-demo。

要求：
1. 确认 npm run build 通过；
2. 检查 package.json；
3. 如果有 git repo，提交当前 demo；
4. 给出 Vercel 部署步骤；
5. 不要替我发布，除非我明确确认。
```

---

## 11. 每轮 vibe coding 的固定检查清单

每完成一步都检查：

- [ ] 代码是否真的写入；
- [ ] 是否运行过；
- [ ] 是否有报错；
- [ ] 报错是否修复；
- [ ] 页面是否符合 PRD；
- [ ] 是否需要缩小下一步任务。

---

## 12. 推荐第一条实际执行指令

如果现在要开始开发，直接发：

```text
根据 /Users/zita/voidmap/02-product/voidmap-particle-globe-demo-prd-v0.1.md，按 /Users/zita/voidmap/04-tech/particle-globe-vibe-coding-plan.md 的 Step 1 创建 Next.js 项目。只做 Step 1，完成后运行验证。
```
