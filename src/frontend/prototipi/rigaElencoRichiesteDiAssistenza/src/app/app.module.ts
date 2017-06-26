import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SintesiRichiestaComponent } from './sintesi-richiesta/sintesi-richiesta.component';

@NgModule({
  declarations: [
    AppComponent,
    SintesiRichiestaComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
