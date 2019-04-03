import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/**
 * Service
 */
import { UnitaOperativaService } from './navbar-service/unita-operativa-service/unita-operativa.service';
import { UnitaOperativaServiceFake } from './navbar-service/unita-operativa-service/unita-operativa.service.fake';
import { TurnoService } from './navbar-service/turno-service/turno.service';
import { TurnoServiceFake } from './navbar-service/turno-service/turno.service.fake';
import { DefaultTreeviewI18n } from './navbar-service/unita-operativa-treeview-service/default-treeview-i18n';
/**
 * Component
 */
import { OperatoreComponent } from './operatore/operatore.component';
import { UnitaOperativaTreeviewComponent } from './unita-operativa-treeview/unita-operativa-treeview.component';
import { ClockComponent } from './clock/clock.component';
import { NavbarComponent } from './navbar.component';
import { TurnoComponent } from './turno/turno.component';
/**
* Module
*/
import { PipeModule } from '../../shared/pipes/pipe.module';
import { SharedModule } from '../../shared/shared.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TreeviewI18n, TreeviewModule } from 'ngx-treeview';
/**
* Ngxs
*/
import { NgxsModule } from '@ngxs/store';
/**
* Ngxs State
*/
import { TurnoState } from './store/states/turno/turno.state';

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        PipeModule.forRoot(),
        SharedModule.forRoot(),
        TreeviewModule.forRoot(),
        BrowserAnimationsModule,
        FilterPipeModule,
        FormsModule,
        RouterModule,
        NgxsModule.forFeature(
            [
                TurnoState
            ]
        ),
    ],
    declarations: [
        NavbarComponent,
        TurnoComponent,
        ClockComponent,
        OperatoreComponent,
        UnitaOperativaTreeviewComponent
    ],
    exports: [NavbarComponent],
    providers: [
        { provide: TurnoService, useClass: TurnoServiceFake },
        { provide: UnitaOperativaService, useClass: UnitaOperativaServiceFake },
        { provide: TreeviewI18n, useClass: DefaultTreeviewI18n },
    ]
})
export class NavbarModule {
}
