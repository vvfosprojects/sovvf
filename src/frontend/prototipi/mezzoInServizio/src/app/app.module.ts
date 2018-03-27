import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { MezzoinservizioComponent } from './mezzoinservizio/mezzoinservizio.component';
import { FriendlyDatePipe } from './shared/pipes/friendly-date.pipe';
import { FriendlyHourPipe } from './shared/pipes/friendly-hour.pipe';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { TagCapopartenzaComponent } from './shared/components/tag-capopartenza/tag-capopartenza.component';
import { TagAutistaComponent } from './shared/components/tag-autista/tag-autista.component';
import { ListaMezziComponent } from './lista-mezzi/lista-mezzi.component';
import { ListaMezziService } from "app/lista-mezzi/lista-mezzi.service";
import { ListaMezziService_Fake } from "app/lista-mezzi/lista-mezzi-fake.service";
import { ListaMezziService_FakeJson } from "app/lista-mezzi/lista-mezzi-fake-json.service";
import { ModificaStatoService } from "app/modifica-stato-mezzo.service";
import { ModificaStatoService_Fake } from "app/modifica-stato-mezzo-fake.service";
import { ModificaStatoMezzoService_FakeJson } from "app/modifica-stato-mezzo-fake-json.service";

import {SelectItem} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';
import { GrowlModule, Message } from 'primeng/primeng';


@NgModule({
  declarations: [
    AppComponent,
    MezzoinservizioComponent,
    FriendlyDatePipe,
    FriendlyHourPipe,
    TruncatePipe,
    TagCapopartenzaComponent,
    TagAutistaComponent,
    ListaMezziComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    GrowlModule,
    NgbModule.forRoot()
  ],
  providers: [
    { provide: ListaMezziService, useClass: ListaMezziService_FakeJson },
    { provide: ModificaStatoService, useClass: ModificaStatoMezzoService_FakeJson}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
