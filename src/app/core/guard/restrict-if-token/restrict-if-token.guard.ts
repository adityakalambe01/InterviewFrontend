import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../../service/storage/local-storage/local-storage.service';
import { InterviwerRouteConstant } from '../../../pages/interviwer/interviwer.routes';

export const restrictIfTokenGuard: CanActivateFn = (route, state) => {
  const router:Router = inject(Router);
  const localStorageServ:LocalStorageService = inject(LocalStorageService);

  if(localStorageServ.getToken()){
    return router.navigateByUrl(InterviwerRouteConstant.MAIN_PAGE);
  }
  return true;
};
