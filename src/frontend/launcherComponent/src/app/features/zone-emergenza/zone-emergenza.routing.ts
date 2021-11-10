import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { ZoneEmergenzaComponent } from './zone-emergenza.component';
import { DettaglioZonaEmergenzaComponent } from './dettaglio-zona-emergenza/dettaglio-zona-emergenza.component';

const zoneEmergenzaRoutes: Routes = [
    { path: '', component: ZoneEmergenzaComponent },
    { path: 'detail/:id', component: DettaglioZonaEmergenzaComponent },
];

@NgModule({
    imports: [RouterModule.forChild(zoneEmergenzaRoutes)],
    exports: [RouterModule]
})
export class ZoneEmergenzaRouting {
}
