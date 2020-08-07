import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './pipes/pipe.module';
import { TreeviewI18n, TreeviewModule } from 'ngx-treeview';
import { DefaultTreeviewI18n } from './store/states/sedi-treeview/default-treeview-i18n';
import { ReactiveFormsModule } from '@angular/forms';
import * as Shared from './index';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListaPartenzeComponent } from './components/lista-partenze/lista-partenze.component';
import { EnteModalComponent } from './modal/ente-modal/ente-modal.component';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { MezzoActionsModalComponent } from './modal/mezzo-actions-modal/mezzo-actions-modal.component';

const COMPONENTS = [
    Shared.DebounceClickDirective,
    Shared.DebounceKeyUpDirective,
    Shared.ClickStopPropagationDirective,
    Shared.ComponenteComponent,
    Shared.CompetenzaComponent,
    Shared.MezzoComponent,
    Shared.TreeviewComponent,
    Shared.ListaEntiComponent,
    Shared.ListaSquadrePartenzaComponent,
    Shared.ConfirmModalComponent,
    Shared.SelezioneTipiTerrenoComponent,
    Shared.PartenzaComponent,
    Shared.MezzoActionsComponent,
    Shared.SintesiRichiestaActionsComponent,
    Shared.ActionRichiestaModalComponent,
    Shared.CheckboxComponent,
    Shared.PartialLoaderComponent,
    Shared.BottoneNuovaVersioneComponent,
    Shared.EliminaPartenzaModalComponent,
    Shared.RichiestaDuplicataModalComponent,
    Shared.MezzoActionsModalComponent,
    ListaPartenzeComponent,
    EnteModalComponent
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbModule,
        PipeModule,
        TreeviewModule.forRoot(),
        NgSelectModule,
        NgxsFormPluginModule.forRoot()
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
        PipeModule,
        MezzoActionsModalComponent
    ],
    entryComponents: [MezzoActionsModalComponent]
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
