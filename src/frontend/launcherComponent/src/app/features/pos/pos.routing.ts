import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { PosComponent } from './pos.component';

const posRoutes: Routes = [
    { path: '', component: PosComponent },
];

@NgModule({
    imports: [RouterModule.forChild(posRoutes)],
    exports: [RouterModule]
})
export class PosRouting {
}
