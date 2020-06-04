import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = environment.baseUrl;
const API_MEZZI_IN_SERVIZIO = BASE_URL + environment.apiUrl.mezziInServizio;

@Injectable({
  providedIn: 'root'
})
export class MezziInServizioService {
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public getMezziInServizio(): Observable<any> {
    return this.http.get(`${API_MEZZI_IN_SERVIZIO}/GetListaMezzi`, { 'headers': this.headers });
  }
}
