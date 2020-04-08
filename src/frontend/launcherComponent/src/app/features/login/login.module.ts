import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRouting } from './login.routing';
import { LoginComponent } from './login.component';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        LoginRouting,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class LoginModule {
}
