import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private API_URI = environment.API_URL;
  constructor(private httpClient: HttpClient) { }

  secureGet(url: string, params?:HttpParams): Observable<any>{
    return this.httpClient.get(`${this.API_URI}/api/${url}`, { params });
  }

  securePost(url: string, body?: any): Observable<any>{
    return this.httpClient.post(`${this.API_URI}/api/${url}`, body);
  }

  securePut(url: string, body?: any): Observable<any>{
    return this.httpClient.put(`${this.API_URI}/api/${url}`, body);
  }

  secureDelete(url: string): Observable<any>{
    return this.httpClient.delete(`${this.API_URI}/api/${url}`);
  }

}
