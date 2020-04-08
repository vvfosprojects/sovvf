import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaSchedeComponent } from './lista-schede.component';

const routes: Routes = [
    {
        path: '',
        component: ListaSchedeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ListaSchedeRoutingModule {}
