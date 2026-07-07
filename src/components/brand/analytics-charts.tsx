"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { challengePerformance, locationPerformance, rewardActivationTrend, weeklyActivity } from "@/data/analytics";

const tooltipStyle = { border: 0, borderRadius: 16, boxShadow: "0 12px 30px rgb(15 23 42 / 0.12)", fontSize: 12 };
const chartSize = { width: 640, height: 256 };
const axisTick = { fill: "#94a3b8", fontSize: 12 };

export function WeeklyActivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" initialDimension={chartSize}>
      <AreaChart data={weeklyActivity} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
        <defs><linearGradient id="visits" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.28}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false}/>
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={axisTick}/>
        <YAxis axisLine={false} tickLine={false} tick={axisTick}/>
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Визитов"]}/>
        <Area type="monotone" dataKey="visits" stroke="#2563eb" strokeWidth={3} fill="url(#visits)"/>
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RewardActivationsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" initialDimension={chartSize}>
      <BarChart data={rewardActivationTrend} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false}/>
        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ ...axisTick, fontSize: 11 }}/>
        <YAxis axisLine={false} tickLine={false} tick={axisTick}/>
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Активаций"]}/>
        <Bar dataKey="activations" fill="#0f172a" radius={[8, 8, 3, 3]}/>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LocationsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" initialDimension={chartSize}>
      <BarChart data={locationPerformance} layout="vertical" margin={{ top: 0, right: 12, left: 12, bottom: 0 }}>
        <XAxis type="number" hide/>
        <YAxis type="category" dataKey="shortName" width={120} axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 12 }}/>
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Визитов"]}/>
        <Bar dataKey="visits" radius={[0, 8, 8, 0]}>{locationPerformance.map((item, index) => <Cell key={item.id} fill={index === 0 ? "#2563eb" : "#cbd5e1"}/>)}</Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChallengePerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%" initialDimension={chartSize}>
      <BarChart data={challengePerformance} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false}/>
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} interval={0}/>
        <YAxis axisLine={false} tickLine={false} tick={axisTick}/>
        <Tooltip contentStyle={tooltipStyle}/>
        <Bar dataKey="participants" name="Участники" fill="#cbd5e1" radius={[6, 6, 2, 2]}/>
        <Bar dataKey="completed" name="Завершили" fill="#2563eb" radius={[6, 6, 2, 2]}/>
      </BarChart>
    </ResponsiveContainer>
  );
}
