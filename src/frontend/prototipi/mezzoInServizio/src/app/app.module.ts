import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { MezzoinservizioComponent } from './mezzoinservizio/mezzoinservizio.component';
import { FriendlyDatePipe } from './shared/pipes/friendly-date.pipe';
import { FriendlyHourPipe } from './shared/pipes/friendly-hour.pipe';
import { ListaMezziComponent } from './lista-mezzi/lista-mezzi.component';
import { ListaMezziService } from "app/lista-mezzi/lista-mezzi.service";

@NgModule({
  declarations: [
    AppComponent,
    MezzoinservizioComponent,
    FriendlyDatePipe,
    FriendlyHourPipe,
    ListaMezziComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [ListaMezziService],
  bootstrap: [AppComponent]
})
export class AppModule { }
