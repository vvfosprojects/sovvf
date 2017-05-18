import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndicatoriComponent } from './indicatori.component';

const routes: Routes = [
    { path: '', component: IndicatoriComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IndicatoriRoutingModule { }
