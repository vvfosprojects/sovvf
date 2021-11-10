import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { ZoneEmergenzaComponent } from './zone-emergenza.component';
import { DettaglioZonaEmergenzaComponent } from './dettaglio-zona-emergenza/dettaglio-zona-emergenza.component';
import { SediZonaEmergenzaComponent } from './sedi-zona-emergenza/sedi-zona-emergenza.component';

const zoneEmergenzaRoutes: Routes = [
    { path: '', component: ZoneEmergenzaComponent },
    { path: 'detail/:id', component: DettaglioZonaEmergenzaComponent },
    { path: 'sedi/:id', component: SediZonaEmergenzaComponent },
];

@NgModule({
    imports: [RouterModule.forChild(zoneEmergenzaRoutes)],
    exports: [RouterModule]
})
export class ZoneEmergenzaRouting {
}
