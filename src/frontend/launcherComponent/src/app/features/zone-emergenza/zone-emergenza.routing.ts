import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { ZoneEmergenzaComponent } from './zone-emergenza.component';
import { DettaglioZonaEmergenzaComponent } from './dettaglio-zona-emergenza/dettaglio-zona-emergenza.component';
import { CreazioneSediComponent } from './sedi-zona-emergenza/creazione-sedi/creazione-sedi.component';
import { DettaglioSediComponent } from './sedi-zona-emergenza/dettaglio-sedi/dettaglio-sedi.component';

const zoneEmergenzaRoutes: Routes = [
    { path: '', component: ZoneEmergenzaComponent },
    { path: 'detail/:id', component: DettaglioZonaEmergenzaComponent },
    { path: 'create-sedi/:id', component: CreazioneSediComponent },
    { path: 'detail-sedi/:id', component: DettaglioSediComponent }
];

@NgModule({
    imports: [RouterModule.forChild(zoneEmergenzaRoutes)],
    exports: [RouterModule]
})
export class ZoneEmergenzaRouting {
}
