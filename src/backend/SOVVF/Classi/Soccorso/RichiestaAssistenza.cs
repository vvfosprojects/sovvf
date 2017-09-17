//-----------------------------------------------------------------------
// <copyright file="RichiestaAssistenza.cs" company="CNVVF">
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
using System.Diagnostics;
using System.Linq;
using Modello.Classi.Geo;
using Modello.Classi.Persistenza;
using Modello.Classi.Soccorso.Eventi;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Eventi.Segnalazioni;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using Modello.Classi.Soccorso.StatiRichiesta;

namespace Modello.Classi.Soccorso
{
    /// <summary>
    ///   Questa classe modella la generica richiesta di assistenza inoltrata ai VVF. La richiesta
    ///   può non avere seguito oppure generare un intervento da parte dei VVF. Esempi di istanze
    ///   sono: richiesta per un incendio in un'abitazione, richiesta per porta bloccata, richiesta
    ///         per vigilanza in occasione di una manifestazione, richiesta per partecipazione di una
    ///         delegazione VVF ad un convegno. Non è un'istanza di richiesta il terremoto, che
    ///         essendo un macro evento calamitoso darà luogo a più richieste di assistenza.
    /// </summary>
    public class RichiestaAssistenza : Entity
    {
        /// <summary>
        ///   Contiene la lista degli eventi considerati di interesse per la richiesta.
        /// </summary>
        private List<Evento> eventi;

        /// <summary>
        ///   Costruisce una nuova istanza di <see cref="RichiestaAssistenza" />
        /// </summary>
        public RichiestaAssistenza()
        {
            this.eventi = new List<Evento>();
            this.Tipologie = new List<TipologiaRichiesta>();
            this.Tags = new HashSet<string>();
        }

        /// <summary>
        ///   E' la priorità della richiesta. Questa informazione è di ausilio nell'accodamento delle richieste.
        /// </summary>
        /// <remarks>
        ///   Al momento non è sensato assegnare una priorità a richieste del tipo vigilanza. Questo
        ///   aspetto deve essere valutato successivamente.
        /// </remarks>
        public enum Priorita
        {
            /// <summary>
            ///   Bassa priorità
            /// </summary>
            Bassa,

            /// <summary>
            ///   Media priorità
            /// </summary>
            Media,

            /// <summary>
            ///   Alta priorità
            /// </summary>
            Alta
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
        ///       totale di 100.000 interventi mappabili per ogni anno (mai raggiunto).
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
        public Geolocalizzazione Geolocalizzazione { get; set; }

        /// <summary>
        ///   Restituisce le sole istanze della classe Telefonata presenti all'interno della lista
        ///   degli eventi.
        /// </summary>
        public IList<Telefonata> Telefonate
        {
            get
            {
                return this.eventi
                    .Where(e => e is Telefonata)
                    .Select(e => e as Telefonata)
                    .ToList();
            }
        }

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
            get
            {
                var ultimoEventoRilevanza = this.eventi
                    .Where(e => (e is MarcaRilevante) || (e is MarcaNonRilevante))
                    .LastOrDefault();

                return (ultimoEventoRilevanza != null) && (ultimoEventoRilevanza is MarcaRilevante);
            }
        }

        /// <summary>
        ///   Restituisce l'elenco degli stati dei mezzi coinvolti nella Richiesta di Assistenza
        /// </summary>
        public IDictionary<string, IStatoMezzo> MezziCoinvolti
        {
            get
            {
                var eventiPartenza = this.eventi
                    .Where(e => e is IPartenza)
                    .Select(e => (IPartenza)e);

                var eventiPartenzaRaggruppatiPerMezzo = eventiPartenza.SelectMany(
                    e => e.CodiciMezzo,
                    (evento, codiceMezzo) => new
                    {
                        Codice = codiceMezzo,
                        Evento = evento
                    })
                    .GroupBy(el => el.Codice, el => el.Evento);

                var d = new Dictionary<string, IStatoMezzo>();

                foreach (var gruppoEventiPartenza in eventiPartenzaRaggruppatiPerMezzo)
                {
                    var codice = gruppoEventiPartenza.Key;
                    var eventi = gruppoEventiPartenza.AsEnumerable();
                    var processoreStato = new ProcessoreStato();
                    processoreStato.ProcessaEventi(eventi);
                    var stato = processoreStato.Stato;

                    d[codice] = stato;
                }

                // Se la richiesta è chiusa, i mezzi devono essere stati tutti liberati.
                if (this.Chiusa)
                {
                    Debug.Assert(d.Values.All(stato => stato is Libero), "La richiesta è chiusa ma contiene mezzi non liberi");
                }

                return d;
            }
        }

        /// <summary>
        ///   Restituisce l'elenco delle squadre coinvolte nella Richiesta di Assistenza
        /// </summary>
        public IEnumerable<SquadraCoinvolta> SquadreCoinvolte
        {
            get
            {
                throw new NotImplementedException();
            }
        }

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
        public virtual IList<TipologiaRichiesta> Tipologie { get; set; }

        /// <summary>
        ///   E' l'indirizzo della richiesta
        /// </summary>
        public virtual string Indirizzo { get; set; }

        /// <summary>
        ///   Note sulla località della richiesta (per es. "accanto a ingresso carico/scarico del
        ///   supermercato Spendibene")
        /// </summary>
        public virtual string NoteLocalita { get; set; }

        /// <summary>
        ///   E' la descrizione della richiesta, che ne sintetizza le caratteristiche principali.
        /// </summary>
        public virtual string Descrizione { get; set; }

        /// <summary>
        ///   E' la zona di emergenza a cui la richiesta è legata
        /// </summary>
        public string[] ZoneEmergenza { get; set; }

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
            get
            {
                var eventoAssegnazionePriorita = this.eventi
                    .Where(e => e is AssegnazionePriorita)
                    .LastOrDefault() as AssegnazionePriorita;

                return eventoAssegnazionePriorita != null ? eventoAssegnazionePriorita.Priorita : RichiestaAssistenza.Priorita.Media;
            }
        }

        /// <summary>
        ///   Restituisce l'istante della Richiesta di Assistenza
        /// </summary>
        public virtual DateTime IstanteRicezioneRichiesta
        {
            get
            {
                try
                {
                    var eventoSegnalazione = this.eventi
                        .Where(e => e is Segnalazione)
                        .First() as Segnalazione;

                    return eventoSegnalazione.Istante;
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException("Impossibile recuperare l'istante della Richiesta di Assistenza.", ex);
                }
            }
        }

        /// <summary>
        ///   Restituisce l'istante della prima assegnazione di una risorsa squadra/mezzo alla <see cref="RichiestaAssistenza" />.
        /// </summary>
        public virtual DateTime? IstantePrimaAssegnazione
        {
            get
            {
                var eventoAssegnazione = this.eventi
                    .Where(e => e is ComposizionePartenze)
                    .FirstOrDefault() as ComposizionePartenze;

                if (eventoAssegnazione == null)
                {
                    return null;
                }
                else
                {
                    return eventoAssegnazione.Istante;
                }
            }
        }

        /// <summary>
        ///   Restituisce lo stato della Richiesta
        /// </summary>
        public IStatoRichiesta StatoRichiesta
        {
            get
            {
                var eventoChiusura = this.eventi
                    .Where(e => e is ChiusuraRichiesta);

                if (this.eventi.Any())
                {
                    return new Chiusa();
                }
                else
                {
                    var elencoMezziCoinvolti = this.MezziCoinvolti;
                    if (!elencoMezziCoinvolti.Any())
                    {
                        return new InAttesa();
                    }
                    else
                    {
                        if (elencoMezziCoinvolti.Values.Any(e => e.AssegnatoARichiesta))
                        {
                            return new Assegnata();
                        }
                        else
                        {
                            return new Sospesa();
                        }
                    }
                }
            }
        }

        /// <summary>
        ///   Indica se il luogo del sinistro è presidiato
        /// </summary>
        public virtual bool Presidiato
        {
            get
            {
                return this.MezziCoinvolti.Values.Any(statoMezzo => statoMezzo is SulPosto);
            }
        }

        /// <summary>
        ///   Il richiedente della richiesta.
        /// </summary>
        public virtual string Richiedente { get; set; }

        /// <summary>
        ///   Il numero telefonico del richiedente della richiesta, se appropriato.
        /// </summary>
        public virtual string NumeroRichiedente { get; set; }

        /// <summary>
        /// E' il codice delle unità operative di prima, seconda, terza... competenza, in ordine di preferenza.
        /// </summary>
        public virtual string[] CodiciUOCompetenza { get; set; }

        /// <summary>
        ///   Aggiunge un evento alla lista degli eventi. L'evento deve essersi verificato in un
        ///   istante superiore a quello dell'ultimo evento in lista. In caso contrario il metodo
        ///   solleva un'eccezione.
        /// </summary>
        /// <param name="evento">L'evento da aggiungere</param>
        public void AddEvento(Evento evento)
        {
            if (this.eventi.Any() && this.eventi.Last().Istante > evento.Istante)
            {
                throw new InvalidOperationException("Impossibile aggiungere un evento ad una richiesta che ne ha già uno più recente.");
            }

            this.eventi.Add(evento);
        }
    }
}
