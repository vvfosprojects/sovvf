export abstract class AppConfig { //dovrebbe essere interface, ma dà un warning (vedi https://github.com/angular/angular-cli/issues/2034)
  apiEndpoint: string;
  title: string;
}

export const APP_DI_CONFIG: AppConfig = {
  apiEndpoint: 'http://localhost:2661/api/',
  title: 'Dependency Injection'
};