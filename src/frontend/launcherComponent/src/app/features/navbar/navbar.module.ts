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
import { UnitaOperativaComponent } from './unita-operativa/unita-operativa.component';
import { ClockComponent } from './clock/clock.component';
import { NavbarComponent } from './navbar.component';
import { TurnoComponent } from './turno/turno.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
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
        BrowserAnimationsModule,
        FilterPipeModule,
        FormsModule,
        RouterModule,
        SharedModule,
        NgxsModule.forFeature(
            [
                NavbarState,
                TurnoState
            ]
        ),
    ],
    declarations: [
        NavbarComponent,
        TurnoComponent,
        ClockComponent,
        UnitaOperativaComponent,
        SidebarComponent
    ],
    exports: [
        NavbarComponent,
        SidebarComponent
    ],
    providers: [
        { provide: TurnoExtraService, useClass: TurnoExtraServiceFake },
        { provide: TreeviewI18n, useClass: SediTreeviewI18n }
    ]
})
export class NavbarModule {
}
