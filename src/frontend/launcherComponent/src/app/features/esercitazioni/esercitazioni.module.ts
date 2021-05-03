import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/**
 * Component
 */
import { EsercitazioniComponent } from './esercitazioni.component';
import { SquadraEsercitazioneComponent } from './squadra-esercitazione/squadra-esercitazione.component';
import { MezzoEsercitazioneComponent } from './mezzo-esercitazione/mezzo-esercitazione.component';
/**
 * Service
 */
import { EsercitazioniService } from '../../core/service/esercitazioni-service/esercitazioni.service';
/**
 * Routing
 */
import { EsercitazioniRouting } from './esercitazioni.routing';
/**
 * Module
 */
import { SharedModule } from '../../shared/shared.module';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { EsercitazioniState } from './store/states/esercitazioni/esercitazioni.state';


@NgModule({
    declarations: [
        EsercitazioniComponent,
        SquadraEsercitazioneComponent,
        MezzoEsercitazioneComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        EsercitazioniRouting,
        NgxsModule.forFeature(
            [
                EsercitazioniState
            ]
        ),
        SharedModule
    ],
    providers: [
        EsercitazioniService
    ]
})
export class EsercitazioniModule {
}
