import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ComposizionePartenzaComponent } from './composizione-partenza.component';
import { ComposizioneAvanzataComponent } from './composizione-avanzata/composizione-avanzata.component';
import { FasterComponent } from './composizione-veloce/composizione-veloce.component';
import { BoxNuovaPartenzaComponent } from './shared/box-nuova-partenza/box-nuova-partenza.component';
import { NgxsModule } from '@ngxs/store';
import { ComposizioneVeloceState } from '../store/states/composizione-partenza/composizione-veloce.state';
import { ComposizioneAvanzataState } from '../store/states/composizione-partenza/composizione-avanzata.state';
import { ComposizionePartenzaState } from '../store/states/composizione-partenza/composizione-partenza.state';
import { BoxPartenzaState } from '../store/states/composizione-partenza/box-partenza.state';
import { ComposizioneConfirmButtonComponent } from './shared/composizione-buttons/composizione-confirm-button.component';
import { FormsModule } from '@angular/forms';
import { ComposizioneSoccorsoAereoState } from '../store/states/composizione-partenza/composizione-soccorso-aereo.state';
import { BoxPreaccoppiatoComponent } from './shared/box-preaccoppiato/box-preaccoppiato.component';
import { ListaPartenzeComposizioneComponent } from './shared/lista-partenze-composizione/lista-partenze-composizione.component';

@NgModule({
    declarations: [
        ComposizionePartenzaComponent,
        FasterComponent,
        ComposizioneAvanzataComponent,
        BoxNuovaPartenzaComponent,
        BoxPreaccoppiatoComponent,
        ComposizioneConfirmButtonComponent,
        ListaPartenzeComposizioneComponent
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
        FormsModule
    ],
    exports: [
        ComposizionePartenzaComponent
    ]
})
export class ComposizionePartenzaModule {
}
