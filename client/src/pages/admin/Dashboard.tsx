import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Activity } from 'lucide-react';

// 模拟数据
const stats = [
  { title: '待处理工单', value: 12, icon: <Clock className="w-8 h-8 text-warning" />, desc: '较昨日 +2' },
  { title: '处理中', value: 5, icon: <Activity className="w-8 h-8 text-info" />, desc: '3个即将超时' },
  { title: '本周已完成', value: 28, icon: <CheckCircle className="w-8 h-8 text-success" />, desc: '完成率 92%' },
  { title: 'P0 紧急', value: 2, icon: <AlertCircle className="w-8 h-8 text-error" />, desc: '需立即响应' },
];

const chartData = [
  { name: '周一', pending: 4, completed: 2 },
  { name: '周二', pending: 3, completed: 5 },
  { name: '周三', pending: 5, completed: 8 },
  { name: '周四', pending: 2, completed: 4 },
  { name: '周五', pending: 6, completed: 9 },
  { name: '周六', pending: 1, completed: 3 },
  { name: '周日', pending: 0, completed: 1 },
];

const pieData = [
  { name: '水电', value: 400 },
  { name: '门窗', value: 300 },
  { name: '公共设施', value: 300 },
  { name: '其他', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-base-100 min-h-screen">
      {/* 1. Header & Title with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-base-content">物业管理仪表盘</h1>
        <button className="btn btn-primary btn-sm">刷新数据</button>
      </motion.div>

      {/* 2. KPI Cards (DaisyUI Stats + Motion) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="stats shadow bg-base-200 border border-base-300"
          >
            <div className="stat">
              <div className="stat-figure text-secondary">
                {stat.icon}
              </div>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value text-3xl">{stat.value}</div>
              <div className="stat-desc">{stat.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div 
          className="lg:col-span-2 card bg-base-200 shadow-xl p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="card-title mb-4 text-sm opacity-70">本周报修处理趋势</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                <Area type="monotone" dataKey="pending" stroke="#8884d8" fillOpacity={1} fill="url(#colorPending)" />
                <Area type="monotone" dataKey="completed" stroke="#82ca9d" fillOpacity={1} fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div 
          className="card bg-base-200 shadow-xl p-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="card-title mb-4 text-sm opacity-70">报修类型占比</h2>
          <div className="h-64 w-full flex justify-center items-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 4. Weekly Focus (F-ADM-06) */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
         className="card bg-base-100 shadow-xl border border-primary/20"
      >
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title flex items-center gap-2">
              <Activity className="text-primary" /> 
              本周重点关注 (Weekly Focus)
            </h2>
            <div className="badge badge-primary badge-outline">F-ADM-06</div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>优先级</th>
                  <th>问题</th>
                  <th>位置</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="badge badge-error gap-2">P0</div></td>
                  <td className="font-bold">电梯故障，有人被困</td>
                  <td>5栋 2单元</td>
                  <td><span className="loading loading-spinner loading-xs text-warning"></span> 处理中</td>
                  <td><button className="btn btn-xs btn-outline">查看</button></td>
                </tr>
                {/* 更多行... */}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};