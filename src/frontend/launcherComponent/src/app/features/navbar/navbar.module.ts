import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/**
 * Service
 */
import { TurnoExtraService } from '../../core/service/turno-service/turno-extra.service';
import { TurnoExtraServiceFake } from '../../core/service/turno-service/turno-extra-service.fake.service';
/**
 * Component
 */
import { OperatoreComponent } from './operatore/operatore.component';
import { UnitaOperativaComponent } from './unita-operativa/unita-operativa.component';
import { ClockComponent } from './clock/clock.component';
import { NavbarComponent } from './navbar.component';
import { TurnoComponent } from './turno/turno.component';
import { TastoSchedeContattoComponent } from '../home/filterbar/tasti-telefonata-group/tasto-schede-contatto/tasto-schede-contatto.component';
/**
 * Module
 */
import { SharedModule } from '../../shared/shared.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
/**
 * Ngxs
 */
import { NgxsModule } from '@ngxs/store';
/**
 * Ngxs State
 */
import { TurnoState } from './store/states/turno.state';
import { NavbarState } from './store/states/navbar.state';
import { TreeviewI18n } from 'ngx-treeview';
import { SediTreeviewI18n } from '../../shared/store/states/sedi-treeview/sedi-treeview-i18n.service';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        SharedModule.forRoot(),
        BrowserAnimationsModule,
        FilterPipeModule,
        FormsModule,
        RouterModule,
        NgxsModule.forFeature(
            [
                NavbarState,
                TurnoState
            ]
        ),
        SharedModule,
    ],
    declarations: [
        NavbarComponent,
        TurnoComponent,
        ClockComponent,
        OperatoreComponent,
        UnitaOperativaComponent,
        TastoSchedeContattoComponent
    ],
    exports: [NavbarComponent],
    providers: [
        { provide: TurnoExtraService, useClass: TurnoExtraServiceFake },
        { provide: TreeviewI18n, useClass: SediTreeviewI18n }
    ]
})
export class NavbarModule {
}
