import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {PipeModule} from './shared/pipes/pipe.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import * as Shared from './shared/';
import {MeteoService} from './shared/meteo/meteo-service.service';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {EventiRichiestaComponent} from './eventi-richiesta/eventi-richiesta.component';
import {EventoRichiestaComponent} from './eventi-richiesta/evento-richiesta/evento-richiesta.component';
import {ListaEventiRichiestaComponent} from './eventi-richiesta/lista-eventi-richiesta/lista-eventi-richiesta.component';
import {EventiRichiestaService} from './eventi-richiesta/eventi-richiesta-service/eventi-richiesta.service';
import {EventiRichiestaServiceFake} from './eventi-richiesta/eventi-richiesta-service/eventi-richiesta.service.fake';


@NgModule({
    declarations: [
        AppComponent,
        EventiRichiestaComponent,
        EventoRichiestaComponent,
        ListaEventiRichiestaComponent,
        // start import of Shared Declarations
        [
            Shared.DebounceClickDirective,
            Shared.DebounceKeyUpDirective,
            Shared.CompetenzaComponent,
            Shared.ComponenteComponent,
            Shared.MezzoComponent
            ],
        // end import of Shared Declarations
    ],
    imports: [
        BrowserModule,
        NgbModule,
        PipeModule.forRoot(),
    ],
    providers: [{provide: EventiRichiestaService, useClass: EventiRichiestaServiceFake}],
    bootstrap: [AppComponent]
})
export class AppModule {
}
