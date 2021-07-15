import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedaRichiestaComponent } from './scheda-richiesta.component';
import { NgxsModule } from '@ngxs/store';
import { ClipboardState } from '../store/states/form-richiesta/clipboard.state';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { RichiestaModificaState } from '../store/states/form-richiesta/richiesta-modifica.state';

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        SharedModule,
        ClipboardModule,
        ReactiveFormsModule,
        NgbModule,
        UiSwitchModule.forRoot(null),
        NgxsModule.forFeature([
            RichiestaModificaState,
            ClipboardState
        ]),
        NgxsFormPluginModule
    ],
    declarations: [
        SchedaRichiestaComponent,
    ],
    exports: [
        SchedaRichiestaComponent
    ]
})
export class SchedaRichiestaModule {
}
