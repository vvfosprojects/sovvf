import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../auth/_services';
import { NavigationEnd, Router } from '@angular/router';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { Store } from '@ngxs/store';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../shared/enum/toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private grantPath = [RoutesPath.Login.toString()];
    private skipRedirect = false;


    constructor(private router: Router,
                private authenticationService: AuthenticationService,
                private store: Store) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.grantPath.includes(val.urlAfterRedirects.slice(1)) ? this.skipRedirect = true : this.skipRedirect = false;
            }
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.error('err', err);
            if ([401].indexOf(err.status) !== -1) {
                this.authenticationService.logout();
                if (!this.skipRedirect) {
                    window.location.reload();
                }
            }

            if ([403].indexOf(err.status) !== -1) {
                this.store.dispatch(new ShowToastr(ToastrType.Error, 'Risorsa non accessibile', err.error));
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
