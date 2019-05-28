import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppLoadService } from './app-load.service';

export function init_app(appLoadService: AppLoadService) {
    return () => appLoadService.initializeApp();
}


@NgModule({
    imports: [HttpClientModule],
    providers: [
        AppLoadService,
        { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
    ]
})
export class AppLoadModule {
}
