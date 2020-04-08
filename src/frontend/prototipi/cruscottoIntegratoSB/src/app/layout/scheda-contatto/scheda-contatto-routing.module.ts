import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedaContattoComponent } from './scheda-contatto.component';

const routes: Routes = [
    {
        path: '',
        component: SchedaContattoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchedaContattoRoutingModule {}
