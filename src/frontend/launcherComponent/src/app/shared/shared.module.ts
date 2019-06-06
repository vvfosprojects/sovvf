import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './pipes/pipe.module';
import * as Shared from './index';
import { TreeviewI18n, TreeviewModule } from 'ngx-treeview';
import { DefaultTreeviewI18n } from './store/states/sedi-treeview/default-treeview-i18n';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';

const COMPONENTS = [
    Shared.DebounceClickDirective,
    Shared.DebounceKeyUpDirective,
    Shared.ComponenteComponent,
    Shared.CompetenzaComponent,
    Shared.MezzoComponent,
    Shared.LoaderComponent,
    Shared.TreeviewComponent,
    ConfirmModalComponent
];

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule,
        TreeviewModule.forRoot(),
    ],
    declarations: [
        ...COMPONENTS
    ],
    exports: [
        ...COMPONENTS
    ]
})
export class SharedModule {

    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [
                { provide: TreeviewI18n, useClass: DefaultTreeviewI18n },
            ],
        };
    }
}
