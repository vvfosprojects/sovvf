import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ShowToastr } from '../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../shared/enum/toastr';
import { ClearUtente } from '../../features/navbar/store/actions/operatore/utente.actions';
import { Navigate } from '@ngxs/router-plugin';
import { AuthenticationService } from '../auth/_services/authentication.service';
import { UtenteState } from '../../features/navbar/store/states/operatore/utente.state';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router,
                private authenticationService: AuthenticationService,
                private store: Store) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.error('err', err);
            if ([401].indexOf(err.status) !== -1) {
                if (this.store.selectSnapshot(UtenteState.utente)) {
                    this.store.dispatch(new ClearUtente());
                }
                this.store.dispatch(new Navigate(['/login']));
            }

            if ([403].indexOf(err.status) !== -1) {
                this.store.dispatch(new ShowToastr(ToastrType.Error, 'Risorsa non accessibile', err.error));
            }

            if ([400].indexOf(err.status) !== -1) {
                this.store.dispatch(new ShowToastr(ToastrType.Error, 'Errore', err.error));
            }

            if ([503].indexOf(err.status) !== -1) {
                this.store.dispatch(new ShowToastr(ToastrType.Error, 'Servizio non disponibile', err.error));
            }

            let error = '';
            if (err && err.error) {
                error = err.error.message;
            } else {
                error = err.statusText;
            }
            return throwError(error);
        }));
    }
}
