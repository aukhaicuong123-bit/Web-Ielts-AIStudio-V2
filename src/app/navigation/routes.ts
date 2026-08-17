import { AppRoute, NavigationItem } from '../../types/routes';

export const PRIMARY_NAV_ITEMS: NavigationItem[] = [
  {
    key: 'overview',
    label: 'Overview',
    route: '/overview',
    iconName: 'LayoutDashboard',
    description: 'Bức tranh năng lực & tiến độ tổng quan'
  },
  {
    key: 'today',
    label: 'Today',
    route: '/today',
    iconName: 'Zap',
    badge: 'Ưu tiên',
    description: 'Phiên học 20-30 phút tối ưu ROI cao nhất hôm nay'
  },
  {
    key: 'practice',
    label: 'Practice',
    route: '/practice',
    iconName: 'BookOpen',
    description: 'Luyện tập chuyên sâu Reading & Writing có trích dẫn lỗi'
  },
  {
    key: 'progress',
    label: 'Progress',
    route: '/progress',
    iconName: 'TrendingUp',
    description: 'Biên bản đối chứng Re-test & Mastery'
  },
  {
    key: 'profile',
    label: 'Profile',
    route: '/profile',
    iconName: 'User',
    description: 'Mục tiêu Band & Cài đặt cá nhân'
  }
];

export const SECONDARY_ROUTES: Record<string, { label: string; parentRoute: AppRoute }> = {
  '/practice/reading': { label: 'Reading Practice', parentRoute: '/practice' },
  '/practice/writing': { label: 'Writing Practice', parentRoute: '/practice' },
  '/diagnostic': { label: 'Diagnostic Assessment', parentRoute: '/overview' },
  '/diagnostic/results': { label: 'Diagnostic Results', parentRoute: '/overview' },
  '/intervention': { label: 'Micro-Pathway Intervention', parentRoute: '/today' },
  '/retest': { label: 'Verification Re-Test', parentRoute: '/progress' }
};
