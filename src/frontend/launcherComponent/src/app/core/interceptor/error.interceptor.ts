import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../shared/enum/toastr';
import { AuthState } from '../../features/auth/store/auth.state';
import { ClearCurrentUser } from '../../features/auth/store/auth.actions';
import { LSNAME } from '../settings/config';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router,
                private store: Store) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {

            const errorMsg = err.error && err.error.message ? err.error.message : `${LSNAME.defaultErrorMsg} ${LSNAME.emailError}`;

            if ([ 401 ].indexOf(err.status) !== -1) {
                if (this.store.selectSnapshot(AuthState.currentUser)) {
                    this.store.dispatch(new ClearCurrentUser(true));
                    this.store.dispatch(new ShowToastr(ToastrType.Error, 'Errore', errorMsg, null, null, true));
                }
            } else {
                this.store.dispatch(new ShowToastr(ToastrType.Error, 'Errore', errorMsg, null, null, true));
            }

            return throwError(err);

        }));
    }
}
