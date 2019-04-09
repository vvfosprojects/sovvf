import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
/**
 * Service
 */
import { TurnoService } from './navbar-service/turno-service/turno.service';
import { TurnoServiceFake } from './navbar-service/turno-service/turno.service.fake';
/**
 * Component
 */
import { OperatoreComponent } from './operatore/operatore.component';
import { UnitaOperativaComponent } from './unita-operativa/unita-operativa.component';
import { ClockComponent } from './clock/clock.component';
import { NavbarComponent } from './navbar.component';
import { TurnoComponent } from './turno/turno.component';
/**
 * Module
 */
import { PipeModule } from '../../shared/pipes/pipe.module';
import { SharedModule } from '../../shared/shared.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
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
        UnitaOperativaComponent
    ],
    exports: [NavbarComponent],
    providers: [
        { provide: TurnoService, useClass: TurnoServiceFake },
    ]
})
export class NavbarModule {
}
