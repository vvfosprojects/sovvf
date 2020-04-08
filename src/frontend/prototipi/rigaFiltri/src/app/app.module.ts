import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
/*import {NgbModule} from '@ng-bootstrap/ng-bootstrap';*/
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';

import { CompFiltriComponent } from './comp-filtri/comp-filtri.component';
import { CompFiltriService } from "app/comp-filtri/comp-filtri.service";

@NgModule({
  declarations: [
    AppComponent,
    CompFiltriComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [CompFiltriService],
  bootstrap: [AppComponent]
})
export class AppModule { }
