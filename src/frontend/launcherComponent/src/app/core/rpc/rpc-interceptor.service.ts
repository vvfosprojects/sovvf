import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RpcStoreService } from './rpc-store.service';

@Injectable()
export class RpcInterceptor implements HttpInterceptor {
    constructor(private rcpStore: RpcStoreService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const localIp = this.rcpStore.currentLocalIpValue;
        const generateTokenEsriUrl = 'https://gis.dipvvf.it/portal/sharing/rest/generateToken';

        if (localIp && request.url !== generateTokenEsriUrl) {
            request = request.clone({
                setHeaders: {
                    LocalIp: `${localIp}`
                }
            });
        }

        return next.handle(request);
    }
}
