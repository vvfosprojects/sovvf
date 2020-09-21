import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangelogComponent } from './changelog.component';

const trasferimentoChiamataRoutes: Routes = [
    { path: '', component: ChangelogComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(trasferimentoChiamataRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class ChangelogRoutingModule {
}
