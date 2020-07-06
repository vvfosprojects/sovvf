import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { ReactiveFormsModule } from '@angular/forms';
import { ChiamataComponent } from './chiamata.component';
import { SchedaTelefonataComponent } from './scheda-telefonata/scheda-telefonata.component';
import { ChiamataService } from '../../../core/service/chiamata-service/chiamata.service';
import { NgxsModule } from '@ngxs/store';
import { SchedaTelefonataState } from '../store/states/chiamata/scheda-telefonata.state';
import { ClipboardState } from '../store/states/chiamata/clipboard.state';
import { ConfirmModalComponent, RichiestaDuplicataModalComponent } from '../../../shared';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TagInputModule} from 'ngx-chips';

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
            SchedaTelefonataState,
            ClipboardState
        ]),
        NgxsFormPluginModule
    ],
    declarations: [
        ChiamataComponent,
        SchedaTelefonataComponent
    ],
    exports: [
        ChiamataComponent
    ],
    entryComponents: [ConfirmModalComponent, RichiestaDuplicataModalComponent],
    providers: [
        ChiamataService
    ]
})
export class ChiamataModule {
}
