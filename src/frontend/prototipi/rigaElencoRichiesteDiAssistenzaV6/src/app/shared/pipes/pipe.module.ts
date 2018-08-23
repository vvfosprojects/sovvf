import {NgModule} from '@angular/core';
import {TruncatePipe} from './truncate.pipe';

@NgModule({
    imports: [],
    declarations: [TruncatePipe],
    exports: [TruncatePipe],
})

export class PipeModule {

    static forRoot() {
        return {
            ngModule: PipeModule,
            providers: [],
        };
    }
}