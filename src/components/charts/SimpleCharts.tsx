import React from 'react';

interface SimpleBarChartProps {
  data: { label: string; value: number; color?: string }[];
  title: string;
  height?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  title, 
  height = 200 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h4 className="text-lg font-medium text-gray-900 mb-4">{title}</h4>
      <div className="space-y-3" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600 mr-3">
              {item.label}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
              <div
                className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#3b82f6',
                  minWidth: '30px'
                }}
              >
                {item.value.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SimplePieChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

export const SimplePieChart: React.FC<SimplePieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h4 className="text-lg font-medium text-gray-900 mb-4">{title}</h4>
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Cercle de base */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            {/* Segments */}
            {data.reduce((acc, item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 2.51} 251.2`;
              const strokeDashoffset = -acc.offset;
              
              acc.segments.push(
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
              
              acc.offset += percentage * 2.51;
              return acc;
            }, { segments: [] as React.ReactNode[], offset: 0 }).segments}
          </svg>
          
          {/* Centre avec total */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Légende */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {((item.value / total) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SimpleLineChartProps {
  data: { label: string; value: number }[];
  title: string;
  height?: number;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
  data, 
  title, 
  height = 200 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h4 className="text-lg font-medium text-gray-900 mb-4">{title}</h4>
      <div className="relative" style={{ height }}>
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grille */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Ligne */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * 380 + 10;
              const y = 190 - ((item.value - minValue) / range) * 180;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 380 + 10;
            const y = 190 - ((item.value - minValue) / range) * 180;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* Labels X */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
