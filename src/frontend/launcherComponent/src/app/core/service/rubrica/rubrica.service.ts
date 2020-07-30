import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

const BASE_URL = environment.baseUrl;
const API_ENTE = BASE_URL + environment.apiUrl.enti;


@Injectable({
  providedIn: 'root'
})
export class RubricaService {

  constructor(private http: HttpClient) {
  }

  getEnti(): Observable<any> {
      return this.http.get(API_ENTE);
  }

 
}