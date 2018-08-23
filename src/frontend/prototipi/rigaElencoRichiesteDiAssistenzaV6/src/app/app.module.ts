import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {SintesiRichiesteService} from './sintesi-richieste-service/sintesi-richieste.service';
import {SintesiRichiesteServiceFake} from './sintesi-richieste-service/sintesi-richieste.service.fake';
import {SintesiRichiestaComponent} from './sintesi-richiesta/sintesi-richiesta.component';
import {ListaRichiesteComponent} from './lista-richieste/lista-richieste.component';
import {FriendlyDatePipe} from './shared/pipes/friendly-date.pipe';
import {FriendlyHourPipe} from './shared/pipes/friendly-hour.pipe';
import {TagCapopartenzaComponent} from './shared/components/tag-capopartenza/tag-capopartenza.component';
import {TagAutistaComponent} from './shared/components/tag-autista/tag-autista.component';
import {TagRimpiazzoComponent} from './shared/components/tag-rimpiazzo/tag-rimpiazzo.component';
import {ComponenteComponent} from './componente/componente.component';
import {MezzoComponent} from './mezzo/mezzo.component';
import {FiltriComponent} from './filtri/filtri.component';
import {FiltroComponent} from './filtri/filtro/filtro.component';
import {RicercaRichiesteComponent} from './ricerca-richieste/ricerca-richieste.component';
import {CompetenzaComponent} from './competenza/competenza.component';
import {EsriMapComponent} from './esri/esri-map/esri-map.component';
import {FriendlyTimePipe} from './shared/pipes/friendly-time.pipe';
import {FriendlyDateTooltipPipe} from './shared/pipes/friendly-date-tooltip.pipe';
import {DebounceClickDirective} from './directive/debounce-click';

@NgModule({
    declarations: [
        AppComponent,
        SintesiRichiestaComponent,
        ListaRichiesteComponent,
        FriendlyDatePipe,
        FriendlyHourPipe,
        FriendlyTimePipe,
        FriendlyDateTooltipPipe,
        TagAutistaComponent,
        TagCapopartenzaComponent,
        TagRimpiazzoComponent,
        ComponenteComponent,
        MezzoComponent,
        FiltriComponent,
        FiltroComponent,
        RicercaRichiesteComponent,
        CompetenzaComponent,
        EsriMapComponent,
        DebounceClickDirective,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        PipeModule.forRoot(),
        FormsModule
    ],
    providers: [{provide: SintesiRichiesteService, useClass: SintesiRichiesteService}],
    bootstrap: [AppComponent]
})
export class AppModule {
}
