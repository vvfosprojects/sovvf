import {AppComponent} from './app.component';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PipeModule} from './shared/pipes/pipe.module';
/**
 *  Maps Module
 */
import {MapsModule} from './maps/maps.module';
/**
 * Shared Module
 */
import {SharedModule} from './shared/shared.module';
/**
 *  solo per il componente
 */
import {NavComponent} from './maps-test/nav/nav.component';
import {DispatcherService} from './dispatcher/dispatcher.service';
import {DispatcherServiceFake} from './dispatcher/dispatcher.service.fake';
import {MapsService} from './dispatcher/data/maps-service/maps-service.service';
import {MapsServiceFake} from './dispatcher/data/maps-service/maps-service.service.fake';
import {MapManagerService} from './dispatcher/manager/maps-manager/map-manager-service.service';
import {MapManagerServiceFake} from './dispatcher/manager/maps-manager/map-manager-service.service.fake';


@NgModule({
    declarations: [
        AppComponent,
        NavComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        NgSelectModule,
        FormsModule,
        MapsModule,
        SharedModule,
        PipeModule,
    ],
    providers: [
        {provide: MapManagerService, useClass: MapManagerServiceFake},
        {provide: DispatcherService, useClass: DispatcherServiceFake},
        {provide: MapsService, useClass: MapsServiceFake},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
