import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// used to create fake backend
import { fakeBackendProvider } from '../login/_helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

import { AlertComponent } from '../login/_directives/index';
import { AuthGuard } from '../login/_guards/index';
import { AlertService, AuthenticationService, UserService } from '../login/_services/index';
import { HomeComponent } from '../home/index';

//

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
    imports: [CommonModule,
        LoginRoutingModule,
        FormsModule,
        HttpModule
    ],
    declarations: [LoginComponent,
        AlertComponent,
        HomeComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,

        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions
    ]
})
export class LoginModule { }
