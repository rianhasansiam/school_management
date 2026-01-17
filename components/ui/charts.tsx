'use client';

import * as React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ============================================
// CHART COLORS
// ============================================

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  gray: '#6b7280',
};

export const PIE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

// ============================================
// SIMPLE LINE CHART
// ============================================

interface SimpleLineChartProps {
  data: Array<{ name: string; value: number; value2?: number }>;
  height?: number;
  color?: string;
  color2?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  dataKey?: string;
  dataKey2?: string;
  label?: string;
  label2?: string;
}

export function SimpleLineChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  color2 = CHART_COLORS.success,
  showGrid = true,
  showLegend = false,
  dataKey = 'value',
  dataKey2 = 'value2',
  label = 'Value',
  label2 = 'Value 2',
}: SimpleLineChartProps) {
  const hasSecondLine = data.some(d => d.value2 !== undefined);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        {showLegend && <Legend />}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          name={label}
        />
        {hasSecondLine && (
          <Line
            type="monotone"
            dataKey={dataKey2}
            stroke={color2}
            strokeWidth={2}
            dot={{ fill: color2, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name={label2}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ============================================
// SIMPLE BAR CHART
// ============================================

interface SimpleBarChartProps {
  data: Array<{ name: string; value: number; value2?: number }>;
  height?: number;
  color?: string;
  color2?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  label?: string;
  label2?: string;
}

export function SimpleBarChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  color2 = CHART_COLORS.success,
  showGrid = true,
  showLegend = false,
  label = 'Value',
  label2 = 'Value 2',
}: SimpleBarChartProps) {
  const hasSecondBar = data.some(d => d.value2 !== undefined);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        {showLegend && <Legend />}
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} name={label} />
        {hasSecondBar && (
          <Bar dataKey="value2" fill={color2} radius={[4, 4, 0, 0]} name={label2} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================
// SIMPLE AREA CHART
// ============================================

interface SimpleAreaChartProps {
  data: Array<{ name: string; value: number; value2?: number }>;
  height?: number;
  color?: string;
  color2?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  label?: string;
  label2?: string;
}

export function SimpleAreaChart({
  data,
  height = 300,
  color = CHART_COLORS.primary,
  color2 = CHART_COLORS.success,
  showGrid = true,
  showLegend = false,
  label = 'Value',
  label2 = 'Value 2',
}: SimpleAreaChartProps) {
  const hasSecondArea = data.some(d => d.value2 !== undefined);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        {showLegend && <Legend />}
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color2} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color2} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fillOpacity={1}
          fill="url(#colorValue)"
          strokeWidth={2}
          name={label}
        />
        {hasSecondArea && (
          <Area
            type="monotone"
            dataKey="value2"
            stroke={color2}
            fillOpacity={1}
            fill="url(#colorValue2)"
            strokeWidth={2}
            name={label2}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ============================================
// SIMPLE PIE CHART
// ============================================

interface SimplePieChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showLabel?: boolean;
}

export function SimplePieChart({
  data,
  height = 300,
  innerRadius = 0,
  outerRadius = 80,
  showLegend = true,
  showLabel = false,
}: SimplePieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          label={showLabel ? ({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%` : undefined}
          labelLine={showLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        {showLegend && <Legend />}
      </PieChart>
    </ResponsiveContainer>
  );
}

// ============================================
// DONUT CHART (Pie with inner radius)
// ============================================

interface DonutChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
}

export function DonutChart({
  data,
  height = 250,
  showLegend = true,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center" style={{ marginTop: showLegend ? '-40px' : '0' }}>
            {centerValue && <p className="text-2xl font-bold text-gray-900">{centerValue}</p>}
            {centerLabel && <p className="text-sm text-gray-500">{centerLabel}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
