import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const levelGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Get query params of the route being activated (next route)
  const nextRouteQueryParams = route.queryParamMap;

  // Get CURRENT route query params from current URL
  const currentUrl = new URL(window.location.href);

  let currentLevel = parseInt(currentUrl.searchParams.get('level') ?? '0');
  let nextLevel = parseInt(nextRouteQueryParams.get('level') ?? '0');

  let prevLevel = router
    .getCurrentNavigation()
    ?.previousNavigation?.extractedUrl.queryParamMap.get('level');

  if (nextLevel === currentLevel && prevLevel === null) return true;

  if (nextLevel === currentLevel + 1)
    if (nextLevel <= 5 && nextLevel >= 1) return true;

  router.navigateByUrl('/');
  return false;
};
