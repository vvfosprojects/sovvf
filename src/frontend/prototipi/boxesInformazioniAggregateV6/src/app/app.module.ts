import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoxFunzionariComponent } from './box-funzionari/box-funzionari.component';
import { InfoAggregateComponent } from './info-aggregate/info-aggregate.component';

import { InfoAggregateService } from './info-aggregate/info-aggregate.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    BoxFunzionariComponent,
    InfoAggregateComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    NgbModule
  ],
  providers: [{ provide: InfoAggregateService, useClass: InfoAggregateService }],
  bootstrap: [AppComponent]
})
export class AppModule { }
