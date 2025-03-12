import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private httpService: HttpService) { }

  getProjects(pageQueryParams:any):Observable<any>{
    const params = new HttpParams({fromObject: pageQueryParams});
    return this.httpService.secureGet('project', params);
  }

  getProject(projectId:String):Observable<any>{
    return this.httpService.secureGet(`project/${projectId}`);
  }

  deleteProject(projectId:String):Observable<any>{
    return this.httpService.secureDelete(`project/${projectId}`);
  }

  newProject(newProject:any):Observable<any>{
    const {_id, ...restProject} = newProject;
    return this.httpService.securePost('project', restProject);
  }

  updateProject(existingProject:any):Observable<any>{
    const {_id, ...restProject} = existingProject;
    return this.httpService.securePut(`project/${_id}`, restProject);
  }
}
