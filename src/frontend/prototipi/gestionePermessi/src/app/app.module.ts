import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GestionepermessiComponent } from './gestionepermessi/gestionepermessi.component';

import { SituazionePermessiFakeService } from "./gestionepermessi/situazione-permessi-fake.service";
import { AdapterAlberoService } from "app/gestionepermessi/adapter-albero.service";

import { TreeModule, TreeNode } from 'primeng/primeng';
import { GrowlModule, Message } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';     //accordion and accordion tab
import { MenuItem } from 'primeng/primeng';            //api
import { DataTableModule,SharedModule} from 'primeng/primeng';
import { CheckboxModule} from 'primeng/primeng';
import { ButtonModule} from 'primeng/primeng';

import {FieldsetModule} from 'primeng/primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FriendlyDatePipe } from './shared/pipes/friendly-date.pipe';
import { FriendlyHourPipe } from './shared/pipes/friendly-hour.pipe';
import { TruncatePipe } from './shared/pipes/truncate.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GestionepermessiComponent,
    FriendlyDatePipe,
    FriendlyHourPipe,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TreeModule,
    GrowlModule,
    DataTableModule,
    CheckboxModule,
    ButtonModule,
    FieldsetModule,
    BrowserAnimationsModule
  ],
  providers: [SituazionePermessiFakeService, AdapterAlberoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
