import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';  // Dependency
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { SchedaRichiestaComponent } from './scheda-richiesta.component';
import { FormRichiestaComponent } from './form-richiesta/form-richiesta.component';
import { ChiamataService } from '../../../core/service/chiamata-service/chiamata.service';
import { NgxsModule } from '@ngxs/store';
import { ChiamataState } from '../store/states/scheda-telefonata/chiamata.state';
import { ClipboardState } from '../store/states/scheda-telefonata/clipboard.state';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { TagInputModule } from 'ngx-chips';

@NgModule({
    imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        TagInputModule,
        GooglePlaceModule,
        NgbModule,
        ClipboardModule,
        ReactiveFormsModule,
        SharedModule,
        UiSwitchModule.forRoot(null),
        NgxsModule.forFeature([
            ChiamataState,
            ClipboardState
        ]),
        NgxsFormPluginModule
    ],
    declarations: [
        SchedaRichiestaComponent,
        FormRichiestaComponent
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
