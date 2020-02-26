import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { UtenteState } from '../../features/navbar/store/states/operatore/utente.state';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private store: Store) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const currentUser = this.store.selectSnapshot(UtenteState.utente);

        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}
