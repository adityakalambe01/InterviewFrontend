import { Routes } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";
import { authRoutes } from "./auth/auth.routes";
import { interviwerRoutes } from "./interviwer/interviwer.routes";
import { candidateRoutes } from "./candidate/candidate.routes";

export const PagesRouteConstants = {
  notFound: 'not-found',
};
export const pagesRoutes: Routes = [
  ...authRoutes,
  ...interviwerRoutes,
  ...candidateRoutes,
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
