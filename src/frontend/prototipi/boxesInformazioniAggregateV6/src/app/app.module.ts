import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {PipeModule} from './shared/pipes/pipe.module';
import {AppComponent} from './app.component';
/**
 * Boxes Module
 */
import {BoxesModule} from './boxes/boxes.module';
/**
 * Shared Module
 */
import {SharedModule} from './shared/shared.module';
/**
 * solo per il componente
 */
import {InfoAggregateService} from './dispatcher/data/boxes-service/info-aggregate.service';
import {InfoAggregateServiceFake} from './dispatcher/data/boxes-service/info-aggregate.service.fake';
import {DispatcherInfoAggregateServiceFake} from './dispatcher/dispatcher.service.fake';
import {DispatcherInfoAggregateService} from './dispatcher/dispatcher.service';
import {BoxManagerService} from './dispatcher/manager/boxes-manager/box-manager-service.service';
import {BoxManagerServiceFake} from './dispatcher/manager/boxes-manager/box-manager-service.service.fake';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        NgbModule,
        PipeModule,
        BoxesModule,
        SharedModule,
    ],
    providers: [
        {provide: BoxManagerService, useClass: BoxManagerServiceFake},
        {provide: DispatcherInfoAggregateService, useClass: DispatcherInfoAggregateServiceFake},
        {provide: InfoAggregateService, useClass: InfoAggregateServiceFake}
        ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
