import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  constructor(private httpService: HttpService) {}
  getInterview(filter: any): Observable<any> {
    const httpParams: HttpParams = new HttpParams({ fromObject: filter });
    return this.httpService.secureGet(`interview`, httpParams);
  }
  getInterviewById(interviewId: string): Observable<any> {
    return this.httpService.secureGet(`interview/${interviewId}`);
  }

  deleteInterview(interviewId: string): Observable<any> {
    return this.httpService.secureDelete(`interview/${interviewId}`);
  }

  scheduleInterview(interview: any): Observable<any> {
    return this.httpService.securePost('interview', interview);
  }

  endInterview(interviewId: string): Observable<any> {
    return this.httpService.securePut(`interview/${interviewId}/end`);
  }

  updateInterview(updatedInterview: any): Observable<any> {
    const { _id, ...restInterview } = updatedInterview;
    return this.httpService.securePut(`interview/${_id}`, restInterview);
  }

  // Challenges
  getChallenges(interviewId: string, query?: any): Observable<any> {
    const httpParam: HttpParams = new HttpParams({ fromObject: query });
    return this.httpService.secureGet(
      `interview/${interviewId}/challenge`,
      httpParam
    );
  }

  getCandidateInterviewChallenge(obj: {
    interviewSessionId: string;
    challengeSessionId: string;
  }): Observable<any> {
    return this.httpService.secureGet(
      `interview/${obj.interviewSessionId}/challenge/${obj.challengeSessionId}`
    );
  }

  startInterviewChallenge(obj: {
    interviewSessionId: string;
    challengeSessionId: string;
  }): Observable<any> {
    return this.httpService.securePut(
      `interview/${obj.interviewSessionId}/challenge/${obj.challengeSessionId}/start`
    );
  }

  endInterviewChallenge(obj: {
    interviewSessionId: string;
    challengeSessionId: string;
  }): Observable<any> {
    return this.httpService.securePut(
      `interview/${obj.interviewSessionId}/challenge/${obj.challengeSessionId}/end`
    );
  }

  createChallenge(obj: any): Observable<any> {
    return this.httpService.securePost(
      `interview/${obj.interviewSessionId}/challenge`,
      obj.challenge
    );
  }

  updateChallenge(obj: any): Observable<any> {
    const { interviewSessionId, challengeId, ...restChallenge } = obj;

    return this.httpService.securePut(
      `interview/${interviewSessionId}/challenge/${challengeId}`,
      restChallenge.challenge
    );
  }

  deleteChallenge(obj: {
    interviewSessionId: string;
    challengeId: string;
  }): Observable<any> {
    return this.httpService.secureDelete(
      `interview/${obj.interviewSessionId}/challenge/${obj.challengeId}`
    );
  }

  //Update Stackblitz Data
  updateStackblitzData(
    interviewSessionId: string,
    challengeId: string,
    stackblitzData: any
  ): Observable<any> {
    return this.httpService.securePut(
      `interview/${interviewSessionId}/challenge/${challengeId}/update-response`,
      stackblitzData
    );
  }

  // Challenge Response Template Checker
  static detectProjectTemplate(files: any): string {
    if (files['angular.json']) return 'angular-cli';
    if (files['package.json'] && files['package.json'].includes('"react"')){
      // if (files['next.config.js'] || files['package.json'].includes('"next"')) {
      //   return 'nextjs';
      // }
      return 'create-react-app';}
    if (files['index.html'] && files['script.js']) return 'html';
    if (files['index.js']) return 'javascript';
    if (files['server.js'] || files['index.ts']) return 'node';
    if (files['tsconfig.json']) return 'typescript';
    if (files['polymer.json']) return 'polymer';
    if (files['vue.config.js']) return 'vue';
    return 'javascript';
  }

  static getProjectId(url: any): string {


    const match = url.changingThisBreaksApplicationSecurity.match(
      /stackblitz\.com\/edit\/([^?]+)/
    );
    return match ? match[1] : '';
  }
}
