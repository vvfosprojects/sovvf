import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedRouting } from './logged.routing';
import { LoggedComponent } from './logged.component';

@NgModule({
    declarations: [LoggedComponent],
    imports: [
        CommonModule,
        LoggedRouting
    ]
})
export class LoggedModule {
}
