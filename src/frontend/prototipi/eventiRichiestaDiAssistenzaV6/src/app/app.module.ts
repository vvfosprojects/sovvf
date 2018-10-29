import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
/**
 * Eventi Richiesta Module
 */
import {EventiRichiestaModule} from './eventi/eventi-richiesta.module';
/**
 * Shared Module
 */
import {SharedModule} from './shared/shared.module';
/**
 * solo per il componente
 */
import {EventiRichiestaService} from './core/service/eventi-richiesta-service/eventi-richiesta.service';
import {EventiRichiestaServiceFake} from './core/service/eventi-richiesta-service/eventi-richiesta.service.fake';
import {EventiManagerService} from './core/manager/eventi-richiesta-manager/eventi-manager-service.service';
import {EventiManagerServiceFake} from './core/manager/eventi-richiesta-manager/eventi-manager-service.service.fake';
import {DispatcherEventiRichiestaService} from './core/dispatcher/dispatcher-eventi-richiesta.service';
import {DispatcherEventiRichiestaServiceFake} from './core/dispatcher/dispatcher-eventi-richiesta.service.fake';


@NgModule({
    declarations: [
        AppComponent

    ],
    imports: [
        BrowserModule,
        NgbModule,
        PipeModule.forRoot(),
        SharedModule,
        EventiRichiestaModule
    ],
    providers: [
        {provide: EventiManagerService, useClass: EventiManagerServiceFake},
        {provide: DispatcherEventiRichiestaService, useClass: DispatcherEventiRichiestaServiceFake},
        {provide: EventiRichiestaService, useClass: EventiRichiestaServiceFake}
        ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
