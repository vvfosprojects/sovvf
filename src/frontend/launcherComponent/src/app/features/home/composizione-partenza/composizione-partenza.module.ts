import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/*
    Module
 */
import { PipeModule } from '../../../shared/pipes/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';
import { NgSelectModule } from '@ng-select/ng-select';
import { SintesiRichiestaModule } from '../richieste/lista-richieste/sintesi-richiesta/sintesi-richiesta.module';
/*
    Component
  */
import { ComposizionePartenzaComponent } from './composizione-partenza.component';
import { ComposizioneAvanzataComponent } from './composizione-avanzata/composizione-avanzata.component';
import { FasterComponent } from './composizione-veloce/composizione-veloce.component';
import { BoxNuovaPartenzaComponent } from './shared/box-nuova-partenza/box-nuova-partenza.component';
import { MezzoComposizioneComponent } from './composizione-avanzata/mezzo-composizione/mezzo-composizione.component';
import { SquadraComposizioneComponent } from './composizione-avanzata/squadra-composizione/squadra-composizione.component';
import { ComposizioneFilterbarComponent } from './shared/filterbar/composizione-filterbar.component';
/*
    Provider
 */
import { CompPartenzaService } from '../../../core/service/comp-partenza-service/comp-partenza.service';
import { CompPartenzaServiceFake } from '../../../core/service/comp-partenza-service/comp-partenza.service.fake';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
import { MezziComposizioneState } from '../store/states/composizione-partenza/mezzi-composizione.state';
import { SquadreComposizioneState } from '../store/states/composizione-partenza/squadre-composizione.state';
import { PreAccoppiatiState } from '../store/states/composizione-partenza/pre-accoppiati.state';

@NgModule({
    declarations: [
        ComposizionePartenzaComponent,
        FasterComponent,
        ComposizioneAvanzataComponent,
        BoxNuovaPartenzaComponent,
        MezzoComposizioneComponent,
        SquadraComposizioneComponent,
        ComposizioneFilterbarComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        SintesiRichiestaModule,
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        TimeagoModule.forRoot({
            intl: TimeagoIntl,
            formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter }
        }),
        NgSelectModule,
        NgxsModule.forFeature(
            [
                MezziComposizioneState,
                SquadreComposizioneState,
                PreAccoppiatiState
            ]
        ),
    ],
    exports: [
        ComposizionePartenzaComponent
    ],
    providers: [
        { provide: CompPartenzaService, useClass: CompPartenzaServiceFake }
    ]
})
export class ComposizionePartenzaModule {
}
