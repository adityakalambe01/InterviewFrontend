import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../../service/storage/local-storage/local-storage.service';
import { authRouteConstant } from '../../../pages/auth/auth.routes';

export const authGuard: CanActivateFn = (route, state) => {
  const localStorageServ:LocalStorageService = inject(LocalStorageService);
  const router:Router = inject(Router);
  const authRouteConst = authRouteConstant;
  if(!localStorageServ.getToken()){
    return router.navigateByUrl(authRouteConst.LOGIN)
  }
  return true;
};
