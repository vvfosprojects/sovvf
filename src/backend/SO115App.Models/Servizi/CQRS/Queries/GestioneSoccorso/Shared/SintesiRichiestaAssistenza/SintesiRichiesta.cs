//-----------------------------------------------------------------------
// <copyright file="SintesiRichiesta.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Fonogramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Fonogramma;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Classi.Soccorso;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Triage;
using SO115App.Models.Classi.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using static SO115App.API.Models.Classi.Soccorso.RichiestaAssistenza;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza
{
    /// <summary>
    ///   Contiene le informazioni di sintesi di una Richiesta di Assistenza, utile ad alimentare il
    ///   primo ed il secondo livello di dettaglio del componente richiesta di assistenza sul frontend.
    /// </summary>
    public class SintesiRichiesta //: IGetListaSintesiRichieste
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SintesiRichiesta()
        {
            this.ZoneEmergenza = new string[0];
            this.Tags = new HashSet<string>();
            this.Eventi = new List<EventoSintesiRichiesta>();
            this.Competenze = new List<Sede>();
        }

        /// <summary>
        ///   L'id della richiesta
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        ///   Identifica il codice della Chiamata
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   E' il codice della Richiesta di Assistenza
        /// </summary>
        public string CodiceRichiesta { get; set; }

        /// <summary>
        ///   E' il codice dell'unità operativa competente per l'intervento
        /// </summary>
        /// <remarks>
        ///   La competenza di un intervento può cambiare durante la vita della richiesta. Il cambio
        ///   è documentato da un apposito evento della richiesta.
        /// </remarks>
        public string CodSOCompetente { get; set; }

        /// <summary>
        ///   E' il codice delle unità operative di prima, seconda, terza... competenza, in ordine
        ///   di preferenza.
        /// </summary>
        public virtual string[] CodUOCompetenza { get; set; }

        /// <summary>
        ///   E' il set dei codici delle unità operative che sono chiamate a supporto.
        /// </summary>
        /// <remarks>
        ///   Le unità allertate possono partecipare alla gestione dell'intervento limitatamente a
        ///   determinati specifici casi d'uso (per es. composizione partenza, apposizione nota
        ///   intervento, ecc.)
        /// </remarks>
        public ISet<string> CodSOAllertate { get; set; }

        /// <summary>
        ///   Utente che ha generato la segnalazione
        /// </summary>
        public Operatore Operatore { get; set; }

        /// <summary>
        ///   Ricezione della richiesta (via telefono, ecc.)
        /// </summary>
        public DateTime IstanteRicezioneRichiesta { get; set; }

        /// <summary>
        ///   Indica l'istante di chiusura della richiesta, impostato dall'evento <see cref="ChiusuraRichiesta" />
        /// </summary>
        public DateTime? IstanteChiusura { get; internal set; }

        #region GESTIONE STATI

        /// <summary>
        ///   Indica se la richiesta è sospesa
        /// </summary>
        /// <remarks>
        ///   La richiesta è sospesa se, prima del termine della sua evasione, tutte le risorse le
        ///   sono state sottratte e dirottate presso altro intervento
        /// </remarks>
        public bool Sospesa => TestoStatoRichiesta == "S";

        /// <summary>
        ///   Indica se la richiesta è aperta
        /// </summary>
        public bool Chiusa => TestoStatoRichiesta == "X";

        /// <summary>
        ///   Indica se la richiesta è chiusa
        /// </summary>
        public bool Aperta => TestoStatoRichiesta != "X";

        /// <summary>
        ///   Indica se la richiesta è presidiata
        /// </summary>
        public bool Presidiata => TestoStatoRichiesta == "P";

        /// <summary>
        ///   Indica lo stato della richiesta
        /// </summary>
        public string TestoStatoRichiesta { get; set; }

        /// <summary>
        ///   Stato della richiesta
        /// </summary>
        /// <summary>
        ///   Restituisce lo stato della Richiesta
        /// </summary>
        public string Stato
        {
            get
            {
                if (this.TestoStatoRichiesta != null)
                {
                    if (this.TestoStatoRichiesta.Equals("C"))
                        return Costanti.Chiamata;
                    else if (this.TestoStatoRichiesta.Equals("A"))
                        return Costanti.AssegnataRichiesta;
                    else if (this.TestoStatoRichiesta.Equals("P"))
                        return Costanti.RichiestaPresidiata;
                    else if (this.TestoStatoRichiesta.Equals("X"))
                        return Costanti.RichiestaChiusa;
                    else if (this.TestoStatoRichiesta.Equals("S"))
                        return Costanti.RichiestaSospesa;
                    else
                        return Costanti.Chiamata;
                }
                else
                {
                    var partenze = this.Partenze;

                    if (partenze != null && partenze.Count > 0)
                    {
                        if (partenze.ToList().FindAll(p => p.Partenza.Terminata || p.Partenza.Sganciata).Count < partenze.Count)
                        {
                            var partenzeAperte = partenze.ToList().FindAll(p => !p.Partenza.Terminata && !p.Partenza.Sganciata);

                            if (partenzeAperte.FindAll(p => p.Partenza.Mezzo.Stato.Equals("In Viaggio")).Count > 0 &&
                                partenzeAperte.FindAll(p => p.Partenza.Mezzo.Stato.Equals("Sul Posto")).Count == 0)
                                return Costanti.AssegnataRichiesta;
                            else if (partenzeAperte.FindAll(p => p.Partenza.Mezzo.Stato.Equals("Sul Posto")).Count > 0)
                            {
                                TestoStatoRichiesta = "P";
                                return Costanti.RichiestaPresidiata;
                            }
                            else
                            {
                                TestoStatoRichiesta = "S";
                                return Costanti.RichiestaSospesa;
                            }
                        }
                        else
                        {
                            if (Eventi.OrderByDescending(p => p.Ora).First().Stato.Equals("Chiusa"))
                            {
                                TestoStatoRichiesta = "X";
                                return Costanti.RichiestaChiusa;
                            }
                            else
                            {
                                TestoStatoRichiesta = "S";
                                return Costanti.RichiestaSospesa;
                            }
                        }
                    }
                    else
                    {
                        return Costanti.Chiamata;
                    }
                }
            }
        }

        #endregion GESTIONE STATI

        /// <summary>
        ///   Priorita della richiesta
        /// </summary>
        public Priorita PrioritaRichiesta { get; set; }

        public List<Tipologia> Tipologie { get; set; }

        public TipologiaDettaglio DettaglioTipologia { get; set; }

        /// <summary>
        ///   Descrizione della richiesta
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Descrizione del richiedente
        /// </summary>
        public Richiedente Richiedente { get; set; }

        /// <summary>
        ///   Localita della richiesta
        /// </summary>
        public Localita Localita { get; set; }

        /// <summary>
        ///   Il turno nel quale viene presa la chiamata
        /// </summary>
        public string trnInsChiamata { get; set; }

        /// <summary>
        ///   Indica se il terreno è uno tra Boschi/Campi/Sterpaglie e ne indica i mq.
        /// </summary>
        public List<TipologiaTerreno> TipoTerreno { get; set; }

        /// <summary>
        ///   Lista degli enti intervenuti (Es. ACEA)
        /// </summary>
        public List<int> CodEntiIntervenuti { get; set; }

        /// <summary>
        ///   Se l'intervento è su un obiettivo ritenuto rilevante (Es. Colosseo) si seleziona da
        ///   interfaccia e si registra il codice
        /// </summary>
        public ObiettivoSensibile ObiettivoSensibile { get; set; }

        /// <summary>
        ///   Competenze della richiesta
        /// </summary>
        public List<Sede> Competenze { get; set; }

        /// <summary>
        ///   Competenze della richiesta
        /// </summary>
        public List<Sede> SediAllertate { get; set; }

        /// <summary>
        ///   Complessità della richiesta
        /// </summary>
        public Complessita Complessita
        {
            get
            {
                var countEventi = Eventi?.Count ?? 0;

                if (countEventi <= 20)
                {
                    return new Complessita("0", "Basso", countEventi.ToString());
                }

                return countEventi <= 60 ? new Complessita("1", "Media", countEventi.ToString()) : new Complessita("2", "Alta", countEventi.ToString());
            }
        }

        /// <summary>
        ///   Eventuale istante di presa in carico della richiesta
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime? IstantePresaInCarico { get; set; }

        ///<summary>
        ///
        /// Restituisce la lista di Utenti che hanno in lavorazione la richiesta
        ///
        /// </summary>
        public List<AttivitaUtente> ListaUtentiInLavorazione { get; set; }

        ///<summary>
        ///
        /// Restituisce la lista di Utenti che hanno preso in carico la richiesta
        ///
        /// </summary>
        public List<AttivitaUtente> ListaUtentiPresaInCarico { get; set; }

        /// <summary>
        ///   Eventuale istante di prima assegnazione di risorse alla richiesta
        /// </summary>
        [DataType(DataType.DateTime)]
        public DateTime? IstantePrimaAssegnazione { get; set; }

        /// <summary>
        ///   Indica se la richiesta è stata marcata RILEVANTE
        /// </summary>
        /// <remarks>
        ///   Una richiesta può essere rilevante se è l'operatore a marcarla come tale, oppure in
        ///   base ad un insieme di regole automatiche deterministiche o basate su algoritmi di
        ///   machine learning.
        /// </remarks>
        public bool RilevanteGrave { get; set; }

        /// <summary>
        ///   Indica se la rilevanza è di tipo Storico/Artistico/Culturale
        /// </summary>
        public bool RilevanteStArCu { get; set; }

        /// <summary>
        ///   Codice della scheda Nue
        /// </summary>
        public string CodiceSchedaNue { get; set; }

        /// <summary>
        ///   Descrizione delle zone di emergenza
        /// </summary>
        public string[] ZoneEmergenza { get; set; }

        /// <summary>
        ///   Codice dello stato di invio del fonogramma (0 = Non necessario, 1 = Da inviare, 2 =
        ///   Inviato). Utile a calcolare il colore della segnalazione.
        /// </summary>
        public IStatoFonogramma StatoInvioFonogramma => new NonNecessario();

        public IList<ComposizionePartenze> Partenze { get; set; }

        /// <summary>
        ///   Etichette associate all'intervento (per es. aPagamento, imp, ecc.)
        /// </summary>
        public ISet<string> Tags { get; set; }

        public string NotePubbliche { get; set; }

        public string NotePrivate { get; set; }

        /// <summary>
        ///   Lista eventi associato alla richiesta
        /// </summary>
        public List<EventoSintesiRichiesta> Eventi { get; set; }

        public string Motivazione { get; set; }

        public Fonogramma Fonogramma { get; set; }

        public List<int> listaEnti { get; set; }

        /// <summary>
        ///   Contiene il risultato del Triage, con domande,risposte e i dati aggiutivi(es. Mezzi
        ///   consigliati, Priorità,ecc....)
        /// </summary>
        public List<TriageSummary> TriageSummary { get; set; }

        /// <summary>
        ///   Indica se la chiamata è stata definita urgente durante il triage
        /// </summary>
        public bool ChiamataUrgente { get; set; }

        /// <summary>
        ///   Flag che indica se l'intervento è per una esercitazione oppure no Di dafault è FALSE
        /// </summary>
        public bool Esercitazione { get; set; }

        public ESRI Esri_Param { get; set; }
    }
}
