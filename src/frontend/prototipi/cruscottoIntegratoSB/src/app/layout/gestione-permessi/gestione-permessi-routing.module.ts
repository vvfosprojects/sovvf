import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  GestionepermessiComponent } from './gestione-permessi.component';

const routes: Routes = [
    {
        path: '',
        component: GestionepermessiComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GestionePermessiRoutingModule {}
