import { NgModule } from '@angular/core';
import { TruncatePipe } from './truncate.pipe';
import { FriendlyDatePipe } from './friendly-date.pipe';
import { FriendlyDateTooltipPipe } from './friendly-date-tooltip.pipe';
import { FriendlyHourPipe } from './friendly-hour.pipe';
import { FriendlyTimePipe } from './friendly-time.pipe';
import { DistanzaTemporalePipe } from './distanza-temporale.pipe';
import { PersonalePipe } from './personale.pipe';
import { EventiPipe } from './eventi.pipe';
import { ContattoPrioritaPipe } from './contatto-priorita.pipe';
import { SelectedFilterRichiestePipe } from './selected-filter-richieste.pipe';
import { CheckPermissionRichiestaPipe } from './check-permission-richiesta.pipe';
import { CheckPermissionPipe } from './check-permission.pipe';
import { CheckPermissionSchedaContattoPipe } from './check-permission-scheda-contatto.pipe';
import { SelectedFilterTipologiaRichiestePipe } from './selected-filter-tipologia-richieste.pipe';
import { ReplacePipe } from './replace.pipe';

const COMPONENTS = [
    TruncatePipe,
    FriendlyDatePipe,
    FriendlyDateTooltipPipe,
    FriendlyHourPipe,
    FriendlyTimePipe,
    DistanzaTemporalePipe,
    PersonalePipe,
    EventiPipe,
    ContattoPrioritaPipe,
    CheckPermissionPipe,
    CheckPermissionRichiestaPipe,
    CheckPermissionSchedaContattoPipe,
    SelectedFilterRichiestePipe,
    SelectedFilterTipologiaRichiestePipe,
    ReplacePipe
];

@NgModule({
    imports: [],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}
