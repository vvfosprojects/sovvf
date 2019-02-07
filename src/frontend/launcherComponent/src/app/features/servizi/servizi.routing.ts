import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiziComponent } from './servizi.component';

const serviziRoutes: Routes = [
    { path: '', component: ServiziComponent },

];

@NgModule({
    imports: [RouterModule.forChild(serviziRoutes)],
    exports: [RouterModule]
})
export class ServiziRouting {
}
