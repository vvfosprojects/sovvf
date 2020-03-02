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
import { CheckPermissionPipe } from './check-permission.pipe';

const COMPONENTS = [
    TruncatePipe, FriendlyDatePipe, FriendlyDateTooltipPipe, FriendlyHourPipe, FriendlyTimePipe, DistanzaTemporalePipe, PersonalePipe, EventiPipe, ContattoPrioritaPipe, CheckPermissionPipe
];

@NgModule({
    imports: [],
    declarations: [...COMPONENTS, CheckPermissionPipe],
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
