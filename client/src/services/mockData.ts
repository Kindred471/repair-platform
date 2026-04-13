import { RepairOrder } from '@/types'

export const mockOrders: RepairOrder[] = [
  {
    id: 1,
    title: '南区3号楼电梯故障，停在5楼不动',
    description: '今天早上出门发现南区3号楼左侧的电梯卡在5楼无法上下，按键没有反应。严重影响居民出行，特别是老人和小孩。希望能尽快派人维修。',
    address: '南区3号楼1单元',
    status: 'PENDING',
    priority: 'P0',
    author: { id: 101, username: 'user101', role: 'RESIDENT' },
    createdAt: '2023-10-24T08:30:00Z',
  },
  {
    id: 2,
    title: '地下室A区跑水',
    description: '地下车库A区入口处有大量积水，可能是天花板上的水管破裂，已经漫延到旁边的停车位。',
    address: '地下车库A区',
    status: 'PROCESSING',
    priority: 'P1',
    author: { id: 102, username: 'user102', role: 'RESIDENT' },
    assignedCompany: '迅捷物业维修队',
    assignedWorkerName: '张师傅',
    assignedWorkerPhone: '13800138000',
    createdAt: '2023-10-24T09:15:00Z',
    updatedAt: '2023-10-24T10:00:00Z',
  },
  {
    id: 3,
    title: '小区西门路灯不亮',
    description: '小区西门出口处靠近门卫亭的那盏路灯已经坏了两天了，晚上进出比较黑，感觉不太安全，请安排更换灯泡。',
    address: '小区西门',
    status: 'COMPLETED',
    priority: 'P2',
    author: { id: 103, username: 'user103', role: 'RESIDENT' },
    assignedCompany: '迅捷物业维修队',
    assignedWorkerName: '李师傅',
    assignedWorkerPhone: '13900139000',
    createdAt: '2023-10-23T19:00:00Z',
    updatedAt: '2023-10-24T14:00:00Z',
    evaluation: {
      id: 'EV-001',
      rating: 5,
      comment: '师傅修理速度很快，态度很好。',
      orderId: '3',
      authorId: 'user103',
      createdAt: '2023-10-24T15:00:00Z'
    }
  },
  {
    id: 4,
    title: '12栋外墙瓷砖脱落',
    description: '12栋东侧外墙有几块大的瓷砖脱落了，虽然没砸到人，但看着很危险，麻烦拉个警戒线并尽快修复。',
    address: '12栋东侧外墙',
    status: 'CANCELLATION_REQUESTED',
    priority: 'P1',
    author: { id: 104, username: 'user104', role: 'RESIDENT' },
    cancellationReason: '由于需要搭脚手架，暂时找不到高空作业团队，申请延期或撤销目前工单。',
    createdAt: '2023-10-24T11:00:00Z',
  },
  {
    id: 5,
    title: '家里宽带无法连接',
    description: '由于小区弱电井施工，家里宽带断网了。',
    address: '8栋2单元402',
    status: 'CANCELED',
    priority: 'P2',
    author: { id: 105, username: 'user105', role: 'RESIDENT' },
    createdAt: '2023-10-22T08:00:00Z',
    updatedAt: '2023-10-22T10:00:00Z',
  }
]

// mock 初始喜欢的工单 IDs (用于测试 F-ADM-06 关注功能)
export const initialFavoriteOrders = [1, 4]
