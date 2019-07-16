import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { environment } from '../../../../environments/environment';
/**
 Modules
 */
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { SintesiRichiestaModule } from './lista-richieste/sintesi-richiesta/sintesi-richiesta.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
/**
 Components
 */
import { RichiesteComponent } from './richieste.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { SintesiRichiestaSmComponent } from './lista-richieste/sintesi-richiesta-sm/sintesi-richiesta-sm.component';
import { RichiestaFissataComponent } from './richiesta-fissata/richiesta-fissata.component';
import { ModificaRichiestaComponent } from './modifica-richiesta/modifica-richiesta.component';
/**
 Service Provider
 */
import { SintesiRichiesteService } from '../../../core/service/lista-richieste-service/lista-richieste.service';
import { SintesiRichiesteServiceFake } from '../../../core/service/lista-richieste-service/lista-richieste.service.fake';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { RichiestaFissataState } from '../store/states/richieste/richiesta-fissata.state';
import { RichiestaHoverState } from '../store/states/richieste/richiesta-hover.state';
import { RichiestaSelezionataState } from '../store/states/richieste/richiesta-selezionata.state';
import { ListaEntiComponent } from '../../../shared';
import { ListaSquadrePartenzaComponent } from '../../../shared/components/lista-squadre-partenza/lista-squadre-partenza.component';
import { RichiesteEspanseState } from '../store/states/richieste/richieste-espanse.state';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FilterPipeModule,
        NgbModule,
        UiSwitchModule.forRoot(null),
        NgSelectModule,
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        ScrollingModule,
        SintesiRichiestaModule,
        GooglePlaceModule,
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
        }),
        NgxsModule.forFeature([
            RichiesteState,
            RichiestaFissataState,
            RichiestaHoverState,
            RichiestaSelezionataState,
            RichiesteEspanseState
        ])
    ],
    declarations: [
        RichiesteComponent,
        ListaRichiesteComponent,
        RichiestaFissataComponent,
        SintesiRichiestaSmComponent,
        ModificaRichiestaComponent,
    ],
    exports: [
        RichiesteComponent,
        ModificaRichiestaComponent,
    ],
    entryComponents: [
        ListaEntiComponent,
        ListaSquadrePartenzaComponent
    ],
    providers: [
        { provide: SintesiRichiesteService, useClass: environment.fakeProvider ? SintesiRichiesteServiceFake : SintesiRichiesteService}
    ]
})
export class RichiesteModule {
}
