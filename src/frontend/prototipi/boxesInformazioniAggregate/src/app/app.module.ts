import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InfoAggregateComponent } from './info-aggregate/info-aggregate.component';

@NgModule({
  declarations: [
    AppComponent,
    InfoAggregateComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
