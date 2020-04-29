# sovvf

=======
# Sala Operativa 115

## Introduzione

Di seguito sono elencate alcune delle funzionalità della nuova applicazione per la gestione del soccorso dei Vigili del Fuoco.

### Dashboard

Screenshot della dashboard del nuovo applicativo SO115 web.

![Dashboard](doc/images/dashboard.jpg)

### Feature Boxes (informazioni aggregate)

Screenshot della parte superiore della dashboard, dove sono visualizzate le informazioni aggregate della dashboard.

![Boxes (informazioni aggregate)](doc/images/boxes.jpg)

### Feature Dettaglio Intervento

Screenshot del dettaglio di un intervento.

![Dettaglio Intervento](doc/images/dettaglio-richiesta.jpg)

### Feature Dettaglio Intervento in Mappa

Screenshot del dettaglio di un intervento cliccato dalla mappa.

![Dettaglio Richiesta Mappa](doc/images/dettaglio-richiesta-mappa.jpg)

### Feature Chiamata

Screenshot della form inserimento di un nuovo intervento.

![Chiamata in corso](doc/images/chiamata.jpg)

### Feature Composizione Partenza Avanzata

Screenshot della Composizione Partenza Avanzata.

![Composizione Partenza Avanzata](doc/images/composizione.jpg)

### Feature Composizione Partenza Rapida

Screenshot della Composizione Partenza Rapida.

![Composizione Partenza Rapida](doc/images/composizione-rapida.jpg)

### Feature Mappa

Screenshot visualizzazione Mezzi, Interventi e Sedi sulla mappa.

![Mappa](doc/images/dettaglio-marker.jpg)

### Feature Mappa Meteo

Screenshot visualizzazione condizioni Meteo.

![Mappa](doc/images/meteo-marker.jpg)

### Dashboard solo Mappa

Screenshot della dashboard in modalità __solo Mappa__.

![Dashboard solo mappa](doc/images/dashboard-solo-mappa.jpg)

### Feature Lista Schede Contatto NUE

Screenshot della visualizzazione delle schede contatto Nue

![Schede Contatto](doc/images/schede-contatto.jpg)

### Feature Scheda Contatto dettaglio

Screeenshot della visualizzazione del dettaglio di una Scheda Contatto

![Dettaglio Scheda Contatto](doc/images/schede-contatto-dettaglio.jpg)

### Feature Lista Mezzi In Servizio

Screenshot della visualizzazione dei mezzi in servizio sia in una lista che sulla mappa

![Lista Mezzi In Servizio](doc/images/lista-mezzi-in-servizio.jpg)

## Il backend

Il backend di SOVVF è un backend RESTful implementato in .NET Core, cluster enabled e conforme ai paradigmi SOLID e CQRS. Ogni azione svolta dal backend attraversa una catena di fasi successive, rappresentate nel seguente schema.

![Action chain](doc/images/ActionChain.png)

La fase di log registra la natura dell'azione svolta, l'utente che la svolge, l'istante di esecuzione e i dati di ingresso che alimentano l'azione, anche a fini di auditing sul sistema. La fase di validazione verifica che i dati di ingresso siano validi e sicuri. La fase di autorizzazione verifica che l'utente abbia i permessi per eseguire l'azione. La fase di notifica ha il compito di notificare l'avvenuta azione ai sottomoduli del sistema ed ai sistemi esterni integrati con SOVVF. Infine la fase di log di performance, registra i tempi di esecuzione dell'azione ai fini di analisi delle prestazioni e profilazione del sistema.
