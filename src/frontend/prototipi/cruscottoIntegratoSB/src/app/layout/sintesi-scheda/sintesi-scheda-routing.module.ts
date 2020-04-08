import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SintesiSchedaComponent } from './sintesi-scheda.component';

const routes: Routes = [
    {
        path: '',
        component: SintesiSchedaComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SintesiSchedaRoutingModule {}