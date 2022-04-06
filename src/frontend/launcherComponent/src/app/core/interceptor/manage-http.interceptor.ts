import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { HttpCancelService } from '../service/common/http-cancel.service';

@Injectable()
export class ManageHttpInterceptor implements HttpInterceptor {

    bypassUrls = [
        '/selezione-sede',
        '/login'
    ];
    private urlAfterRedirects;

    constructor(router: Router,
                private httpCancelService: HttpCancelService) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (!this.urlAfterRedirects) {
                    this.urlAfterRedirects = event.urlAfterRedirects;
                } else {
                    if (event.urlAfterRedirects && this.urlAfterRedirects !== event.urlAfterRedirects) {
                        if (!this.bypassUrls.includes(this.urlAfterRedirects)) {
                            this.httpCancelService.cancelPendingRequests();
                        }
                        this.urlAfterRedirects = event.urlAfterRedirects;
                    }
                }
            }
        });
    }

    intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
        return next.handle(req).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
    }
}
