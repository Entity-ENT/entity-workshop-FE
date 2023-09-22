import { RouteType } from 'types';

import { Dashboard, Home, SignMessage, Statistics } from './pages';

export const routeNames = {
  home: '/',
  dashboard: '/dashboard',
  statistics: '/statistics',
  signMessage: '/sign-message',
  unlock: '/unlock'
};

interface RouteWithTitleType extends RouteType {
  title: string;
}

export const routes: RouteWithTitleType[] = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.statistics,
    title: 'Statistics',
    component: Statistics,
    authenticatedRoute: true
  },
  {
    path: routeNames.dashboard,
    title: 'Dashboard',
    component: Dashboard,
    authenticatedRoute: true
  },
  {
    path: routeNames.signMessage,
    title: 'Sign Message',
    component: SignMessage,
    authenticatedRoute: true
  }
];

export const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • Entity Workshop`
    : 'Entity Workshop';

  const requiresAuth = Boolean(route.authenticatedRoute);

  return {
    path: route.path,
    component: route.component,
    authenticatedRoute: requiresAuth
  };
});
