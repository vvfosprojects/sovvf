import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { Dashboard } from './dashboard.component';
import { routing }       from './dashboard.routing';

import { PopularApp } from './popularApp';
import { PieChart } from './pieChart';
import { TrafficChart } from './trafficChart';
import { UsersMap } from './usersMap';
import { LineChart } from './lineChart';
import { Feed } from './feed';
import { Todo } from './todo';
import { Calendar } from './calendar';
import { CalendarService } from './calendar/calendar.service';
import { FeedService } from './feed/feed.service';
import { LineChartService } from './lineChart/lineChart.service';
import { PieChartService } from './pieChart/pieChart.service';
import { TodoService } from './todo/todo.service';
import { TrafficChartService } from './trafficChart/trafficChart.service';
import { UsersMapService } from './usersMap/usersMap.service';

///INIZIO
import { Maps }              from '../maps/maps.component';
import { BubbleMaps }        from '../maps/components/bubbleMaps/bubbleMaps.component';
import { GoogleMaps }        from '../maps/components/googleMaps/googleMaps.component';
import { LeafletMaps }       from '../maps/components/leafletMaps/leafletMaps.component';
import { LineMaps }          from '../maps/components/lineMaps/lineMaps.component';
import { BubbleMapsService } from '../maps/components/bubbleMaps/bubbleMaps.service';
import { LineMapsService }   from '../maps/components/lineMaps/lineMaps.service';
///FINE

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing
  ],
  declarations: [
    PopularApp,
    PieChart,
    TrafficChart,
    UsersMap,
    
    LineChart,
    Feed,
    Todo,
    Calendar,
    Dashboard,

    Maps,
    BubbleMaps,
    GoogleMaps,
    LeafletMaps,
    LineMaps

  ],
  providers: [
    CalendarService,
    FeedService,
    LineChartService,
    PieChartService,
    TodoService,
    TrafficChartService,
    UsersMapService,

    BubbleMapsService,
    LineMapsService
  ]
})
export class DashboardModule {}
