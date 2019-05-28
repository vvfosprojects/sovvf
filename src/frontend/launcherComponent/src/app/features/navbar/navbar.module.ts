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
import { NavbarState } from './store/states/navbar.state';

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
                NavbarState,
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
        { provide: TurnoExtraService, useClass: TurnoExtraServiceFake },
    ]
})
export class NavbarModule {
}
