export type AppRoute = 
  | '/overview'
  | '/dashboard'
  | '/today'
  | '/practice'
  | '/practice/reading'
  | '/practice/writing'
  | '/diagnostic'
  | '/diagnostic/results'
  | '/intervention'
  | '/retest'
  | '/progress'
  | '/profile'
  | '/onboarding'
  | '/zeroclimber'
  | '/zeroclimber/onboarding'
  | '/zeroclimber/lesson';

export interface RouteState {
  currentRoute: AppRoute;
  params?: Record<string, string>;
}

export type NavigationItemKey = 'overview' | 'today' | 'practice' | 'progress' | 'profile' | 'zeroclimber';

export interface NavigationItem {
  key: NavigationItemKey;
  label: string;
  route: AppRoute;
  iconName: string;
  badge?: string | number;
  description?: string;
}

