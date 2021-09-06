import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfiloComponent } from './profilo.component';

const profiloRoutes: Routes = [
    { path: '', component: ProfiloComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(profiloRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ProfiloRoutingModule {
}
