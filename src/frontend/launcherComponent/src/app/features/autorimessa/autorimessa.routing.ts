import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorimessaComponent } from './autorimessa.component';

const autorimessaRoutes: Routes = [
  { path: '', component: AutorimessaComponent },

];

@NgModule({
  imports: [RouterModule.forChild(autorimessaRoutes)],
  exports: [RouterModule]
})
export class AutorimessaRouting { }
