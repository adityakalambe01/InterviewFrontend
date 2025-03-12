import { inject, Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private httpClient:HttpClient = inject(HttpClient)

  protected authLogin(data:any):Observable<any>{
    return this.httpClient.post(`${environment.AUTH_API_URL}`, data)
  }
}
