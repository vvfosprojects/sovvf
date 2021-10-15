import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreferenzeRoutingModule } from './preferenze.routing';
import { PreferenzeComponent } from './preferenze.component';
import { MapsModule } from '../maps/maps.module';

@NgModule({
    declarations: [
        PreferenzeComponent
    ],
    imports: [
        CommonModule,
        PreferenzeRoutingModule,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgbModule,
        SharedModule,
        MapsModule
    ]
})

export class PreferenzeModule {
}
