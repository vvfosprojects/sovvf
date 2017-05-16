import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndicatoriRoutingModule } from './indicatori-routing.module';
import { IndicatoriComponent } from './indicatori.component';

//import {
//    NgbCarouselModule,
//    NgbAlertModule
//} from '@ng-bootstrap/ng-bootstrap';

//import {
//    TimelineComponent,
//    NotificationComponent,
//    ChatComponent
//} from './components';

import { StatModule } from '../shared';

@NgModule({
  imports: [
    CommonModule,
    //NgbCarouselModule.forRoot(),
    //NgbAlertModule.forRoot(),
    IndicatoriRoutingModule,
    StatModule,    
  ],
  declarations: [
    IndicatoriComponent
    //TimelineComponent,
    //NotificationComponent,
    //ChatComponent
  ]
})
export class IndicatoriModule { }
