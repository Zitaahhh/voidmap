# VoidMap PRD v0.1

> 状态：Draft / 待 Zita 补充产品愿景  
> Owner：Zita  
> Agent：voidmap  
> Last updated：2026-07-09

## 1. 产品一句话

**VoidMap 是一个帮助个人/团队把混乱想法、信息碎片和未知问题转化为可探索地图、决策路径和行动计划的 AI 产品。**

它不是单纯的笔记工具，也不是普通聊天机器人，而是一个“思维导航系统”：把用户脑子里的空白、困惑、目标、资料、选择和风险结构化成一张可以持续更新的地图。

---

## 2. 背景与问题

### 2.1 用户现状

很多人在做复杂项目、职业选择、研究、创业、学习或人生规划时，会遇到这些问题：

- 信息很多，但不知道从哪里开始。
- 想法很多，但没有结构。
- 问题很大，但拆不成下一步。
- 和 AI 聊了很多轮，但对话散落，无法沉淀成长期知识结构。
- 文档、笔记、聊天记录、灵感、待办分散在多个地方。
- 随着项目推进，原来的判断依据和决策路径丢失。

### 2.2 核心痛点

| 痛点 | 具体表现 | 后果 |
|---|---|---|
| 模糊 | 用户只知道“我想做点什么”，但无法清晰表达目标 | 开始困难，依赖情绪推进 |
| 信息碎片化 | Telegram、ChatGPT、Lark、Notion、浏览器资料分散 | 很难复盘和延续 |
| 决策路径丢失 | 为什么这么选、排除了什么、风险是什么没有记录 | 后续反复纠结 |
| AI 对话不可持续 | 每次重新解释背景，AI 没有长期项目地图 | 效率低，认知负担高 |
| 计划和现实脱节 | PRD/roadmap 写完后没有与日常行动闭环 | 项目停在文档层 |

---

## 3. 产品目标

### 3.1 北极星目标

帮助用户把一个混乱主题持续转化为：

1. 清晰问题空间
2. 结构化知识地图
3. 可追踪决策路径
4. 可执行行动路线
5. 可复盘项目记忆

### 3.2 MVP 阶段目标

MVP 不做“大而全知识管理”，只验证一个核心闭环：

> 用户在 Telegram/聊天中输入一个混乱想法 → VoidMap agent 通过追问和整理 → 生成一份项目地图 + PRD/计划文档 → 后续持续更新。

---

## 4. 目标用户

### 4.1 初始 ICP

**高信息密度、经常启动复杂项目的人。**

优先用户：

1. 创业者 / 独立产品人
2. 研究者 / 学生 / 申请者
3. 内容创作者 / 咨询顾问
4. 需要管理多个项目的知识工作者
5. 使用 ChatGPT 频繁，但缺少长期项目结构的人

### 4.2 早期 Persona

#### Persona A：独立产品人 Z

- 同时有很多产品想法。
- 经常和 AI 聊产品、写 PRD、做竞品分析。
- 问题：聊天记录分散，项目上下文断裂。
- 需要：一个项目专属 agent，把想法变成持续演进的产品地图。

#### Persona B：研究型学生 R

- 正在做论文、申请、研究方向探索。
- 信息来源多，阅读材料杂。
- 问题：不知道如何从大主题拆出研究问题和路径。
- 需要：把研究空白、概念、文献、问题拆成地图。

#### Persona C：职业转型者 C

- 想探索职业方向或人生决策。
- 问题：目标模糊，选择太多。
- 需要：把未知、约束、选项、风险和下一步行动可视化。

---

## 5. 核心使用场景

### 场景 1：从模糊想法生成项目地图

用户说：

> 我想做一个叫 VoidMap 的产品，帮我梳理一下。

系统输出：

- 产品一句话
- 用户痛点
- 目标用户
- 核心假设
- MVP 功能
- 风险
- 下一步问题
- 自动保存到项目文件夹

### 场景 2：持续维护 PRD

用户说：

> 把刚才讨论的加入 PRD。

系统：

- 找到对应项目 PRD
- 合并新增内容
- 保留变更记录
- 输出本次更新摘要

### 场景 3：决策地图

用户说：

> 我不知道这个产品先做 Telegram bot 还是 web app。

系统输出：

- 选项 A/B/C
- 每个选项的成本、风险、验证速度
- 推荐路径
- 决策理由
- 待验证假设

### 场景 4：资料归纳

用户贴一段文章/链接/聊天记录。

系统：

- 提取关键信息
- 归入产品地图中的对应节点
- 标注来源
- 提出对当前产品策略的影响

### 场景 5：下一步行动

用户说：

> 今天我该做什么？

系统基于项目地图输出：

- 今日 1–3 个最高优先级任务
- 每个任务的完成标准
- 所属目标/假设
- 预计时间

---

## 6. MVP 功能范围

### 6.1 必须有 P0

| 模块 | 功能 | 说明 |
|---|---|---|
| 项目 Profile | 每个项目一个 agent/profile | 如 `voidmap` profile |
| Chat 输入 | Telegram bot 对话 | 初期以 Telegram 为入口 |
| 项目文件夹 | 自动保存 Markdown | `/Users/zita/voidmap` |
| PRD 生成 | 根据对话生成 PRD | 当前文件即 v0.1 |
| 地图结构 | 生成项目地图 Markdown | 先用文本树结构，不做可视化 |
| 持续更新 | 用户要求时更新文档 | 通过文件读写实现 |
| 下一步建议 | 输出 task list | 每轮对话可产生行动项 |

### 6.2 应该有 P1

| 模块 | 功能 | 说明 |
|---|---|---|
| ChatGPT 记录读取 | 通过浏览器/导出读取历史 | 复用 computer_use 或导出文件 |
| 决策日志 | 保存关键决策 | 为什么做/不做某件事 |
| 假设库 | 保存待验证假设 | 支持后续实验设计 |
| 竞品/资料库 | 保存链接和摘要 | 每条带来源 |
| 周报 | 自动总结项目进展 | 每周输出 |

### 6.3 暂不做 P2

- 完整 web app
- 多人协作权限
- 实时可视化图谱编辑器
- 多端同步
- 插件市场
- 复杂知识图数据库

---

## 7. 核心信息架构

MVP 使用本地 Markdown 文件作为数据层。

```text
/Users/zita/voidmap
├── 01-strategy/
│   ├── vision.md
│   ├── positioning.md
│   ├── icp.md
│   └── assumptions.md
├── 02-product/
│   ├── voidmap-prd-v0.1.md
│   ├── roadmap.md
│   ├── user-flows.md
│   └── feature-specs.md
├── 03-design/
│   ├── UX-notes.md
│   └── copywriting.md
├── 04-tech/
│   ├── architecture.md
│   └── implementation-plan.md
├── 05-gtm/
│   ├── launch-plan.md
│   └── content-ideas.md
└── 99-notes/
    ├── raw-notes.md
    └── decision-log.md
```

---

## 8. 核心对象模型

### 8.1 Project

```yaml
project:
  name: VoidMap
  status: idea / mvp / beta / launched
  one_liner: ...
  owner: Zita
  active_files:
    - PRD
    - roadmap
    - assumptions
```

### 8.2 Map Node

```yaml
node:
  id: VM-NODE-001
  type: problem | user | feature | risk | assumption | task | decision | source
  title: ...
  content: ...
  links:
    - VM-NODE-002
  status: open | validated | rejected | done
```

### 8.3 Decision

```yaml
decision:
  id: VM-DECISION-001
  question: 先做 Telegram bot 还是 Web app？
  chosen: Telegram bot first
  reason: 验证速度最快，Zita 已有 Hermes workflow
  rejected_options:
    - Web app first
  revisit_at: 2026-xx-xx
```

### 8.4 Assumption

```yaml
assumption:
  id: VM-HYP-001
  statement: 高频使用 ChatGPT 的用户愿意为“长期项目记忆 + 地图化整理”付费
  risk_level: high
  validation_method: 访谈 5 位目标用户 + landing page waitlist
  status: untested
```

---

## 9. MVP 用户流程

### Flow 1：首次创建项目地图

```text
用户：我想做 VoidMap
↓
Agent：提取初始愿景、目标用户、痛点、假设
↓
Agent：生成 PRD + project map
↓
Agent：保存到 /Users/zita/voidmap
↓
用户：继续补充/修改
```

### Flow 2：每日推进

```text
用户：今天继续 VoidMap
↓
Agent：读取当前 PRD / roadmap / notes
↓
Agent：总结项目状态
↓
Agent：提出 1–3 个下一步任务
↓
用户选择执行
↓
Agent 更新相关文档
```

### Flow 3：资料导入

```text
用户：粘贴一段资料/链接/ChatGPT 记录
↓
Agent：摘要 + 判断属于哪个节点
↓
Agent：写入 source / assumptions / PRD
↓
Agent：提示对产品策略的影响
```

---

## 10. 成功指标

### 10.1 MVP 验证指标

| 指标 | 目标 |
|---|---:|
| 从模糊想法到首版 PRD 时间 | < 30 分钟 |
| 用户连续使用天数 | ≥ 7 天 |
| 每次会话是否能产出明确 artifact | ≥ 80% |
| 用户是否减少重复解释上下文 | 明显减少 |
| 项目文件是否持续增长且结构清晰 | 是 |

### 10.2 用户价值信号

用户会说：

- “我不用每次重新讲背景了。”
- “它知道我项目现在在哪。”
- “它能帮我把混乱的东西变成下一步。”
- “我可以回看为什么当时这么决定。”

---

## 11. 风险与开放问题

### 11.1 产品风险

| 风险 | 说明 | 缓解 |
|---|---|---|
| 概念太抽象 | VoidMap 可能难以一句话解释 | 先绑定具体场景：产品/研究/人生决策 |
| 与 Notion/Obsidian/ChatGPT 重叠 | 用户可能觉得只是笔记+AI | 强调“项目地图 + 决策路径 + 长期上下文” |
| 输出太像普通文档 | 没有地图感 | MVP 用结构树，后续再可视化 |
| 用户不愿维护 | 文档持续更新有负担 | Agent 自动维护，用户只需聊天 |
| 过度依赖单一模型 | provider 超时影响体验 | 配 fallback provider / 本地缓存 |

### 11.2 技术风险

| 风险 | 说明 | 缓解 |
|---|---|---|
| 模型超时 | 当前 51codex gpt-5.5 不稳定 | 换更稳模型或配置 fallback |
| 长上下文成本高 | 项目越久越大 | 文件索引 + 摘要层 |
| 多项目隔离 | 不同项目上下文混淆 | 每个项目独立 profile |
| Telegram 入口能力有限 | 文件和可视化不方便 | 初期够用，后续 web UI |

---

## 12. Roadmap

### Phase 0：手动 agent MVP（当前阶段）

- [x] 创建 `voidmap` profile
- [x] 创建 `/Users/zita/voidmap` 文件结构
- [x] 创建 PRD v0.1
- [ ] 修复/替换稳定 provider
- [ ] 建立 decision-log / assumptions / roadmap
- [ ] 通过 Telegram bot 完成 3 次真实工作会话

### Phase 1：项目地图模板

- [ ] 定义标准 map node schema
- [ ] 自动生成 `project-map.md`
- [ ] 自动维护 `decision-log.md`
- [ ] 自动维护 `next-actions.md`
- [ ] 支持“今天继续项目”的状态恢复

### Phase 2：ChatGPT / 外部记录导入

- [ ] 支持 ChatGPT export zip 解析
- [ ] 支持从 Chrome 当前页面读取 ChatGPT 记录
- [ ] 把历史对话归入项目节点
- [ ] 标注来源和时间

### Phase 3：可视化/产品化

- [ ] Web prototype
- [ ] 节点可视化
- [ ] 项目 timeline
- [ ] 多项目 workspace
- [ ] 付费验证 landing page

---

## 13. 下一步建议

### 立即要做

1. **确认 VoidMap 的核心场景**：产品构思？人生决策？研究地图？还是都做但先选一个入口。
2. **写 `vision.md`**：明确 VoidMap 的世界观和差异化。
3. **写 `project-map.md`**：把当前 PRD 转成树状地图。
4. **解决 bot provider 稳定性**：给 `voidmap` 配可用 fallback，避免 Telegram bot 继续卡死。

### 建议下一轮让 agent 做

```text
基于 PRD v0.1，帮我生成 VoidMap 的 vision.md、project-map.md 和 assumptions.md。
```

---

## 14. 待 Zita 回答的问题

1. VoidMap 最想解决的���：产品项目混乱、人生方向混乱、研究信息混乱，还是所有“未知空间”？
2. 你希望它首先服务谁：你自己、创业者、学生、创作者，还是公司团队？
3. “Void” 在品牌里代表什么：未知、空白、迷雾、焦虑、潜意识、还是未探索空间？
4. “Map” 更偏：视觉地图、路线图、知识图谱、还是行动地图？
5. 你希望最终产品形态是：Telegram bot、ChatGPT 插件、网页 app、桌面 app，还是多入口？
