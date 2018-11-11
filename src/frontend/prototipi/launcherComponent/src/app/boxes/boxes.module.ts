import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {InfoAggregateComponent} from './info-aggregate/info-aggregate.component';
import {BoxPersonaleComponent} from './info-aggregate/box-personale/box-personale.component';
import {BoxInterventiComponent} from './info-aggregate/box-interventi/box-interventi.component';
import {BoxMezziComponent} from './info-aggregate/box-mezzi/box-mezzi.component';
import {BoxMeteoComponent} from './info-aggregate/box-meteo/box-meteo.component';
import {PipeModule} from '../shared/pipes/pipe.module';
import {SharedModule} from '../shared/shared.module';
import {BoxManagerService} from '../core/manager/boxes-manager/box-manager-service.service';
import {BoxManagerServiceFake} from '../core/manager/boxes-manager/box-manager-service.service.fake';
import {DispatcherInfoAggregateService} from '../core/dispatcher/dispatcher-boxes.service';
import {DispatcherInfoAggregateServiceFake} from '../core/dispatcher/dispatcher-boxes.service.fake';
import {InfoAggregateService} from '../core/service/boxes-service/info-aggregate.service';
import {InfoAggregateServiceFake} from '../core/service/boxes-service/info-aggregate.service.fake';
import { ModalServiziComponent } from './info-aggregate/modal-servizi/modal-servizi.component';


@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        PipeModule.forRoot(),
        SharedModule.forRoot()
    ],
    declarations: [
        InfoAggregateComponent,
        BoxPersonaleComponent,
        BoxInterventiComponent,
        BoxMezziComponent,
        BoxMeteoComponent,
        ModalServiziComponent
    ],
    exports: [
        InfoAggregateComponent
    ],
    entryComponents: [ModalServiziComponent],
    providers: [
        {provide: BoxManagerService, useClass: BoxManagerServiceFake},
        {provide: DispatcherInfoAggregateService, useClass: DispatcherInfoAggregateServiceFake},
        {provide: InfoAggregateService, useClass: InfoAggregateServiceFake}
    ]
})
export class BoxesModule {

}
