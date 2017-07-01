import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { SintesiRichiestaComponent } from './sintesi-richiesta/sintesi-richiesta.component';
import { ListaRichiesteComponent } from './lista-richieste/lista-richieste.component';
import { FriendlyDatePipe } from "app/shared/pipes/friendly-date.pipe";
import { FriendlyHourPipe } from "app/shared/pipes/friendly-hour.pipe";
import { TruncatePipe } from "app/shared/pipes/truncate.pipe";
import { TagCapopartenzaComponent } from "app/shared/components/tag-capopartenza/tag-capopartenza.component";
import { TagAutistaComponent } from "app/shared/components/tag-autista/tag-autista.component";
import { TagRimpiazzoComponent } from "app/shared/components/tag-rimpiazzo/tag-rimpiazzo.component";
import { ComponenteComponent } from './componente/componente.component';
import { MezzoComponent } from './mezzo/mezzo.component';

@NgModule({
  declarations: [
    AppComponent,
    SintesiRichiestaComponent,
    ListaRichiesteComponent,
    FriendlyDatePipe,
    FriendlyHourPipe,
    TruncatePipe,
    TagAutistaComponent,
    TagCapopartenzaComponent,
    TagRimpiazzoComponent,
    ComponenteComponent,
    MezzoComponent,
  ],
  imports: [
    BrowserModule,
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
