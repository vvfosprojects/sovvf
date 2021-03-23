import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Welcome } from '../../../shared/interface/welcome.interface';

const BASE_URL = environment.baseUrl;
const API_WELCOME = BASE_URL + environment.apiUrl.welcome;

@Injectable()
export class HomeService {

    constructor(private http: HttpClient) {
    }

    getHome(): Observable<Welcome> {
        return this.http.get<Welcome>(API_WELCOME);
    }
}
