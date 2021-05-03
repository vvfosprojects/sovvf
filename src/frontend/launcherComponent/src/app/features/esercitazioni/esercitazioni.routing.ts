import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { EsercitazioniComponent } from './esercitazioni.component';

const esercitazioniRoutes: Routes = [
  { path: '', component: EsercitazioniComponent },
];

@NgModule({
  imports: [RouterModule.forChild(esercitazioniRoutes)],
  exports: [RouterModule]
})
export class EsercitazioniRouting { }
