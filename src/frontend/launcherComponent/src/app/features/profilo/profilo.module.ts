import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfiloRoutingModule } from './profilo.routing';
import { ProfiloComponent } from './profilo.component';
import { MapsModule } from '../maps/maps.module';

@NgModule({
    declarations: [
        ProfiloComponent
    ],
    imports: [
        CommonModule,
        ProfiloRoutingModule,
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

export class ProfiloModule {
}
