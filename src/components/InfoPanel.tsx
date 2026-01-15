import React from 'react';

// 数据项类型
export interface InfoItem {
    label: string;
    value: string | number;
    unit?: string;
    highlight?: boolean;
}

export type InfoPanelVariant = 'plain' | 'digital';

// 单个数据项组件
const DataItem: React.FC<InfoItem> = ({ label, value, unit, highlight }) => (
    <div className="grid grid-cols-[auto_auto_auto] gap-2 py-1 justify-end items-center">
        <span className="text-cyan-300 font-mono text-xs text-right whitespace-nowrap">{label}:</span>
        <span className={`font-mono text-xs font-bold text-right px-2 py-0.5 border border-cyan-400 min-w-16 ${highlight ? 'text-yellow-300' : 'text-yellow-300'}`}>
            {value}
        </span>
        <span className="text-cyan-400 font-mono text-xs text-right w-10">{unit || ''}</span>
    </div>
);

// 数字显示风格（绿色框）
const DigitalItem: React.FC<InfoItem> = ({ label, value, unit, highlight }) => {
    const boxClass = highlight
        ? 'bg-emerald-400/35 border-emerald-300 text-emerald-50'
        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200';

    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-cyan-300 font-mono text-xs">{label}</span>
            <div className={`min-w-[96px] px-2 py-1 border rounded-sm flex items-center justify-end gap-1 font-mono text-xs ${boxClass}`}>
                <span className="font-bold">{value}</span>
                {unit && <span className="text-[10px] text-emerald-200/80">{unit}</span>}
            </div>
        </div>
    );
};

// 信息面板配置类型
export interface InfoPanelConfig {
    items: InfoItem[];
}

// 默认加油信息面板数据
export const DEFAULT_REFUEL_INFO: InfoPanelConfig = {
    items: [
        { label: '全机油量', value: '16000', unit: 'kg' },
        { label: '密度', value: '0.000', unit: 'kg/m' },
        { label: '牌号', value: 'Rp-3', highlight: true },
        { label: '加油方案', value: '基本加', highlight: true },
    ]
};

// 信息面板组件
export const InfoPanel: React.FC<{
    config?: InfoPanelConfig;
    items?: InfoItem[];
    className?: string;
    variant?: InfoPanelVariant;
}> = ({ config, items, className = '', variant = 'plain' }) => {
    // 优先使用 items，其次使用 config，最后使用默认值
    const displayItems = items || config?.items || DEFAULT_REFUEL_INFO.items;
    const isDigital = variant === 'digital';

    return (
        <div className={`flex flex-col ${isDigital ? 'gap-2 items-stretch' : 'gap-1'} ${className}`}>
            {displayItems.map((item, index) => (
                isDigital ? <DigitalItem key={index} {...item} /> : <DataItem key={index} {...item} />
            ))}
        </div>
    );
};

export default InfoPanel;
