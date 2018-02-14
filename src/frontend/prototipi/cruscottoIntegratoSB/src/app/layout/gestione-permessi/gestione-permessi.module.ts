//import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionePermessiRoutingModule } from './gestione-permessi-routing.module';
//import { GestionepermessiComponent } from './gestione-permessi.component';

//import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//import { AppComponent } from './app.component';
import { GestionepermessiComponent } from './gestione-permessi.component';

import { SituazionePermessiFakeService } from "./servizi/situazione-permessi-fake.service";
import { AdapterAlberoService } from "./servizi/adapter-albero.service";
import { RicercaPersonaFakeService } from "./servizi/ricerca-persona-fake.service";

import { TreeModule, TreeNode } from 'primeng/primeng';
import { GrowlModule, Message } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';     //accordion and accordion tab
import { MenuItem } from 'primeng/primeng';            //api
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';

import { FieldsetModule } from 'primeng/primeng';
//import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AutoCompleteModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/primeng';


import { FriendlyDatePipe } from './shared/pipes/friendly-date.pipe';
import { FriendlyHourPipe } from './shared/pipes/friendly-hour.pipe';
import { TruncatePipe } from './shared/pipes/truncate.pipe';

import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import { TagAutistaComponent } from "./shared/components/tag-autista/tag-autista.component";
import { TagCapopartenzaComponent } from "./shared/components/tag-capopartenza/tag-capopartenza.component";

@NgModule({
    imports: [CommonModule, GestionePermessiRoutingModule,
        //BrowserModule,
        FormsModule,
        HttpModule,
        TreeModule,
        GrowlModule,
        DataTableModule,
        CheckboxModule,
        ButtonModule,
        FieldsetModule,
        //  BrowserAnimationsModule,
        AutoCompleteModule,
        ConfirmDialogModule,
        CalendarModule,
        InputSwitchModule],
    declarations: [
        GestionepermessiComponent,
        TagAutistaComponent,
        TagCapopartenzaComponent,
        FriendlyDatePipe,
        FriendlyHourPipe,
        TruncatePipe],
    providers: [SituazionePermessiFakeService, AdapterAlberoService, RicercaPersonaFakeService, ConfirmationService]
})
export class GestionePermessiModule { }
