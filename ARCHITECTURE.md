# GMP 项目架构文档

> 地面保障设备控制系统 (Ground Maintenance Panel)

---

## 一、整体架构

GMP 是一个**单页面 React 应用**，模拟工业硬件控制界面，用于飞机地面保障设备的监控与操作。

### 架构模式

```
┌─────────────────────────────────────────────────────────────────┐
│                           App.tsx                                │
│                    (视图状态 + 按钮配置)                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    HardwareFrame                         │    │
│  │  ┌─────┬─────┬─────┬─────┬─────┬─────┐                  │    │
│  │  │ T1  │ T2  │ T3  │ T4  │ T5  │ T6  │  ← 顶部按钮      │    │
│  │  ├─────┴─────┴─────┴─────┴─────┴─────┤                  │    │
│  │  │ L1 │                         │ R1 │                  │    │
│  │  │ L2 │      当前视图内容        │ R2 │  ← 内容区域      │    │
│  │  │ L3 │   (Menu/Consumables/    │ R3 │                  │    │
│  │  │ L4 │    Refueling)           │ R4 │                  │    │
│  │  ├─────┬─────┬─────┬─────┬─────┬─────┤                  │    │
│  │  │ B1  │ B2  │ B3  │ B4  │ B5  │ B6  │  ← 底部按钮      │    │
│  │  └─────┴─────┴─────┴─────┴─────┴─────┘                  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 设计特点

| 特点 | 说明 |
|------|------|
| 硬件模拟 | 模拟专用设备界面，20个边缘按钮 |
| 声明式按钮配置 | 每个功能模块声明自己的按钮布局 |
| 视图导航 | 基于枚举的简单视图切换 |
| 无外部状态管理 | 使用 React 内置 useState |

---

## 二、技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **框架** | React | 18.3.1 |
| **语言** | TypeScript | 5.7.2 |
| **构建工具** | Vite | 6.0.0 |
| **UI 图标** | lucide-react | 0.462.0 |
| **样式** | Tailwind CSS | CDN |
| **字体** | JetBrains Mono, Inter | Google Fonts |
| **代码质量** | ESLint + Prettier | 9.17.0 / 3.4.2 |
| **Git Hooks** | Husky + lint-staged | 9.1.7 / 15.2.11 |

**开发服务器端口:** 3001

---

## 三、目录结构

```
gmp/
├── index.html                    # 入口 HTML
├── package.json                  # 依赖配置
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts                # Vite 配置
├── eslint.config.js              # ESLint 配置
├── .prettierrc                   # Prettier 配置
│
└── src/
    ├── main.tsx                  # 应用入口
    ├── App.tsx                   # 根组件（视图路由）
    │
    ├── components/               # 共享 UI 组件
    │   ├── index.ts              # 统一导出
    │   ├── HardwareFrame.tsx     # 硬件框架（边缘按钮）
    │   ├── InfoPanel.tsx         # 数据展示面板
    │   └── FuelTankSystem.tsx    # 油箱 SVG 可视化
    │
    ├── features/                 # 功能模块
    │   ├── menu/                 # 主菜单
    │   │   ├── index.ts
    │   │   └── MainMenu.tsx
    │   ├── consumables/          # 消耗品监控
    │   │   ├── index.ts
    │   │   └── Consumables.tsx
    │   └── refueling/            # 加油控制
    │       ├── index.ts
    │       └── Refueling.tsx
    │
    ├── shared/                   # 共享资源（预留）
    │   ├── hooks/
    │   ├── utils/
    │   ├── services/
    │   ├── constants/
    │   └── contexts/
    │
    ├── types/                    # 类型定义
    │   ├── index.ts
    │   ├── common.ts             # AppView 枚举
    │   ├── button.ts             # 按钮类型
    │   ├── consumable.ts         # 消耗品类型
    │   └── refueling.ts          # 加油类型
    │
    └── data/                     # 静态/模拟数据
        ├── index.ts
        └── initialData.ts
```

---

## 四、数据流设计

```
用户点击边缘按钮
       │
       ▼
HardwareFrame.EdgeButton
       │
       ▼
buttonConfig[buttonId].action()
       │
       ├──→ 导航: setCurrentView(AppView.X)
       │
       └──→ 功能操作: 更新功能模块内部状态
              │
              ▼
         useEffect 触发
              │
              ▼
         setButtonConfig() 更新按钮配置
              │
              ▼
         HardwareFrame 重新渲染按钮
```

### 状态管理

```typescript
// App.tsx - 全局状态
const [currentView, setCurrentView] = useState<AppView>(AppView.MENU);
const [buttonConfig, setButtonConfig] = useState<ButtonConfig>({});

// 功能模块 - 局部状态
const [currentSubPage, setCurrentSubPage] = useState('ground-refuel');
const [isRefuelActive, setIsRefuelActive] = useState(false);
```

---

## 五、组件职责划分

### 核心组件

| 组件 | 文件 | 职责 |
|------|------|------|
| **App** | `App.tsx` | 根组件，管理视图状态和按钮配置 |
| **HardwareFrame** | `components/HardwareFrame.tsx` | 硬件界面框架，渲染20个边缘按钮 |

### 共享组件

| 组件 | 文件 | 职责 |
|------|------|------|
| **InfoPanel** | `components/InfoPanel.tsx` | 数据展示面板，支持普通/数字两种风格 |
| **FuelTankSystem** | `components/FuelTankSystem.tsx` | SVG 油箱示意图，显示7个油箱和管路 |

### 功能模块

| 模块 | 目录 | 职责 |
|------|------|------|
| **Menu** | `features/menu/` | 主导航菜单 |
| **Consumables** | `features/consumables/` | 消耗品状态监控（只读） |
| **Refueling** | `features/refueling/` | 加油控制（4个子页面） |

---

## 六、关键文件关系图

```
App.tsx
    │
    ├── 管理: currentView, buttonConfig
    │
    ├─→ HardwareFrame.tsx
    │       │
    │       ├── 渲染: 20个 EdgeButton
    │       ├── 渲染: 20个 InnerLabel
    │       └── 渲染: children (当前视图)
    │
    ├─→ MainMenu.tsx
    │       │
    │       └── useEffect → setButtonConfig(菜单按钮)
    │
    ├─→ Consumables.tsx
    │       │
    │       ├── 显示: 消耗品列表
    │       └── useEffect → setButtonConfig(监控按钮)
    │
    └─→ Refueling.tsx
            │
            ├── 子页面: GroundRefuelContent
            │           ├── FuelTankSystem (油箱图)
            │           └── InfoPanel (数据面板)
            │
            ├── 子页面: GroundDrainContent
            │
            └── useEffect → setButtonConfig(操作按钮)
```

---

## 七、类型定义

```typescript
// 视图枚举
enum AppView {
  MENU = 'MENU',
  CONSUMABLES = 'CONSUMABLES',
  REFUELING = 'REFUELING',
}

// 按钮 ID 枚举
enum ButtonId {
  T1, T2, T3, T4, T5, T6,  // 顶部
  B1, B2, B3, B4, B5, B6,  // 底部
  L1, L2, L3, L4,          // 左侧
  R1, R2, R3, R4,          // 右侧
}

// 按钮状态
interface ButtonState {
  label?: string;
  action?: () => void;
  disabled?: boolean;
  isActive?: boolean;
  color?: 'default' | 'primary' | 'danger' | 'success';
}

// 按钮配置
type ButtonConfig = Partial<Record<ButtonId, ButtonState>>;
```

---

## 八、开发命令

```bash
npm run dev       # 启动开发服务器 (端口 3001)
npm run build     # 生产构建
npm run preview   # 预览构建结果
npm run lint      # ESLint 检查
npm run lint:fix  # ESLint 自动修复
npm run format    # Prettier 格式化
npm run typecheck # TypeScript 类型检查
```

---

*最后更新: 2025-01*
