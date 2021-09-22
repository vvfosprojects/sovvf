import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { FilterbarComponent } from './filterbar.component';
import { ViewModeComponent } from './view-mode/view-mode.component';
import { LoaderMarkerComponent } from './loader-marker/loader-marker.component';
import { TastoChiamataComponent } from './tasto-chiamata/tasto-chiamata.component';
import { RicercaComponent } from './ricerca/ricerca.component';
import { FiltriRichiesteComponent } from './filtri-richieste/filtri-richieste.component';
import { FiltriSchedeContattoComponent } from './filtri-schede-contatto/filtri-schede-contatto.component';
import { FiltriMezziServizioComponent } from './filtri-mezzi-servizio/filtri-mezzi-servizio.component';
import { ModalRichiesteChiuseComponent } from './filtri-richieste/modal-richieste-chiuse/modal-richieste-chiuse.component';
import { ModalZonaEmergenzaComponent } from './filtri-richieste/modal-zona-emergenza/modal-zona-emergenza.component';
import { TastoSchedeContattoComponent } from './tasto-schede-contatto/tasto-schede-contatto.component';
import { TastoChiamataMappaComponent } from './tasto-chiamata-mappa/tasto-chiamata-mappa.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FilterPipeModule,
        NgbModule,
        SharedModule
    ],
    declarations: [
        FilterbarComponent,
        RicercaComponent,
        FiltriRichiesteComponent,
        ViewModeComponent,
        TastoChiamataComponent,
        TastoChiamataMappaComponent,
        TastoSchedeContattoComponent,
        LoaderMarkerComponent,
        FiltriSchedeContattoComponent,
        FiltriMezziServizioComponent,
        ModalRichiesteChiuseComponent,
        ModalZonaEmergenzaComponent
    ],
    exports: [
        FilterbarComponent
    ]
})
export class FilterbarModule {
}
