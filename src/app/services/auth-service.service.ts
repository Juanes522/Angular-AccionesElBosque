import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private API_SERVER = "http://localhost:8080/user/create"

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  registerUser(userData: any): Observable<any> {
    return this.http.post(this.API_SERVER, userData);
  }

}
