import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { RubricaPersonaleComponent } from './rubrica-personale.component';

const rubricaiRoutes: Routes = [
    { path: '', component: RubricaPersonaleComponent },
];

@NgModule({
    imports: [RouterModule.forChild(rubricaiRoutes)],
    exports: [RouterModule]
})
export class RubricaPersonaleRouting {
}
