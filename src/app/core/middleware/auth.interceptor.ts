import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from '../service/storage/local-storage/local-storage.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorage = inject(LocalStorageService);
  const cloneRequest = req.clone({
    setHeaders:{
      Authorization: `Bearer ${localStorage.getToken()}` || ''
    }
  })
  return next(cloneRequest);
};
