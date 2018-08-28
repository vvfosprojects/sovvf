import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoxFunzionariComponent } from './box-funzionari/box-funzionari.component';
import { InfoAggregateComponent } from './info-aggregate/info-aggregate.component';

import { InfoAggregateService } from './info-aggregate/info-aggregate.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BoxInterventiComponent } from './box-interventi/box-interventi.component';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { BoxMezziComponent } from './box-mezzi/box-mezzi.component';
import { BoxMeteoComponent } from './box-meteo/box-meteo.component';

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
