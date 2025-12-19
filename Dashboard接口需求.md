# Dashboard 页面接口需求文档

## 概述
本文档整理了管理员 Dashboard 页面所需的所有后端接口。

## 现有接口

### 1. 基础统计接口（已存在，需扩展）
**接口路径:** `GET /api/admin/orders/stats`  
**当前返回:**
```json
{
  "code": 200,
  "data": {
    "pending": 12,      // 待处理
    "processing": 5,    // 处理中
    "completed": 28,    // 已完成（总数）
    "canceled": 0       // 已取消
  }
}
```

**需要扩展为:**
```json
{
  "code": 200,
  "data": {
    "pending": 12,                    // 待处理
    "processing": 5,                  // 处理中
    "completed": 28,                  // 已完成（总数）
    "canceled": 0,                    // 已取消
    "completedThisWeek": 28,          // 本周已完成（新增）
    "p0Urgent": 2,                    // P0 紧急工单数（新增）
    "pendingChange": 2,               // 待处理较昨日变化（新增，+2 表示增加2个）
    "processingTimeout": 3,           // 处理中即将超时的数量（新增）
    "completionRate": 92.0            // 本周完成率（新增，百分比）
  }
}
```

---

## 需要新增的接口

### 2. 本周趋势数据接口（新增）
**接口路径:** `GET /api/admin/orders/trends/weekly`  
**描述:** 获取本周每天（周一到周日）的待处理和已完成工单数量

**请求参数:** 无

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "date": "2025-01-13",      // 日期（周一）
      "dayOfWeek": "周一",        // 星期名称
      "pending": 4,               // 当天待处理数
      "completed": 2              // 当天完成数
    },
    {
      "date": "2025-01-14",
      "dayOfWeek": "周二",
      "pending": 3,
      "completed": 5
    }
    // ... 周一到周日共7条数据
  ]
}
```

**业务逻辑:**
- 统计本周（周一到周日）每天的状态变化
- `pending`: 当天处于 PENDING 状态的工单数
- `completed`: 当天状态变为 COMPLETED 的工单数

---

### 3. 报修类型占比接口（新增）
**接口路径:** `GET /api/admin/orders/category-stats`  
**描述:** 获取报修类型分布统计

**请求参数:** 无

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "category": "水电",           // 报修类型
      "count": 400,                 // 该类型工单数量
      "percentage": 40.0            // 占比（百分比）
    },
    {
      "category": "门窗",
      "count": 300,
      "percentage": 30.0
    },
    {
      "category": "公共设施",
      "count": 200,
      "percentage": 20.0
    },
    {
      "category": "其他",
      "count": 100,
      "percentage": 10.0
    }
  ]
}
```

**业务逻辑:**
- 根据工单的 `title` 或 `description` 进行关键词匹配分类
- 或者：如果后续在 RepairOrder 模型中新增 `category` 字段，则直接按字段统计
- 分类规则建议：
  - 水电：包含"水"、"电"、"管道"、"电路"等关键词
  - 门窗：包含"门"、"窗"、"锁"等关键词
  - 公共设施：包含"电梯"、"楼道"、"公共"等关键词
  - 其他：不匹配以上分类的

---

### 4. 本周重点关注工单接口（新增）
**接口路径:** `GET /api/admin/orders/weekly-focus`  
**描述:** 获取本周需要重点关注的高优先级工单列表

**请求参数:**
- `priority` (可选): 优先级筛选，如 `P0`, `P1`，默认返回 P0 和 P1
- `limit` (可选): 返回数量限制，默认 10

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "title": "电梯故障，有人被困",
      "address": "5栋 2单元",
      "priority": "P0",
      "status": "PROCESSING",
      "assignedWorkerName": "张师傅",
      "createdAt": "2025-01-13T10:30:00",
      "updatedAt": "2025-01-13T11:00:00"
    }
    // ... 更多工单
  ]
}
```

**业务逻辑:**
- 返回优先级为 P0 或 P1 的工单
- 按优先级（P0 > P1）和创建时间倒序排列
- 只返回本周创建的工单，或本周状态为 PROCESSING 的工单

---

## 接口实现优先级

### 高优先级（必须实现）
1. ✅ **扩展 `/api/admin/orders/stats` 接口** - 添加更多统计字段
2. ✅ **新增 `/api/admin/orders/trends/weekly` 接口** - 趋势图表数据
3. ✅ **新增 `/api/admin/orders/weekly-focus` 接口** - 重点关注工单

### 中优先级（建议实现）
4. ⚠️ **新增 `/api/admin/orders/category-stats` 接口** - 类型占比（如果暂时无法实现，可以先返回模拟数据）

---

## 前端调用示例

```typescript
// 1. 获取统计信息
const stats = await get<DashboardStats>('/admin/orders/stats')

// 2. 获取趋势数据
const trends = await get<WeeklyTrend[]>('/admin/orders/trends/weekly')

// 3. 获取类型占比
const categoryStats = await get<CategoryStat[]>('/admin/orders/category-stats')

// 4. 获取重点关注工单
const focusOrders = await get<RepairOrder[]>('/admin/orders/weekly-focus', {
  priority: 'P0',
  limit: 10
})
```

---

## 数据模型定义建议

### DashboardStats (扩展)
```java
@Data
@Builder
public class DashboardStats {
    private long pending;              // 待处理
    private long processing;          // 处理中
    private long completed;           // 已完成（总数）
    private long canceled;            // 已取消
    private long completedThisWeek;   // 本周已完成（新增）
    private long p0Urgent;            // P0 紧急工单数（新增）
    private int pendingChange;        // 待处理较昨日变化（新增）
    private int processingTimeout;    // 处理中即将超时的数量（新增）
    private double completionRate;   // 本周完成率（新增，百分比）
}
```

### WeeklyTrend
```java
@Data
@Builder
public class WeeklyTrend {
    private String date;              // 日期 YYYY-MM-DD
    private String dayOfWeek;         // 星期名称
    private long pending;             // 当天待处理数
    private long completed;           // 当天完成数
}
```

### CategoryStat
```java
@Data
@Builder
public class CategoryStat {
    private String category;           // 报修类型
    private long count;               // 数量
    private double percentage;       // 占比（百分比）
}
```

