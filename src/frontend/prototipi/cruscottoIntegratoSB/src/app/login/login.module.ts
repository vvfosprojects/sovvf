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

import { UserEffects } from '../effects/userEffects';

import { StoreModule } from '@ngrx/store';
import { reducers } from '../reducers/index';
import { HttpClientModule } from '@angular/common/http';

import { EffectsModule } from '@ngrx/effects';
import { metaReducers } from "../reducers/clearState";

@NgModule({
    imports: [CommonModule,
        LoginRoutingModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers}),
        EffectsModule.forRoot([UserEffects])
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
