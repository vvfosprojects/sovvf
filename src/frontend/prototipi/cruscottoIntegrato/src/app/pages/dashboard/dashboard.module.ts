import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { Dashboard } from './dashboard.component';
import { routing }       from './dashboard.routing';

import { PieChart } from './pieChart';
import { Feed } from './feed';
import { Calendar } from './calendar';

import { CalendarService } from './calendar/calendar.service';
import { FeedService } from './feed/feed.service';
import { PieChartService } from './pieChart/pieChart.service';

///INIZIO
import { Maps }              from '../maps/maps.component';
import { GoogleMaps }        from '../maps/components/googleMaps/googleMaps.component';

import { PagesModule } from '../pages.module';

///FINE

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    PagesModule
  ],
  declarations: [
    PieChart,
    Feed,
    Calendar,
    Dashboard,

    Maps,
    GoogleMaps
    
  ],
  providers: [
    CalendarService,
    FeedService,
    PieChartService
  ]
})
export class DashboardModule {}
