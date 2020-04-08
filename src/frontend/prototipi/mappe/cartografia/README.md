# Cartografia

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.3.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

######### INDICAZIONI ########
RIFERIMENTI:
===> https://github.com/robisim74/angular-maps

PACCHETTI AGGIUNTIVI:
===> npm install --save bootstrap@4.0.0-alpha.6 font-awesome
===> npm install --save googlemaps @types/googlemaps

MODIFICHE PARTI COMUNI:
===> styles.css:
   ===> @import "~bootstrap/dist/css/bootstrap.min.css";
   ===> @import "~font-awesome/css/font-awesome.css"; 

===> index.html:   
   ===> <script src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script> //Visualizza la mappa

===> tsconfig.json:   
   ===> "allowJs": true,  //Rimuove il warning "experimentalDecorators" in VSCode

===> main.ts:   
   ===> .catch(err => console.log(err));

===> polyfills.ts:   
   ===> tolti i commenti a /** IE9, IE10 and IE11 requires all of the following polyfills. **/
