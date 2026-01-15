import React, { useState, useEffect } from 'react';
import { AppView, ButtonConfig, ButtonId, RefuelingChannel, OperationMode } from '../../types';
import { Fuel, CheckCircle2, XCircle, Timer, Gauge, Power, Edit2, Save, X, ArrowLeft, Plus, Minus } from 'lucide-react';

interface RefuelingProps {
  setButtonConfig: (config: ButtonConfig) => void;
  onNavigate: (view: AppView) => void;
  channels: RefuelingChannel[];
  setChannels: (channels: RefuelingChannel[]) => void;
  mode: OperationMode;
}

type EditField = 'isEnabled' | 'pressure' | 'duration' | null;

export const Refueling: React.FC<RefuelingProps> = ({ setButtonConfig, onNavigate, channels, setChannels, mode }) => {
  const [selectedChannelIndex, setSelectedChannelIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<EditField>('isEnabled');
  
  const [tempChannel, setTempChannel] = useState<RefuelingChannel | null>(null);

  const currentChannel = channels[selectedChannelIndex];
  const isTouch = mode === 'touch';

  const handleSave = () => {
    if (tempChannel) {
      const newChannels = [...channels];
      newChannels[selectedChannelIndex] = tempChannel;
      setChannels(newChannels);
      setIsEditing(false);
      setTempChannel(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempChannel(null);
  };

  const startEditing = () => {
    setTempChannel({ ...currentChannel });
    setIsEditing(true);
    setEditingField('isEnabled');
  }

  const adjustValue = (increment: boolean, field?: EditField) => {
    if (!tempChannel) return;
    const targetField = field || editingField;

    if (targetField === 'isEnabled') {
      setTempChannel({ ...tempChannel, isEnabled: !tempChannel.isEnabled });
    } else if (targetField === 'pressure') {
      const step = 5;
      const newVal = Math.max(0, tempChannel.pressure + (increment ? step : -step));
      setTempChannel({ ...tempChannel, pressure: newVal });
    } else if (targetField === 'duration') {
      const step = 5;
      const newVal = Math.max(0, tempChannel.duration + (increment ? step : -step));
      setTempChannel({ ...tempChannel, duration: newVal });
    }
  };

  const cycleField = (direction: 'next' | 'prev') => {
    const fields: EditField[] = ['isEnabled', 'pressure', 'duration'];
    const currentIdx = fields.indexOf(editingField);
    let nextIdx;
    if (direction === 'next') {
        nextIdx = (currentIdx + 1) % fields.length;
    } else {
        nextIdx = (currentIdx - 1 + fields.length) % fields.length;
    }
    setEditingField(fields[nextIdx]);
  };

  useEffect(() => {
    const config: ButtonConfig = {};

    if (isEditing) {
      // EDIT MODE CONTROLS
      config[ButtonId.L1] = { label: '↑ 上一项', action: () => cycleField('prev') };
      config[ButtonId.L2] = { label: '↓ 下一项', action: () => cycleField('next') };
      
      let incLabel = '+ 增加';
      let decLabel = '- 减少';
      if (editingField === 'isEnabled') {
        incLabel = '切换';
        decLabel = '切换';
      }

      config[ButtonId.R1] = { label: incLabel, action: () => adjustValue(true) };
      config[ButtonId.R2] = { label: decLabel, action: () => adjustValue(false) };
      
      config[ButtonId.R4] = { label: '保存', color: 'success', action: handleSave };
      config[ButtonId.L4] = { label: '取消', color: 'danger', action: handleCancel };

    } else {
      // VIEW MODE CONTROLS
      config[ButtonId.L1] = { label: '↑ 上移', action: () => setSelectedChannelIndex(p => Math.max(0, p - 1)) };
      config[ButtonId.L2] = { label: '↓ 下移', action: () => setSelectedChannelIndex(p => Math.min(channels.length - 1, p + 1)) };
      
      config[ButtonId.R1] = { 
        label: '编辑', 
        color: 'primary', 
        action: startEditing
      };
      
      config[ButtonId.L4] = { label: '返回', color: 'danger', action: () => onNavigate(AppView.MENU) };
    }

    setButtonConfig(config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, editingField, selectedChannelIndex, tempChannel, currentChannel]); 

  const displayData = isEditing && tempChannel ? tempChannel : currentChannel;

  // Helper for Touch Controls
  const RenderTouchControl = ({ field }: { field: EditField }) => {
     if (!isTouch || !isEditing) return null;
     
     if (field === 'isEnabled') {
        return (
          <button 
            onClick={() => adjustValue(true, 'isEnabled')}
            className="ml-4 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded font-bold text-slate-700 active:bg-slate-400"
          >
            切换状态
          </button>
        )
     }

     return (
       <div className="flex gap-2 ml-4">
         <button 
           onClick={() => adjustValue(false, field)}
           className="w-10 h-10 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full font-bold active:bg-slate-400"
         >
           <Minus size={20} />
         </button>
         <button 
           onClick={() => adjustValue(true, field)}
           className="w-10 h-10 flex items-center justify-center bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-full font-bold active:bg-cyan-300"
         >
           <Plus size={20} />
         </button>
       </div>
     );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-200">
        <div className="flex items-center gap-4">
          <Fuel className="text-cyan-600 w-8 h-8" />
          <h2 className="text-2xl font-bold text-slate-800">
            加油方案设置 
            {isEditing && <span className="text-yellow-700 ml-4 text-sm bg-yellow-100 border border-yellow-300 px-2 py-1 rounded animate-pulse font-mono">正在编辑模式</span>}
          </h2>
        </div>

        {/* Touch Mode Toolbar */}
        {isTouch && (
           <div className="flex gap-2">
              {!isEditing ? (
                 <>
                   <button onClick={() => onNavigate(AppView.MENU)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg font-bold text-slate-600">
                      <ArrowLeft size={18} /> 返回
                   </button>
                   <button onClick={startEditing} className="flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold shadow-lg shadow-cyan-200/50">
                      <Edit2 size={18} /> 编辑方案
                   </button>
                 </>
              ) : (
                 <>
                   <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold">
                      <X size={18} /> 取消
                   </button>
                   <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold shadow-lg shadow-emerald-200/50">
                      <Save size={18} /> 保存更改
                   </button>
                 </>
              )}
           </div>
        )}
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
        
        {/* Left Side: Channel List */}
        <div className="w-1/3 border-r border-slate-200 pr-4 flex flex-col gap-2 overflow-y-auto">
           <h3 className="text-slate-400 font-mono text-xs uppercase mb-2">通道列表</h3>
           {channels.map((ch, idx) => (
             <div 
               key={ch.id}
               onClick={() => {
                 if (isTouch && !isEditing) setSelectedChannelIndex(idx);
               }}
               className={`
                 p-4 rounded border-l-4 transition-all
                 ${idx === selectedChannelIndex 
                   ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-sm' 
                   : 'bg-white border-transparent text-slate-500'}
                 ${isEditing && idx !== selectedChannelIndex ? 'opacity-40' : 'opacity-100'}
                 ${isTouch && !isEditing ? 'cursor-pointer hover:bg-slate-50 active:bg-slate-100' : ''}
               `}
             >
                <div className="flex justify-between items-center">
                  <span className="font-bold">{ch.name}</span>
                  {ch.isEnabled ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-slate-300" />}
                </div>
             </div>
           ))}
        </div>

        {/* Right Side: Details / Edit Form */}
        <div className="flex-1 pl-4 flex flex-col justify-center">
          
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-lg">
             <div className="text-center mb-8 border-b border-slate-100 pb-4">
               <span className="text-slate-400 text-sm font-mono block mb-1">当前选中通道</span>
               <h1 className="text-4xl text-slate-800 font-bold tracking-widest">{displayData.name}</h1>
             </div>

             <div className="space-y-6">
                
                {/* Field: Enabled */}
                <div className={`
                    flex items-center justify-between p-4 rounded-lg border-2 transition-all
                    ${!isTouch && isEditing && editingField === 'isEnabled' ? 'bg-cyan-50 border-cyan-400 shadow-sm scale-105' : 'border-slate-100 bg-slate-50'}
                `}>
                   <div className="flex items-center gap-3 text-slate-500">
                     <Power size={20} />
                     <span className="uppercase font-mono text-sm font-bold">状态</span>
                   </div>
                   <div className="flex items-center">
                     <div className={`font-bold text-xl ${displayData.isEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                       {displayData.isEnabled ? '已启用' : '已禁用'}
                     </div>
                     <RenderTouchControl field="isEnabled" />
                   </div>
                </div>

                {/* Field: Pressure */}
                <div className={`
                    flex items-center justify-between p-4 rounded-lg border-2 transition-all
                    ${!isTouch && isEditing && editingField === 'pressure' ? 'bg-cyan-50 border-cyan-400 shadow-sm scale-105' : 'border-slate-100 bg-slate-50'}
                    ${!displayData.isEnabled ? 'opacity-50 grayscale' : ''}
                `}>
                   <div className="flex items-center gap-3 text-slate-500">
                     <Gauge size={20} />
                     <span className="uppercase font-mono text-sm font-bold">液压</span>
                   </div>
                   <div className="flex items-center">
                      <div className="flex items-end gap-2">
                          <span className="font-bold text-3xl text-cyan-700 font-mono">{displayData.pressure}</span>
                          <span className="text-slate-400 mb-1 font-bold">Bar</span>
                      </div>
                      <RenderTouchControl field="pressure" />
                   </div>
                </div>

                 {/* Field: Duration */}
                 <div className={`
                    flex items-center justify-between p-4 rounded-lg border-2 transition-all
                    ${!isTouch && isEditing && editingField === 'duration' ? 'bg-cyan-50 border-cyan-400 shadow-sm scale-105' : 'border-slate-100 bg-slate-50'}
                    ${!displayData.isEnabled ? 'opacity-50 grayscale' : ''}
                `}>
                   <div className="flex items-center gap-3 text-slate-500">
                     <Timer size={20} />
                     <span className="uppercase font-mono text-sm font-bold">时长</span>
                   </div>
                   <div className="flex items-center">
                      <div className="flex items-end gap-2">
                          <span className="font-bold text-3xl text-cyan-700 font-mono">{displayData.duration}</span>
                          <span className="text-slate-400 mb-1 font-bold">秒</span>
                      </div>
                      <RenderTouchControl field="duration" />
                   </div>
                </div>

             </div>

             {/* Helper Text */}
             <div className="mt-8 text-center text-slate-400 font-mono text-xs">
                {!isTouch ? (isEditing ? '调整参数后请按 [R4] 保存' : '按 [R1] 修改此通道设置') : ''}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};