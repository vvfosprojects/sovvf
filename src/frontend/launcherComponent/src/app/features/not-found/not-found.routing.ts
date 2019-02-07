import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found.component';

const notFoundRoutes: Routes = [
    { path: '', component: NotFoundComponent },

];

@NgModule({
    imports: [RouterModule.forChild(notFoundRoutes)],
    exports: [RouterModule]
})
export class NotFoundRouting {
}
