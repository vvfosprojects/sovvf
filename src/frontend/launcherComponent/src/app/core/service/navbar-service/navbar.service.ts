import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';

const API_URL_NAVBAR = environment.apiUrl.navbar;


@Injectable()
export class NavbarService {

    constructor(private http: HttpClient) {
    }

    getNavbar() {
        return this.http.get(API_URL_NAVBAR).pipe(
            retry(3),
            catchError(handleError)
        );
    }
}
