import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle, Clock, Activity, Inbox } from 'lucide-react';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { adminService } from '@/services/adminService';
import { StatusMap } from '@/components/admin/OrderTableHelpers';
import { RepairStatus } from '@/types';

const chartData = [
  { name: '周一', pending: 4, completed: 2 },
  { name: '周二', pending: 3, completed: 5 },
  { name: '周三', pending: 5, completed: 8 },
  { name: '周四', pending: 2, completed: 4 },
  { name: '周五', pending: 6, completed: 9 },
  { name: '周六', pending: 1, completed: 3 },
  { name: '周日', pending: 0, completed: 1 },
];



export const Dashboard = () => {
  const { orders, refreshData } = useAdminOrders();
  const [statsData, setStatsData] = useState({ pending: 0, processing: 0, completed: 0, canceled: 0 });

  useEffect(() => {
    adminService.fetchStats().then(data => {
      if (data) setStatsData(data);
    }).catch(err => console.error(err));
  }, []);

  const handleRefresh = async () => {
    adminService.fetchStats().then(data => {
      if (data) setStatsData(data);
    }).catch(err => console.error(err));
    await refreshData();
  };

  const p0Orders = orders.filter(o => o.priority === 'P0');
  const p0Count = p0Orders.length;

  const stats = [
    { title: '待处理', value: statsData.pending, icon: <Clock className="w-8 h-8 text-warning" />, desc: '录入的所有待分配工单' },
    { title: '处理中', value: statsData.processing, icon: <Activity className="w-8 h-8 text-info" />, desc: '已指派维修团队或人员' },
    { title: '已完成', value: statsData.completed, icon: <CheckCircle className="w-8 h-8 text-success" />, desc: '已解决的维修记录' },
    { title: 'P0 紧急', value: p0Count, icon: <AlertCircle className="w-8 h-8 text-error" />, desc: '危及生命或严重财产损失' },
  ];

  // 为 Recharts 过滤数值为 0 的项体验会更好，不过不过滤也行
  const rawPieData = [
    { name: '待处理', value: statsData.pending },
    { name: '处理中', value: statsData.processing },
    { name: '已完成', value: statsData.completed },
    { name: '已撤销', value: statsData.canceled },
  ];

  // 只有当至少有一项有数值时才显示有效饼图，否则避免显示空图表报错
  const totalStats = statsData.pending + statsData.processing + statsData.completed + statsData.canceled;
  const pieData = totalStats > 0 ? rawPieData.filter(d => d.value > 0) : [{ name: '暂无数据', value: 1 }];

  return (
    <div className="p-6 space-y-6 bg-base-100 min-h-screen">
      {/* 1. Header & Title with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-base-content">物业管理仪表盘</h1>
        <button onClick={handleRefresh} className="btn btn-primary btn-sm">刷新数据</button>
      </motion.div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="stats shadow bg-base-200 border border-base-300"
          >
            <div className="stat text-center md:text-left">
              <div className="stat-figure text-secondary hidden md:block">
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
          <h2 className="card-title mb-4 text-sm opacity-70">本周报修处理趋势 (模拟)</h2>
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
                <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
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
          <h2 className="card-title mb-4 text-sm opacity-70">工单状态占比</h2>
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
                    {pieData.map((entry, index) => {
                       // 自动匹配颜色以保持颜色一致性
                       let color = '#ccc';
                       if (entry.name === '待处理') color = '#FFBB28';
                       if (entry.name === '处理中') color = '#0088FE';
                       if (entry.name === '已完成') color = '#00C49F';
                       if (entry.name === '已撤销') color = '#FF8042';
                       return <Cell key={`cell-${index}`} fill={color} />
                    })}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 4. Weekly Focus (P0 Orders) */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
         className="card bg-base-100 shadow-xl border border-error/20"
      >
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title flex items-center gap-2">
              <AlertCircle className="text-error" /> 
              本周重点关注 (P0 级别工单)
            </h2>
            <div className="badge badge-error badge-outline">F-ADM-06</div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>优先级</th>
                  <th>问题</th>
                  <th>位置</th>
                  <th>状态</th>
                  <th>提交时间</th>
                </tr>
              </thead>
              <tbody>
                {p0Orders.length > 0 ? (
                  p0Orders.map((order) => {
                    const statusInfo = StatusMap[order.status as RepairStatus] || { label: order.status, badgeClass: 'badge-ghost' }
                    return (
                      <tr key={order.id}>
                        <td><div className="badge badge-error gap-2">P0</div></td>
                        <td className="font-bold">{order.title}</td>
                        <td>{order.address}</td>
                        <td>
                          <span className={`badge badge-sm ${statusInfo.badgeClass}`}>
                            {order.status === 'PROCESSING' && <span className="loading loading-spinner text-info loading-xs mr-1"></span>}
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="text-sm opacity-80">{new Date(order.createdAt).toLocaleString()}</td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="py-8 flex flex-col items-center justify-center opacity-60">
                        <Inbox className="w-12 h-12 mb-2 opacity-50" />
                        暂无需要关注的 P0 紧急工单
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};