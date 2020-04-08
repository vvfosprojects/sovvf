import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticheRouting } from './statistiche.routing';
import { StatisticheComponent } from './statistiche.component';

@NgModule({
    declarations: [
        StatisticheComponent
    ],
    imports: [
        CommonModule,
        StatisticheRouting
    ]
})
export class StatisticheModule {
}
