import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormChiamataComponent } from './form-chiamata.component';

const routes: Routes = [
    {
        path: '',
        component: FormChiamataComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormChiamataRoutingModule {}
