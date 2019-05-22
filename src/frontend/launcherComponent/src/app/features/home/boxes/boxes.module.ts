import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
/**
 * Components
 */
import { InfoAggregateComponent } from './info-aggregate/info-aggregate.component';
import { BoxPersonaleComponent } from './info-aggregate/box-personale/box-personale.component';
import { BoxInterventiComponent } from './info-aggregate/box-interventi/box-interventi.component';
import { BoxMezziComponent } from './info-aggregate/box-mezzi/box-mezzi.component';
import { BoxMeteoComponent } from './info-aggregate/box-meteo/box-meteo.component';
import { ModalServiziComponent } from './info-aggregate/modal-servizi/modal-servizi.component';
/**
 * Modules
 */
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { SharedModule } from '../../../shared/shared.module';
/**
 Service Provider
 */
import { BoxRichiesteService } from '../../../core/service/boxes-service/box-richieste.service';
import { BoxMezziService } from '../../../core/service/boxes-service/box-mezzi.service';
import { BoxPersonaleService } from '../../../core/service/boxes-service/box-personale.service';
import { BoxRichiesteFakeService } from '../../../core/service/boxes-service/box-richieste-fake.service';
import { BoxMezziFakeService } from '../../../core/service/boxes-service/box-mezzi-fake.service';
import { BoxPersonaleFakeService } from '../../../core/service/boxes-service/box-personale-fake.service';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { BoxClickState } from '../store/states/boxes/box-click.state';
import { BoxMezziState } from '../store/states/boxes/box-mezzi.state';
import { BoxPersonaleState } from '../store/states/boxes/box-personale.state';
import { BoxRichiesteState } from '../store/states/boxes/box-richieste.state';


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            BoxRichiesteState,
            BoxMezziState,
            BoxPersonaleState,
            BoxClickState,
        ])
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
        { provide: BoxRichiesteService, useClass: environment.fakeProvider ? BoxRichiesteFakeService : BoxRichiesteService},
        { provide: BoxMezziService, useClass: environment.fakeProvider ? BoxMezziFakeService : BoxMezziService},
        { provide: BoxPersonaleService, useClass: environment.fakeProvider ? BoxPersonaleFakeService : BoxPersonaleService}
    ]
})
export class BoxesModule {

}
