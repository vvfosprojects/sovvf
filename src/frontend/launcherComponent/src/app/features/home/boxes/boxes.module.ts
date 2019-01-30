import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { InfoAggregateComponent } from './info-aggregate/info-aggregate.component';
import { BoxPersonaleComponent } from './info-aggregate/box-personale/box-personale.component';
import { BoxInterventiComponent } from './info-aggregate/box-interventi/box-interventi.component';
import { BoxMezziComponent } from './info-aggregate/box-mezzi/box-mezzi.component';
import { BoxMeteoComponent } from './info-aggregate/box-meteo/box-meteo.component';
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { SharedModule } from '../../../shared/shared.module';
import { ModalServiziComponent } from './info-aggregate/modal-servizi/modal-servizi.component';
import { BoxRichiesteService } from '../../../core/service/boxes-service/box-richieste.service';
import { BoxMezziService } from '../../../core/service/boxes-service/box-mezzi.service';
import { BoxPersonaleService } from '../../../core/service/boxes-service/box-personale.service';
import { BoxRichiesteFakeService } from '../../../core/service/boxes-service/box-richieste-fake.service';
import { BoxMezziFakeService } from '../../../core/service/boxes-service/box-mezzi-fake.service';
import { BoxPesonaleFakeService } from '../../../core/service/boxes-service/box-pesonale-fake.service';


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
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
        { provide: BoxRichiesteService, useClass: BoxRichiesteFakeService },
        { provide: BoxMezziService, useClass: BoxMezziFakeService },
        { provide: BoxPersonaleService, useClass: BoxPesonaleFakeService }
    ]
})
export class BoxesModule {

}
