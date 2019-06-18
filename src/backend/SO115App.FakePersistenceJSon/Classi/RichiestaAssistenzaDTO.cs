//-----------------------------------------------------------------------
// <copyright file="RichiestaAssistenzaDTO.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Persistenza;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Classi.Utenti;
using static SO115App.API.Models.Classi.Soccorso.RichiestaAssistenza;

namespace SO115App.FakePersistenceJSon.Classi
{
    /// <summary>
    ///   Questa classe modella la generica richiesta di assistenza inoltrata ai VVF. La richiesta
    ///   può non avere seguito oppure generare un intervento da parte dei VVF. Esempi di istanze
    ///   sono: richiesta per un incendio in un'abitazione, richiesta per porta bloccata, richiesta
    ///   per vigilanza in occasione di una manifestazione, richiesta per partecipazione di una
    ///   delegazione VVF ad un convegno. Non è un'istanza di richiesta il terremoto, che essendo un
    ///   macro evento calamitoso darà luogo a più richieste di assistenza.
    /// </summary>
    public class RichiestaAssistenzaDTO : Entity
    {
        /// <summary>
        ///   Contiene la lista degli eventi considerati di interesse per la richiesta.
        /// </summary>
        private List<Evento> eventi;

        /// <summary>
        ///   Costruisce una nuova istanza di <see cref="RichiestaAssistenza" />
        /// </summary>
        [JsonConstructor]
        public RichiestaAssistenzaDTO()
        {
            this.eventi = new List<Evento>();
            this.Tipologie = new List<Tipologia>();
            this.Tags = new HashSet<string>();
            //this.ListaPartenze = new List<Partenza>();
        }

        /// <summary>
        ///   <para>
        ///     Il codice intervento è un codice parlante che si utilizza per identificare
        ///     univocamente una richiesta. Si può per esempio utilizzare nelle comunicazioni verbali
        ///     o annotare su un foglietto.
        ///   </para>
        ///   <para>
        ///     Il codice deve essere progettato con l'obiettivo di garantire i seguenti requisiti:
        ///     * facilità rinumerazione dei vecchi interventi;
        ///     * leggibilità del codice (per es. facilità di annotazione);
        ///     * facilità di comunicarlo verbalmente.
        ///   </para>
        ///   <para>
        ///     Si stabilisce di utilizzare un sistema del tipo 223.117.949, ossia un numero
        ///     progressivo raggruppato in terzine. Il codice è comunque di tipo stringa.
        ///   </para>
        ///   <para>
        ///     Il criterio di mapping dei codici dei vecchi interventi SO115 sarà del tipo:
        ///     RM1.700.700 (RM= sigla provincia, 1.7=anno e 00700=numero intervento)
        ///   </para>
        ///   <para>
        ///     Gli interventi importati da SO115 verranno mappati su una maschera del tipo:
        ///     RM1.700.000 in cui
        ///     - RM è il codice della provincia attualmente usato,
        ///     - 17 sono le ultime due cifre dell'anno dell'intervento
        ///     - le restanti cifre sono l'attuale numero intervento (senza progressivo) per un
        ///     totale di 100.000 interventi mappabili per ogni anno (mai raggiunto).
        ///   </para>
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   E' il codice dell'unità operativa competente per l'intervento
        /// </summary>
        /// <remarks>
        ///   La competenza di un intervento può cambiare durante la vita della richiesta. Il cambio
        ///   è documentato da un apposito evento della richiesta.
        /// </remarks>
        public string CodiceUnitaOperativaCompetente { get; set; }

        /// <summary>
        ///   E' il set dei codici delle unità operative che sono chiamate a supporto.
        /// </summary>
        /// <remarks>
        ///   Le unità allertate possono partecipare alla gestione dell'intervento limitatamente a
        ///   determinati specifici casi d'uso (per es. composizione partenza, apposizione nota
        ///   intervento, ecc.)
        /// </remarks>
        public ISet<string> CodiciUnitaOperativeAllertate { get; set; }

        /// <summary>
        ///   Espone la lista degli eventi considerati di interesse per la richiesta.
        /// </summary>
        public IReadOnlyList<Evento> Eventi
        {
            get
            {
                return this.eventi;
            }
        }

        /// <summary>
        ///   E' la geolocalizzazione dell'evento calamitoso, vigilanza, ecc.
        /// </summary>
        public Coordinate Geolocalizzazione { get; set; }

        /// <summary>
        ///   Restituisce le sole istanze della classe Telefonata presenti all'interno della lista
        ///   degli eventi.
        /// </summary>
        public IList<Telefonata> Telefonate
        {
            get;
        }

        /// <summary>
        ///   Operatore che ha generato la segnalazione
        /// </summary>
        public Utente Operatore { get; set; }

        /// <summary>
        ///   Indica se la richiesta è sospesa
        /// </summary>
        /// <remarks>
        ///   La richiesta è sospesa se, prima del termine della sua evasione, tutte le risorse le
        ///   sono state sottratte e dirottate presso altro intervento
        /// </remarks>
        public bool Sospesa { get; }

        /// <summary>
        ///   Indica se la richiesta è in attesa
        /// </summary>
        /// <remarks>La richiesta è in attesa se non le è stata ancora assegnata alcuna partenza</remarks>
        public bool InAttesa { get; }

        /// <summary>
        ///   Indica se la <see cref="RichiestaAssistenza" /> è marcata come rilevante.
        /// </summary>
        public virtual bool Rilevante
        {
            get;
        }

        /// <summary>
        ///   Indica se la rilevanza è di tipo Storico/Artistico/Culturale
        /// </summary>
        public bool RilevanzaStArCu { get; set; }

        /// <summary>
        ///   Restituisce l'elenco degli stati dei mezzi coinvolti nella Richiesta di Assistenza
        /// </summary>
        public IDictionary<string, IStatoMezzo> MezziCoinvolti
        {
            get;
        }

        /// <summary>
        ///   Restituisce l'elenco delle squadre coinvolte nella Richiesta di Assistenza
        /// </summary>
        public IEnumerable<SquadraCoinvolta> SquadreCoinvolte
        {
            get;
            //set;
        }

        //public List<Partenza> ListaPartenze { get; set; }

        /// <summary>
        ///   Indica l'istante di chiusura della richiesta, impostato dall'evento <see cref="ChiusuraRichiesta" />
        /// </summary>
        public DateTime? IstanteChiusura { get; internal set; }

        /// <summary>
        ///   E' la lista ordinata (per importanza decrescente) delle tipologie di soccorso.
        /// </summary>
        /// <remarks>
        ///   Per es. è la lista { valanga, soccorso a persona, ricerca disperso, messa in sicurezza
        ///   } in un sinistro simile al Rigopiano
        /// </remarks>
        public virtual List<Tipologia> Tipologie { get; set; }

        /// <summary>
        ///   La località dove è avvenuto il fatto
        /// </summary>
        public virtual Localita Localita { get; set; }

        /// <summary>
        ///   Il turno nel quale viene presa la chiamata
        /// </summary>
        public Turno TurnoInserimentoChiamata { get; set; }

        /// <summary>
        ///   Il turno nel quale viene lavorato l'intervento
        /// </summary>
        public Turno TurnoIntervento { get; set; }

        /// <summary>
        ///   Indica se il terreno è uno tra Boschi/Campi/Sterpaglie e ne indica i mq.
        /// </summary>
        public List<TipologiaTerreno> TipoTerreno { get; set; }

        /// <summary>
        ///   Lista degli enti intervenuti (Es. ACEA)
        /// </summary>
        public List<EntiIntervenuti> ListaEntiIntervenuti { get; set; }

        /// <summary>
        ///   Se l'intervento è su un obiettivo ritenuto rilevante (Es. Colosseo) si seleziona da
        ///   interfaccia e si registra il codice
        /// </summary>
        public string CodiceObiettivoSensibile { get; set; }

        /// <summary>
        ///   E' la descrizione della richiesta, che ne sintetizza le caratteristiche principali.
        /// </summary>
        public virtual string Descrizione { get; set; }

        /// <summary>
        ///   E' la zona di emergenza a cui la richiesta è legata
        /// </summary>
        public virtual string[] ZoneEmergenza { get; set; }

        /// <summary>
        ///   Sono i tags legati alla richiesta di assistenza
        /// </summary>
        public ISet<string> Tags { get; set; }

        /// <summary>
        ///   Indica se la richiesta è aperta
        /// </summary>
        public bool Chiusa
        {
            get
            {
                return this.IstanteChiusura.HasValue;
            }
        }

        /// <summary>
        ///   Indica se la richiesta è chiusa
        /// </summary>
        public bool Aperta
        {
            get
            {
                return !this.Chiusa;
            }
        }

#warning realizzare i metodi che restituiscono "n.richieste evase" e "n.mezzi intervenuti (RientratoInSede)" e utilizzarli per gli indicatori di soccorso

        /// <summary>
        ///   Restituisce la priorità della richiesta. Se non è esplicitamente impostata è uguale a <see cref="Priorita.Media" />.
        /// </summary>
        public virtual Priorita PrioritaRichiesta
        {
            get;
        }

        /// <summary>
        ///   Restituisce l'istante della Richiesta di Assistenza
        /// </summary>
        public virtual DateTime IstanteRicezioneRichiesta
        {
            get;
        }

        /// <summary>
        ///   Restituisce l'istante della prima presa in carico da parte di un operatore,
        ///   identificato dall'apposito evento.
        /// </summary>
        public virtual DateTime? IstantePresaInCarico
        {
            get;
        }

        /// <summary>
        ///   Restituisce l'istante della prima assegnazione di una risorsa squadra/mezzo alla <see cref="RichiestaAssistenza" />.
        /// </summary>
        public virtual DateTime? IstantePrimaAssegnazione
        {
            get;
        }

        /// <summary>
        ///   Restituisce lo stato della Richiesta
        /// </summary>
        public IStatoRichiesta StatoRichiesta
        {
            get;
        }

        /// <summary>
        ///   Indica se il luogo del sinistro è presidiato
        /// </summary>
        public virtual bool Presidiato
        {
            get;
        }

        /// <summary>
        ///   Il richiedente della richiesta.
        /// </summary>
        public virtual Richiedente Richiedente { get; set; }

        /// <summary>
        ///   Il numero telefonico del richiedente della richiesta, se appropriato.
        /// </summary>
        public virtual string NumeroRichiedente { get; set; }

        /// <summary>
        ///   E' il codice delle unità operative di prima, seconda, terza... competenza, in ordine di preferenza.
        /// </summary>
        public virtual string[] CodiciUOCompetenza { get; set; }

        /// <summary>
        ///   Lista delle Competenze della richiesta
        /// </summary>
        public virtual List<Sede> Competenze { get; set; }

        /// <summary>
        ///   Codice della scheda Nue, estratto dalla prima telefonata che è legata ad una scheda
        ///   contatto del Nue.
        /// </summary>
        public virtual string CodiceSchedaNue
        {
            get;
        }

        /// <summary>
        ///   Calcola lo stato di invio del fonogramma per la richiesta, in base all'ultimo evento
        ///   fonogramma presente nella richiesta.
        /// </summary>
        public virtual API.Models.Classi.Soccorso.Fonogramma.IStatoFonogramma StatoInvioFonogramma
        {
            get;
        }

        /// <summary>
        ///   Modella la complessità legata ad una <see cref="RichiestaAssistenza" />. Le soglie sono le
        ///   seguenti: 0 - 20: bassa; 21 - 60: media; maggiore di 61: alta;
        /// </summary>
        public virtual API.Models.Classi.Soccorso.Complessita.IComplessita Complessita
        {
            get;
        }
    }
}
