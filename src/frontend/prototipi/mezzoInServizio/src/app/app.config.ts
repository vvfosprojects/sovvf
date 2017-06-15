import { InjectionToken } from '@angular/core';

import { AppConfig } from './app-config';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');