import {NgModule} from '@angular/core';
import {TruncatePipe} from './truncate.pipe';
import {FriendlyDatePipe} from './friendly-date.pipe';
import {FriendlyDateTooltipPipe} from './friendly-date-tooltip.pipe';
import {FriendlyHourPipe} from './friendly-hour.pipe';
import {FriendlyTimePipe} from './friendly-time.pipe';
import {DistanzaTemporalePipe} from './distanza-temporale.pipe';

@NgModule({
    imports: [],
    declarations: [TruncatePipe, FriendlyDatePipe, FriendlyDateTooltipPipe, FriendlyHourPipe, FriendlyTimePipe, DistanzaTemporalePipe],
    exports: [TruncatePipe, FriendlyDatePipe, FriendlyDateTooltipPipe, FriendlyHourPipe, FriendlyTimePipe, DistanzaTemporalePipe],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}
