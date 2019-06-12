import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { SignalRState } from './store/signalR.state';

@Injectable()
export class SignalRInterceptor implements HttpInterceptor {

    private subscription = new Subscription();

    @Select(SignalRState.connectionIdSignalR) connectionId$: Observable<string>;
    private connectionId: string;

    @Select(SignalRState.codiceSedeSignalR) codiceSede$: Observable<string>;
    private codiceSede: string;

    constructor() {
        this.subscription.add(this.connectionId$.subscribe(result => this.connectionId = result));
        this.subscription.add(this.codiceSede$.subscribe(result => this.codiceSede = result));
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.connectionId) {
            request = request.clone({
                setHeaders: {
                    HubConnectionId: `${this.connectionId}`,
                    codiceSede: `${this.codiceSede}`
                }
            });
        }

        return next.handle(request);
    }
}
