import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoxFunzionariComponent } from './boxes/info-aggregate/box-funzionari/box-funzionari.component';
import { InfoAggregateComponent } from './boxes/info-aggregate/info-aggregate.component';

import { InfoAggregateService } from './boxes/boxes-services/info-aggregate.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BoxInterventiComponent } from './boxes/info-aggregate/box-interventi/box-interventi.component';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { BoxMezziComponent } from './boxes/info-aggregate/box-mezzi/box-mezzi.component';
import { BoxMeteoComponent } from './boxes/info-aggregate/box-meteo/box-meteo.component';

@NgModule({
  declarations: [
    AppComponent,
    BoxFunzionariComponent,
    InfoAggregateComponent,
    BoxInterventiComponent,
    TruncatePipe,
    BoxMezziComponent,
    BoxMeteoComponent
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
