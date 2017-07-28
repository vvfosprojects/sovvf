import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CompFiltriComponent } from './comp-filtri/comp-filtri.component';

@NgModule({
  declarations: [
    AppComponent,
    CompFiltriComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
