import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/**
 * Component
 */
import { GestioneUtentiComponent } from './gestione-utenti.component';

const gestioneUtentiRoutes: Routes = [
  { path: '', component: GestioneUtentiComponent },

];

@NgModule({
  imports: [RouterModule.forChild(gestioneUtentiRoutes)],
  exports: [RouterModule]
})
export class GestioneUtentiRouting { }
