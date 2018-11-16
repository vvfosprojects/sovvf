import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from './clock/clock.component';
import { NavbarComponent } from './navbar.component';
import { TurnoComponent } from './turno/turno.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from '../shared/pipes/pipe.module';
import { SharedModule } from '../shared/shared.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TreeviewI18n, TreeviewModule } from 'ngx-treeview';
import { routing } from '../app.routing';
import { FormsModule } from '@angular/forms';
import { CambioSedeModalNavComponent } from './cambio-sede-modal-nav/cambio-sede-modal-nav.component';
import { OperatoreComponent } from './operatore/operatore.component';
import { UnitaOperativaComponent } from './unita-operativa/unita-operativa.component';
import { TurnoService } from './navbar-service/turno-service/turno.service';
import { TurnoServiceFake } from './navbar-service/turno-service/turno.service.fake';
import { UnitaOperativaService } from './navbar-service/unita-operativa-service/unita-operativa.service';
import { UnitaOperativaServiceFake } from './navbar-service/unita-operativa-service/unita-operativa.service.fake';
import { UnitaOperativaTreeviewComponent } from './unita-operativa-treeview/unita-operativa-treeview.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { DefaultTreeviewI18n } from './navbar-service/unita-operativa-treeview-service/default-treeview-i18n';

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        TreeviewModule.forRoot(),
        FilterPipeModule,
        routing,
        FormsModule,
        ClickOutsideModule
    ],
    entryComponents: [CambioSedeModalNavComponent],
    declarations: [
        NavbarComponent,
        TurnoComponent,
        ClockComponent,
        CambioSedeModalNavComponent,
        OperatoreComponent,
        UnitaOperativaComponent,
        UnitaOperativaTreeviewComponent
    ],
    exports: [NavbarComponent],
    providers: [
        {provide: TurnoService, useClass: TurnoServiceFake},
        {provide: UnitaOperativaService, useClass: UnitaOperativaServiceFake},
        {provide: TreeviewI18n, useClass: DefaultTreeviewI18n},
    ]
})
export class NavbarModule {
}
