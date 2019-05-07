import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import { NavigationEnd, Router } from '@angular/router';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private grantPath = [RoutesPath.Login.toString()];
    private skipRedirect = false;


    constructor(private router: Router, private authenticationService: AuthenticationService) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.grantPath.includes(val.urlAfterRedirects.slice(1)) ? this.skipRedirect = true : this.skipRedirect = false;
            }
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1) {
                this.authenticationService.logout();
                if (!this.skipRedirect) {
                    window.location.reload();
                }
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
