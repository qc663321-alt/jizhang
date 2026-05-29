import type { Category } from '@/types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: '餐饮', type: 'expense', icon: '🍔', color: '#FFB6C1', isDefault: true },
  { id: 'cat-2', name: '交通', type: 'expense', icon: '🚗', color: '#87CEEB', isDefault: true },
  { id: 'cat-3', name: '购物', type: 'expense', icon: '🛍️', color: '#FFD700', isDefault: true },
  { id: 'cat-4', name: '娱乐', type: 'expense', icon: '🎮', color: '#98FB98', isDefault: true },
  { id: 'cat-5', name: '医疗', type: 'expense', icon: '🏥', color: '#E6E6FA', isDefault: true },
  { id: 'cat-6', name: '教育', type: 'expense', icon: '📚', color: '#DDA0DD', isDefault: true },
  { id: 'cat-7', name: '住房', type: 'expense', icon: '🏠', color: '#F0E68C', isDefault: true },
  { id: 'cat-8', name: '其他', type: 'expense', icon: '💡', color: '#D3D3D3', isDefault: true },
  { id: 'cat-9', name: '工资', type: 'income', icon: '💼', color: '#90EE90', isDefault: true },
  { id: 'cat-10', name: '奖金', type: 'income', icon: '🎁', color: '#FFD700', isDefault: true },
  { id: 'cat-11', name: '投资收益', type: 'income', icon: '📈', color: '#00CED1', isDefault: true },
  { id: 'cat-12', name: '兼职', type: 'income', icon: '💪', color: '#FFA500', isDefault: true },
  { id: 'cat-13', name: '其他收入', type: 'income', icon: '💰', color: '#DDA0DD', isDefault: true },
  { id: 'cat-14', name: '股票', type: 'investment', icon: '📊', color: '#FF6347', isDefault: true },
  { id: 'cat-15', name: '基金', type: 'investment', icon: '🗂️', color: '#4682B4', isDefault: true },
  { id: 'cat-16', name: '储蓄', type: 'investment', icon: '💰', color: '#228B22', isDefault: true },
  { id: 'cat-17', name: '其他投资', type: 'investment', icon: '📦', color: '#708090', isDefault: true },
];

export const CATEGORY_RULES: Array<{ keywords: string[]; categoryId: string }> = [
  { keywords: ['美团', '饿了么', '外卖', '餐厅', '吃饭', '餐', '肯德基', '麦当劳', '汉堡'], categoryId: 'cat-1' },
  { keywords: ['滴滴', '打车', '地铁', '公交', '加油', '停车', '高铁', '机票'], categoryId: 'cat-2' },
  { keywords: ['淘宝', '京东', '拼多多', '购物', '超市', '天猫', '唯品会', '苏宁'], categoryId: 'cat-3' },
  { keywords: ['电影', '游戏', 'KTV', '娱乐', '演出', '演唱会', '剧本杀'], categoryId: 'cat-4' },
  { keywords: ['医院', '药店', '医疗', '体检', '挂号'], categoryId: 'cat-5' },
  { keywords: ['课程', '培训', '书', '教育', '学习', '考研', '雅思'], categoryId: 'cat-6' },
  { keywords: ['房租', '水电', '物业', '网费', '取暖', '燃气'], categoryId: 'cat-7' },
  { keywords: ['工资', '薪资', '月薪', '发薪'], categoryId: 'cat-9' },
  { keywords: ['奖金', '绩效', '年终奖', '提成'], categoryId: 'cat-10' },
  { keywords: ['股票', '基金', '理财', '利息', '分红'], categoryId: 'cat-11' },
  { keywords: ['兼职', '副业', '外包', 'freelance'], categoryId: 'cat-12' },
];

export const PLATFORMS = [
  { id: 'alipay', name: '支付宝', icon: '💳', color: '#1677FF' },
  { id: 'wechat', name: '微信支付', icon: '💚', color: '#07C160' },
  { id: 'taobao', name: '淘宝', icon: '🛒', color: '#FF4400' },
  { id: 'jd', name: '京东', icon: '🔴', color: '#E53935' },
  { id: 'pinduoduo', name: '拼多多', icon: '💎', color: '#FF6034' },
  { id: 'meituan', name: '美团', icon: '🥡', color: '#FFD100' },
  { id: 'eleme', name: '饿了么', icon: '🍜', color: '#00B5E5' },
];
