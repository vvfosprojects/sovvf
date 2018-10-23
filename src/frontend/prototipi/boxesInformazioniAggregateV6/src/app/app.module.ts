import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {PipeModule} from './shared/pipes/pipe.module';
import * as Shared from './shared/';
import {AppComponent} from './app.component';
import {InfoAggregateService} from './dispatcher/data/boxes-service/info-aggregate.service';
import {InfoAggregateServiceFake} from './dispatcher/data/boxes-service/info-aggregate.service.fake';
import {DispatcherServiceFake} from './dispatcher/dispatcher.service.fake';
import {DispatcherService} from './dispatcher/dispatcher.service';
import {BoxManagerService} from './dispatcher/manager/boxes-manager/box-manager-service.service';
import {BoxManagerServiceFake} from './dispatcher/manager/boxes-manager/box-manager-service.service.fake';

/**
 * importare solo il modulo sul launcher
 */
import {BoxesModule} from './boxes/boxes.module';



@NgModule({
    declarations: [
        AppComponent,
        [
            Shared.DebounceClickDirective,
            Shared.DebounceKeyUpDirective,
            Shared.CompetenzaComponent,
            Shared.ComponenteComponent,
            Shared.MezzoComponent
        ],
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        NgbModule,
        PipeModule.forRoot(),
        BoxesModule,
    ],
    providers: [
        {provide: BoxManagerService, useClass: BoxManagerServiceFake},
        {provide: DispatcherService, useClass: DispatcherServiceFake},
        {provide: InfoAggregateService, useClass: InfoAggregateServiceFake}
        ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
