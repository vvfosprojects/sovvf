import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
//import { InfoAggregateComponent } from "../bs-component/components";
import { StatModule, InfoAggregateModule } from '../../shared';
import { ChatRowComponent } from './components/chat-row/chat-row.component';
import { MomentModule } from 'ngx-moment';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DashboardRoutingModule,
        StatModule,
        InfoAggregateModule,
        MomentModule
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent,
        ChatRowComponent      
    ]
})
export class DashboardModule {}
