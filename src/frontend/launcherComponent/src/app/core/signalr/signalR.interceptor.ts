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

    constructor() {
        this.subscription.add(this.connectionId$.subscribe(result => this.connectionId = result));
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.connectionId) {
            request = request.clone({
                setHeaders: {
                    HubConnectionId: `${this.connectionId}`
                }
            });
        }

        return next.handle(request);
    }
}
