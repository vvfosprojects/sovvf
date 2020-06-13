import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthState } from '../../features/auth/store/auth.state';
import { SignalRState } from '../signalr/store/signalR.state';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private store: Store) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const jwt = this.store.selectSnapshot(AuthState.currentJwt);
        const idUtente = this.store.selectSnapshot(SignalRState.idUtenteSignalR);
        const connectionId = this.store.selectSnapshot(SignalRState.connectionIdSignalR);
        const codiceSede = this.store.selectSnapshot(SignalRState.codiceSedeSignalR);

        if (jwt) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwt}`,
                    HubConnectionId: `${connectionId}`,
                    CodiceSede: `${codiceSede}`,
                    IdUtente: `${idUtente}`
                }
            });
        }

        return next.handle(request);
    }
}
