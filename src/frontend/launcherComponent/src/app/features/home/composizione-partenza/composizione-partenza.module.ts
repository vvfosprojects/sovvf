import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComposizionePartenzaComponent } from './composizione-partenza.component';
import { ComposizioneAvanzataComponent } from './composizione-avanzata/composizione-avanzata.component';
import { FasterComponent } from './composizione-veloce/composizione-veloce.component';
import { BoxNuovaPartenzaComponent } from './shared/box-nuova-partenza/box-nuova-partenza.component';
import { AttivitaUtenteService } from '../../../core/service/attivita-utente-service/attivita-utente.service';
import { NgxsModule } from '@ngxs/store';
import { ComposizioneVeloceState } from '../store/states/composizione-partenza/composizione-veloce.state';
import { ComposizioneAvanzataState } from '../store/states/composizione-partenza/composizione-avanzata.state';
import { ComposizionePartenzaState } from '../store/states/composizione-partenza/composizione-partenza.state';
import { BoxPartenzaState } from '../store/states/composizione-partenza/box-partenza.state';
import { ComposizioneConfirmButtonComponent } from './shared/composizione-buttons/composizione-confirm-button.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComposizioneSoccorsoAereoState } from '../store/states/composizione-partenza/composizione-soccorso-aereo.state';

@NgModule({
    declarations: [
        ComposizionePartenzaComponent,
        FasterComponent,
        ComposizioneAvanzataComponent,
        BoxNuovaPartenzaComponent,
        ComposizioneConfirmButtonComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        SharedModule,
        NgSelectModule,
        NgxsModule.forFeature(
            [
                // Comp Partenza Generico
                ComposizionePartenzaState,
                // Box Partenza
                BoxPartenzaState,
                // Comp Rapida
                ComposizioneVeloceState,
                // Comp Avanzata
                ComposizioneAvanzataState,
                // Comp Soccorso Aereo
                ComposizioneSoccorsoAereoState
            ]
        ),
        NgxPaginationModule,
        FormsModule
    ],
    exports: [
        ComposizionePartenzaComponent
    ],
    providers: [
        AttivitaUtenteService
    ]
})
export class ComposizionePartenzaModule {
}
