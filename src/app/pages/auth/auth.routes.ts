import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { restrictIfTokenGuard } from "../../core/guard/restrict-if-token/restrict-if-token.guard";

export const authRouteConstant = {
  AUTH: 'auth',
  LOGIN: '/auth/login',
  REGISTER:'/auth/register'
};

export const authRoutes: Routes = [
  {
    path: 'auth',
    canActivate: [restrictIfTokenGuard],
    children:[
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
]
