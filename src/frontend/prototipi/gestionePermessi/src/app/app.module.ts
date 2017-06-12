import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GestionepermessiComponent } from './gestionepermessi/gestionepermessi.component';

import {TreeModule,TreeNode} from 'primeng/primeng';
import {GrowlModule,Message} from 'primeng/primeng';
import {AccordionModule} from 'primeng/primeng';     //accordion and accordion tab
import {MenuItem} from 'primeng/primeng';            //api
import { GestionePermessiFakeService } from "app/gestionepermessi/gestione-permessi-fake.service";

@NgModule({
  declarations: [
    AppComponent,
    GestionepermessiComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    TreeModule,
    GrowlModule
  ],
  providers: [GestionePermessiFakeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
