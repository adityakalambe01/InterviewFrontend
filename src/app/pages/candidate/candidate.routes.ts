import { Routes } from "@angular/router";
import { InterviewChallengeComponent } from "./interview-challenge/interview-challenge.component";
import { InterviewChallengeSubmittedComponent } from "./interview-challenge-submitted/interview-challenge-submitted.component";

export const candidateRoutesConstant = {
  submitResponse: '/submit/response'
}
export const candidateRoutes: Routes = [
  {
    path: 'candidate/interview/:interviewSessionId/live-exam/:challengeSessionId',
    children: [
      {
        path: '',
        component: InterviewChallengeComponent,
      },
      {
        path: 'submit/response',
        component: InterviewChallengeSubmittedComponent,
      },
    ],
  },
];
