import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http, HttpModule } from "@angular/http";
import { BrowserModule } from '@angular/platform-browser';

import { PopoverModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap';

import { FriendlyDatePipe } from "./shared-richAss/pipes/friendly-date.pipe";
import { FriendlyHourPipe } from "./shared-richAss/pipes/friendly-hour.pipe";
import { TruncatePipe } from "./shared-richAss/pipes/truncate.pipe";

import { TagCapopartenzaComponent } from "./shared-richAss/components/tag-capopartenza/tag-capopartenza.component";
import { TagAutistaComponent } from "./shared-richAss/components/tag-autista/tag-autista.component";
import { TagRimpiazzoComponent } from "./shared-richAss/components/tag-rimpiazzo/tag-rimpiazzo.component";

import { SintesiRichiesteService } from "./sintesi-richieste-service/sintesi-richieste.service";
import { SintesiRichiesteServiceFake } from "./sintesi-richieste-service/sintesi-richieste.service.fake";

import { FiltroComponent } from "./filtro/filtro.component";

import { SintesiRichiestaComponent } from "./sintesi-richiesta/sintesi-richiesta.component";
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';

import { ComponenteComponent } from "./componente/componente.component";
import { MezzoComponent } from "./mezzo/mezzo.component";

import {DialogModule} from 'primeng/primeng';

import { EventiRichAssModule } from '../eventi-rich-ass/eventi-rich-ass.module';

@NgModule({
    imports: [CommonModule, DialogModule, EventiRichAssModule, PopoverModule.forRoot(), TooltipModule.forRoot()],
    declarations: [SintesiRichiestaComponent, 
                   ListaRichiesteComponent,
                   ComponenteComponent, 
                   MezzoComponent, 
                   FriendlyDatePipe, 
                   FriendlyHourPipe, 
                   TruncatePipe, 
                   TagCapopartenzaComponent, 
                   FiltroComponent,
                   TagAutistaComponent, 
                   TagRimpiazzoComponent],
    exports: [SintesiRichiestaComponent, 
              TagCapopartenzaComponent, 
              FiltroComponent,
              TagAutistaComponent, 
              TagRimpiazzoComponent,
              ListaRichiesteComponent,
              ComponenteComponent, 
              MezzoComponent],
    providers: [{ provide: SintesiRichiesteService, useClass: SintesiRichiesteServiceFake }]
})
export class RichAssModule { }