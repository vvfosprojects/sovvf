import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreferenzeComponent } from './preferenze.component';

const preferenzeRoutes: Routes = [
    { path: '', component: PreferenzeComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(preferenzeRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class PreferenzeRoutingModule {
}
