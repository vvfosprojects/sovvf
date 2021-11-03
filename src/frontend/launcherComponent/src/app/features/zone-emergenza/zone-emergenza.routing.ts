import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { ZoneEmergenzaComponent } from './zone-emergenza.component';

const zoneEmergenzaRoutes: Routes = [
    { path: '', component: ZoneEmergenzaComponent },
];

@NgModule({
    imports: [RouterModule.forChild(zoneEmergenzaRoutes)],
    exports: [RouterModule]
})
export class ZoneEmergenzaRouting {
}
