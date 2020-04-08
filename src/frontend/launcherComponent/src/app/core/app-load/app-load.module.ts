import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppLoadService } from './app-load.service';
import { RpcConnectionService } from '../rpc/rpc-connection.service';

export function init_app(appLoadService: AppLoadService) {
    return () => appLoadService.initializeApp();
}

export function get_rpc(rpcService: RpcConnectionService) {
    return () => rpcService.initializeRpc();
}

@NgModule({
    imports: [HttpClientModule],
    providers: [
        AppLoadService,
        RpcConnectionService,
        { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
        { provide: APP_INITIALIZER, useFactory: get_rpc, deps: [RpcConnectionService], multi: true }
    ]
})
export class AppLoadModule {
}
