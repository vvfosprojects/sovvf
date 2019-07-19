import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from './pipes/pipe.module';
import { TreeviewI18n, TreeviewModule } from 'ngx-treeview';
import { DefaultTreeviewI18n } from './store/states/sedi-treeview/default-treeview-i18n';
import * as Shared from './index';
import { PartenzaComponent } from './components/partenza/partenza.component';
import { ListaPartenzeComponent } from './components/lista-partenze/lista-partenze.component';
import { MezzoActionsComponent } from './components/mezzo/mezzo-actions/mezzo-actions.component';
import { SintesiRichiestaActionsComponent } from './components/sintesi-richiesta-actions/sintesi-richiesta-actions.component';

const COMPONENTS = [
    Shared.DebounceClickDirective,
    Shared.DebounceKeyUpDirective,
    Shared.ComponenteComponent,
    Shared.CompetenzaComponent,
    Shared.MezzoComponent,
    Shared.LoaderComponent,
    Shared.TreeviewComponent,
    Shared.ListaEntiComponent,
    Shared.ListaSquadrePartenzaComponent,
    Shared.ConfirmModalComponent,
    Shared.SelezioneTipiTerrenoComponent,
    ListaPartenzeComponent
];

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule,
        TreeviewModule.forRoot()
    ],
    declarations: [
        ...COMPONENTS,
        PartenzaComponent,
        MezzoActionsComponent,
        SintesiRichiestaActionsComponent
    ],
    exports: [
        ...COMPONENTS,
        SintesiRichiestaActionsComponent
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
