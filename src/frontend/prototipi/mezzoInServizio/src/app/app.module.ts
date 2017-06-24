import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
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
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [
    { provide: ListaMezziService, useClass: ListaMezziService_FakeJson },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
