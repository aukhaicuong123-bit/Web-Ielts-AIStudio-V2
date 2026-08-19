import { AppRoute, NavigationItem } from '../../types/routes';

export const PRIMARY_NAV_ITEMS: NavigationItem[] = [
  {
    key: 'overview',
    label: 'Overview',
    route: '/overview',
    iconName: 'LayoutDashboard',
    description: 'Bá»©c tranh nÄƒng lá»±c & tiáº¿n Ä‘á»™ tá»•ng quan'
  },
  {
    key: 'today',
    label: 'Today',
    route: '/today',
    iconName: 'Zap',
    badge: 'Æ¯u tiÃªn',
    description: 'PhiÃªn há»c 20-30 phÃºt tá»‘i Æ°u ROI cao nháº¥t hÃ´m nay'
  },
  {
    key: 'practice',
    label: 'Practice',
    route: '/practice',
    iconName: 'BookOpen',
    description: 'Luyá»‡n táº­p chuyÃªn sÃ¢u Reading & Writing cÃ³ trÃ­ch dáº«n lá»—i'
  },
  {
    key: 'progress',
    label: 'Progress',
    route: '/progress',
    iconName: 'TrendingUp',
    description: 'BiÃªn báº£n Ä‘á»‘i chá»©ng Re-test & Mastery'
  },
  {
    key: 'profile',
    label: 'Profile',
    route: '/profile',
    iconName: 'User',
    description: 'Má»¥c tiÃªu Band & CÃ i Ä‘áº·t cÃ¡ nhÃ¢n'
  }
];

export const SECONDARY_ROUTES: Record<string, { label: string; parentRoute: AppRoute }> = {
  '/practice/reading': { label: 'Reading Practice', parentRoute: '/practice' },
  '/practice/writing': { label: 'Writing Practice', parentRoute: '/practice' },
  '/diagnostic': { label: 'Diagnostic Assessment', parentRoute: '/overview' },
  '/diagnostic/results': { label: 'Diagnostic Results', parentRoute: '/overview' },
  '/intervention': { label: 'Micro-Pathway Intervention', parentRoute: '/today' },
  '/retest': { label: 'Verification Re-Test', parentRoute: '/progress' },
  '/zeroclimber': { label: 'ZeroClimber', parentRoute: '/zeroclimber' },
  '/zeroclimber/onboarding': { label: 'ZeroClimber Onboarding', parentRoute: '/zeroclimber' },
  '/zeroclimber/lesson': { label: 'ZeroClimber Lesson', parentRoute: '/zeroclimber' }
};

