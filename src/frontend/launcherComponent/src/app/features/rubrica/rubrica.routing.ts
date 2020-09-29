import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { RubricaComponent } from './rubrica.component';

const rubricaiRoutes: Routes = [
  { path: '', component: RubricaComponent },

];

@NgModule({
    imports: [RouterModule.forChild(rubricaiRoutes)],
    exports: [RouterModule]
  })
  export class RubricaRouting { }