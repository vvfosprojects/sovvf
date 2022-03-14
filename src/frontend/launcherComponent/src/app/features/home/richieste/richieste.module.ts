/**
 * Modules
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import { TagInputModule } from 'ngx-chips';
/**
 * Components
 */
import { RichiesteComponent } from './richieste.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { RichiestaFissataComponent } from './richiesta-fissata/richiesta-fissata.component';
/**
 * Ngxs
 */
import { NgxsFormPluginModule } from '@ngxs/form-plugin';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FilterPipeModule,
        NgbModule,
        UiSwitchModule.forRoot(null),
        NgSelectModule,
        SharedModule.forRoot(),
        TagInputModule,
        NgxsFormPluginModule,
        SharedModule
    ],
    declarations: [
        RichiesteComponent,
        ListaRichiesteComponent,
        RichiestaFissataComponent
    ],
    exports: [
        RichiesteComponent,
        ListaRichiesteComponent
    ]
})
export class RichiesteModule {
}
