import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { DashboardPortaleComponent } from './dashboard-portale.component';

const dashboardPortaleRoutes: Routes = [
    { path: '', component: DashboardPortaleComponent }
];

@NgModule({
    imports: [RouterModule.forChild(dashboardPortaleRoutes)],
    exports: [RouterModule]
})
export class DashboardPortaleRouting {
}
