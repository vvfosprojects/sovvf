import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { SignalRState } from './store/signalR.state';

@Injectable()
export class SignalRInterceptor implements HttpInterceptor {
    constructor(private store: Store) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const connectionId = this.store.selectSnapshot(SignalRState.connectionIdSignalR);

        if (connectionId) {
            request = request.clone({
                setHeaders: {
                    HubConnectionId: `${connectionId}`
                }
            });
        }

        return next.handle(request);
    }
}
