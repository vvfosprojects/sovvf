import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImpostazioniRoutingModule } from './impostazioni.routing';
import { ImpostazioniComponent } from './impostazioni.component';

@NgModule({
    declarations: [
        ImpostazioniComponent
    ],
    imports: [
        CommonModule,
        ImpostazioniRoutingModule,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgxPaginationModule,
        NgbModule
    ]
})

export class ImpostazioniModule {
}
