import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SintesiRichiestaModule } from '../richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.module';
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
import { ComposizioneButtonsComponent } from './shared/composizione-buttons/composizione-buttons.component';
import { SganciamentoMezzoModalComponent } from './shared/sganciamento-mezzo-modal/sganciamento-mezzo-modal.component';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
    declarations: [
        ComposizionePartenzaComponent,
        FasterComponent,
        ComposizioneAvanzataComponent,
        BoxNuovaPartenzaComponent,
        ComposizioneButtonsComponent,
        SganciamentoMezzoModalComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        SintesiRichiestaModule,
        SharedModule.forRoot(),
        NgSelectModule,
        NgxsModule.forFeature(
            [
                ComposizionePartenzaState,
                BoxPartenzaState,
                // Comp Rapida
                ComposizioneVeloceState,
                // Comp Avanzata
                ComposizioneAvanzataState
            ]
        ),
        FormsModule,
        FilterPipeModule,
    ],
    entryComponents: [
        SganciamentoMezzoModalComponent
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
