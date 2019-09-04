import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
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
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
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
    entryComponents: [ModalServiziComponent]
})
export class BoxesModule {

}
