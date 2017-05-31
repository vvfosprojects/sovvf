import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule }     from '../../theme/nga.module';

import { Dashboard } from './dashboard.component';
import { routing }   from './dashboard.routing';

import { PieChart } from './pieChart';
import { Feed }     from './feed';
import { Calendar } from './calendar';
import { mappaSOVVF } from './mappaSOVVF';

import { PieChartService } from './pieChart/pieChart.service';
import { FeedService }     from './feed/feed.service';
import { CalendarService } from './calendar/calendar.service';

import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    SharedModule    
  ],
  declarations: [
    PieChart,
    Feed,
    Calendar,
    Dashboard,
    mappaSOVVF
  ],
  providers: [
    CalendarService,
    FeedService,
    PieChartService
  ]
})
export class DashboardModule {}
