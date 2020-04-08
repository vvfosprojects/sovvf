import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MezziComponent } from './mezzi.component';

const routes: Routes = [
    {
        path: '',
        component: MezziComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MezziRoutingModule {}
