import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,

} from 'recharts';

import type { PriceHistory } from '../types';
import { formatDate, formatPrice } from '../lib/utils';

interface PriceTrendChartProps {
    data: PriceHistory[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass p-3 rounded-lg border border-slate-200 shadow-xl">
                <p className="text-xs font-semibold text-slate-500 mb-1">{formatDate(payload[0].payload.date)}</p>
                <p className="text-lg font-bold text-blue-600">{formatPrice(payload[0].value as number)}</p>
            </div>
        );
    }
    return null;
};

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="w-full h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700, fontFamily: 'Outfit' }}
                        dy={10}
                    />
                    <YAxis
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700, fontFamily: 'Outfit' }}
                        width={40}
                    />
                    <Tooltip content={(props) => <CustomTooltip {...props} />} />
                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#2563eb"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceTrendChart;