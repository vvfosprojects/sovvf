import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedaRichiestaComponent } from './scheda-richiesta.component';
import { FormRichiestaComponent } from './form-richiesta/form-richiesta.component';
import { ChiamataService } from '../../../core/service/chiamata-service/chiamata.service';
import { NgxsModule } from '@ngxs/store';
import { SchedaTelefonataState } from '../store/states/form-richiesta/scheda-telefonata.state';
import { ClipboardState } from '../store/states/form-richiesta/clipboard.state';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { TagInputModule } from 'ngx-chips';
import { RichiestaModificaState } from '../store/states/form-richiesta/richiesta-modifica.state';
import { RicercaIndirizzoComponent } from './form-richiesta/ricerca-indirizzo/ricerca-indirizzo.component';

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        TagInputModule,
        ClipboardModule,
        ReactiveFormsModule,
        NgbModule,
        SharedModule,
        UiSwitchModule.forRoot(null),
        NgxsModule.forFeature([
            SchedaTelefonataState,
            RichiestaModificaState,
            ClipboardState
        ]),
        NgxsFormPluginModule
    ],
    declarations: [
        SchedaRichiestaComponent,
        FormRichiestaComponent,
        RicercaIndirizzoComponent
    ],
    exports: [
        SchedaRichiestaComponent
    ],
    providers: [
        ChiamataService
    ]
})
export class SchedaRichiestaModule {
}
