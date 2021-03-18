import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { TreeviewModule } from 'ngx-treeview';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangelogComponent } from './changelog.component';
import { ChangelogRoutingModule } from './changelog.routing';
import { ChangelogState } from './store/changelog.state';
import { ChangelogItemComponent } from './changelog-item/changelog-item.component';

@NgModule({
    declarations: [
        ChangelogComponent,
        ChangelogItemComponent
    ],
    imports: [
        CommonModule,
        ChangelogRoutingModule,
        TreeviewModule.forRoot(),
        SharedModule.forRoot(),
        NgxsModule.forFeature([
            ChangelogState
        ]),
        NgxsFormPluginModule.forRoot(),
        FormsModule,
        NgSelectModule,
        NgxPaginationModule,
        NgbModule
    ]
})

export class ChangelogModule {
}
