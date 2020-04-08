import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlankPageComponent } from './blank-page.component';
import { BlankPageComponentDett } from './blank-page-dett.component';

const routes: Routes = [
    {
        path: '',
        component: BlankPageComponent
    },
    {
        path: 'blank-page-dett-ro',
        component: BlankPageComponentDett
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BlankPageRoutingModule {}
