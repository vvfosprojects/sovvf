import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from "@angular/http";

import { AppComponent } from './app.component';
import { InfoAggregateComponent } from './info-aggregate/info-aggregate.component';
import { InfoAggregateService } from "./info-aggregate/info-aggregate.service";
import { InfoAggregateServiceFake } from "./info-aggregate/info-aggregate.service.fake";
import { BoxInterventiComponent } from './box-interventi/box-interventi.component';
import { BoxMezziComponent } from './box-mezzi/box-mezzi.component';
import { BoxSquadreComponent } from './box-squadre/box-squadre.component';
import { BoxMeteoComponent } from './box-meteo/box-meteo.component';
import { BoxFunzionariComponent } from './box-funzionari/box-funzionari.component';
@NgModule({
  declarations: [
    AppComponent,
    InfoAggregateComponent,
    BoxInterventiComponent,
    BoxMezziComponent,
    BoxSquadreComponent,
    BoxMeteoComponent,
    BoxFunzionariComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
  ],
  providers: [{ provide: InfoAggregateService, useClass: InfoAggregateServiceFake }],
  bootstrap: [AppComponent]
})
export class AppModule { }
