import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { environment } from '../../../../environments/environment';

const API_URL_USERS = environment.apiUrl.users;


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${API_URL_USERS}`);
    }

    getById(id: number) {
        return this.http.get<User>(`${API_URL_USERS}/${id}`);
    }
}
