import React from 'react';

// 油箱数据类型
export interface TankData {
    id: string;           // 油箱标识，如 "1#", "5L#"
    capacity: number;     // 容量/当前油量
    maxCapacity?: number; // 最大容量（可选）
}

// 圆形标签组件（阀门/接口指示）
const CircleIndicator: React.FC<{
    active?: boolean;
    size?: 'sm' | 'md';
}> = ({ active = true, size = 'sm' }) => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    return (
        <div className={`
      ${sizeClass} rounded-full border-2 
      ${active ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-600 border-slate-500'}
    `} />
    );
};

// 单个油箱块组件
const TankBlock: React.FC<{
    data: TankData;
    width?: number;
    height?: number;
    showIndicators?: boolean;
    indicatorCount?: number;
    color?: 'cyan' | 'purple';
}> = ({ data, width = 70, height = 60, showIndicators = true, indicatorCount = 2, color = 'cyan' }) => {
    const bgColor = color === 'cyan' ? 'bg-cyan-600' : 'bg-purple-600';
    const borderColor = color === 'cyan' ? 'border-cyan-400' : 'border-purple-400';
    const labelColor = color === 'cyan' ? 'text-cyan-300' : 'text-purple-300';

    return (
        <div
            className={`relative border-2 flex flex-col items-center justify-center ${bgColor} ${borderColor}`}
            style={{ width, height }}
        >
            {/* 油量显示 */}
            <span className="text-white font-mono text-sm font-bold">{data.capacity}</span>

            {/* 油箱标识 */}
            <span className={`absolute -bottom-5 text-[10px] font-mono font-bold ${labelColor}`}>{data.id}</span>

            {/* 圆形指示器 */}
            {showIndicators && (
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    {Array.from({ length: indicatorCount }).map((_, i) => (
                        <CircleIndicator key={i} active={i === 0} size="sm" />
                    ))}
                </div>
            )}
        </div>
    );
};

// 油箱系统布局配置
export interface FuelSystemConfig {
    tanks: {
        [key: string]: TankData;
    };
}

// 默认油箱数据
export const DEFAULT_FUEL_SYSTEM: FuelSystemConfig = {
    tanks: {
        '1#': { id: '1#', capacity: 3000, maxCapacity: 3000 },
        '2#': { id: '2#', capacity: 3000, maxCapacity: 3000 },
        '3#': { id: '3#', capacity: 3000, maxCapacity: 3000 },
        '5L#': { id: '5L#', capacity: 2000, maxCapacity: 3000 },
        '5R#': { id: '5R#', capacity: 2000, maxCapacity: 3000 },
        '6L#': { id: '6L#', capacity: 0, maxCapacity: 1000 },
        '6R#': { id: '6R#', capacity: 0, maxCapacity: 1000 },
    }
};

// 油箱系统组件
export const FuelTankSystem: React.FC<{
    config?: FuelSystemConfig;
    width?: number;
    height?: number;
    color?: 'cyan' | 'purple';
}> = ({ config = DEFAULT_FUEL_SYSTEM, width = 420, height = 380, color = 'cyan' }) => {
    const tanks = config.tanks;

    // Helper function to safely get tank data with fallback
    const getTank = (id: string): TankData => {
        return tanks[id] ?? { id, capacity: 0, maxCapacity: 0 };
    };

    return (
        <div className="relative" style={{ width, height }}>
            {/* 管道连接 - SVG */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                {/* 中央垂直主管道 */}
                <line x1="210" y1="70" x2="210" y2="300" stroke="#10b981" strokeWidth="3" />

                {/* 水平主管道 */}
                <line x1="80" y1="240" x2="340" y2="240" stroke="#10b981" strokeWidth="3" />

                {/* 左侧垂直分支 (5L# -> 6L#) */}
                <line x1="100" y1="200" x2="100" y2="310" stroke="#10b981" strokeWidth="2" />
                <line x1="100" y1="240" x2="180" y2="240" stroke="#10b981" strokeWidth="2" />

                {/* 右侧垂直分支 (5R# -> 6R#) */}
                <line x1="320" y1="200" x2="320" y2="310" stroke="#10b981" strokeWidth="2" />
                <line x1="240" y1="240" x2="320" y2="240" stroke="#10b981" strokeWidth="2" />

                {/* 顶部连接 */}
                <line x1="210" y1="30" x2="210" y2="70" stroke="#10b981" strokeWidth="2" />
            </svg>

            {/* 油箱块 - 1# (顶部) */}
            <div className="absolute" style={{ left: 175, top: 0, zIndex: 1 }}>
                <TankBlock data={getTank('1#')} width={70} height={55} indicatorCount={2} color={color} />
            </div>

            {/* 油箱块 - 2# */}
            <div className="absolute" style={{ left: 175, top: 70, zIndex: 1 }}>
                <TankBlock data={getTank('2#')} width={70} height={50} indicatorCount={2} color={color} />
            </div>

            {/* 油箱块 - 3# */}
            <div className="absolute" style={{ left: 175, top: 135, zIndex: 1 }}>
                <TankBlock data={getTank('3#')} width={70} height={45} indicatorCount={3} color={color} />
            </div>

            {/* 油箱块 - 5L# (左侧) */}
            <div className="absolute" style={{ left: 55, top: 155, zIndex: 1 }}>
                <TankBlock data={getTank('5L#')} width={60} height={55} indicatorCount={2} color={color} />
            </div>

            {/* 油箱块 - 5R# (右侧) */}
            <div className="absolute" style={{ left: 305, top: 155, zIndex: 1 }}>
                <TankBlock data={getTank('5R#')} width={60} height={55} indicatorCount={2} color={color} />
            </div>

            {/* 油箱块 - 6L# (底部左) */}
            <div className="absolute" style={{ left: 70, top: 310, zIndex: 1 }}>
                <TankBlock data={getTank('6L#')} width={50} height={45} indicatorCount={1} color={color} />
            </div>

            {/* 油箱块 - 6R# (底部右) */}
            <div className="absolute" style={{ left: 295, top: 310, zIndex: 1 }}>
                <TankBlock data={getTank('6R#')} width={50} height={45} indicatorCount={1} color={color} />
            </div>

            {/* 管道节点 (绿色圆点) */}
            <div className="absolute" style={{ left: 203, top: 125, zIndex: 2 }}>
                <CircleIndicator active size="md" />
            </div>
            <div className="absolute" style={{ left: 203, top: 185, zIndex: 2 }}>
                <CircleIndicator active size="md" />
            </div>
            <div className="absolute" style={{ left: 93, top: 233, zIndex: 2 }}>
                <CircleIndicator active={false} size="md" />
            </div>
            <div className="absolute" style={{ left: 313, top: 233, zIndex: 2 }}>
                <CircleIndicator active={false} size="md" />
            </div>
        </div>
    );
};

export default FuelTankSystem;
