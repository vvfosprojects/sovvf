import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Welcome } from '../../../shared/interface/welcome.interface';
import { LSNAME } from '../../settings/config';

const BASE_URL = environment.baseUrl;
const API_WELCOME = BASE_URL + environment.apiUrl.welcome;

@Injectable()
export class HomeService {

    jwt = sessionStorage.getItem(LSNAME.token);
    idUtente = JSON.parse(sessionStorage.getItem(LSNAME.currentUser))?.id;
    codiceSede = JSON.parse(sessionStorage.getItem(LSNAME.cacheSedi));
    a = 'Bearer ' + this.jwt;
    headers: any;

    constructor(private http: HttpClient) {
        this.a = this.a.replace('"', '').replace('"', '');
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.a, CodiceSede: this.codiceSede, IdUtente: this.idUtente });
    }

    getHome(): Observable<Welcome> {
      return this.http.get<Welcome>(API_WELCOME);
    }
}
