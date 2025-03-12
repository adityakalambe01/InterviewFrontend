import { Routes } from "@angular/router";
import { InterviwerComponent } from "./interviwer.component";
import { IDashboardComponent } from "./idashboard/idashboard.component";
import { IProjectsComponent } from "./iprojects/iprojects.component";
import { authGuard } from "../../core/guard/auth/auth.guard";
import { IInterviewComponent } from "./iinterview/iinterview.component";
import { IChallengeComponent } from "./ichallenge/ichallenge.component";

export const InterviwerRouteConstant = {
  MAIN_PAGE: '/admin/projects',
  PROJECT_PAGE: '/admin/projects',
  INTERVIEW_PAGE: '/admin/interview',
  CHALLENGE_PAGE: '/admin/interview/interviewId/challenge',
};

export const interviwerRoutes:Routes = [
  {
    path: 'admin',
    component: InterviwerComponent,
    canActivate: [authGuard],
    children:[
      {
        path:'',
        component: IDashboardComponent
      },
      {
        path: 'projects',
        component: IProjectsComponent
      },
      {
        path: 'interview',
        children:[
          {
            path: '',
          component: IInterviewComponent,
          },
          {
            path: ':interviewSessionId/challenge',
            component: IChallengeComponent
          }
        ]
      },

    ]
  },
]
