import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { AreaDocumentaleComponent } from './area-documentale.component';

const posRoutes: Routes = [
    { path: '', component: AreaDocumentaleComponent },
];

@NgModule({
    imports: [RouterModule.forChild(posRoutes)],
    exports: [RouterModule]
})
export class AreaDocumentaleRouting {
}
