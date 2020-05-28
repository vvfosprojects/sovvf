import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterbarComponent } from './filterbar.component';
import { ViewModeComponent } from './view-mode/view-mode.component';
import { FiltriMappaComponent } from './filtri-mappa/filtri-mappa.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { LoaderMarkerComponent } from './loader-marker/loader-marker.component';
import { TastiTelefonataGroupComponent } from './tasti-telefonata-group/tasti-telefonata-group.component';
import { TastoChiamataComponent } from './tasti-telefonata-group/tasto-chiamata/tasto-chiamata.component';
import { TastoSchedeContattoComponent } from './tasti-telefonata-group/tasto-schede-contatto/tasto-schede-contatto.component';
import { RicercaComponent } from './ricerca/ricerca.component';
import { FiltriRichiesteComponent } from './filtri-richieste/filtri-richieste.component';
import { FiltroComponent } from '../../../shared/components/filtro/filtro.component';
import { FiltriSchedeContattoComponent } from './filtri-schede-contatto/filtri-schede-contatto.component';
import { FiltriMezziServizioComponent } from './filtri-mezzi-servizio/filtri-mezzi-servizio.component';
import { ModalFiltriTipologiaComponent } from './filtri-richieste/modal-filtri-tipologia/modal-filtri-tipologia.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FilterPipeModule,
        NgxPaginationModule,
        NgbModule,
        SharedModule.forRoot(),
        UiSwitchModule.forRoot(null)
    ],
    declarations: [
        FilterbarComponent,
        RicercaComponent,
        FiltriRichiesteComponent,
        FiltroComponent,
        ViewModeComponent,
        FiltriMappaComponent,
        TastoChiamataComponent,
        LoaderMarkerComponent,
        TastoSchedeContattoComponent,
        TastiTelefonataGroupComponent,
        FiltriSchedeContattoComponent,
        FiltriMezziServizioComponent,
        ModalFiltriTipologiaComponent
    ],
    exports: [
        FilterbarComponent
    ]
})
export class FilterbarModule {
}
