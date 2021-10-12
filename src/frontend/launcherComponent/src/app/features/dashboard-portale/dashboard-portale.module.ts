import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardPortaleComponent } from './dashboard-portale.component';
import { DashboardPortaleRouting } from './dashboard-portale.routing';

@NgModule({
    declarations: [
        DashboardPortaleComponent
    ],
    imports: [
        CommonModule,
        DashboardPortaleRouting,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgbModule
    ]
})

export class DashboardPortaleModule {
}
