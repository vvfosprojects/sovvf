import { RouterModule, Routes } from '@angular/router';
import { StatisticheComponent } from './statistiche.component';

const statisticheRoutes: Routes = [
    { path: '', component: StatisticheComponent },
];

export const StatisticheRouting = RouterModule.forChild(statisticheRoutes);
