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
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Persistenza;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Fonogramma;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Classi.Soccorso.Fonogramma;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Triage;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Classi.Soccorso
{
    /// <summary>
    ///   Questa classe modella la generica richiesta di assistenza inoltrata ai VVF. La richiesta
    ///   può non avere seguito oppure generare un intervento da parte dei VVF. Esempi di istanze
    ///   sono: richiesta per un incendio in un'abitazione, richiesta per porta bloccata, richiesta
    ///   per vigilanza in occasione di una manifestazione, richiesta per partecipazione di una
    ///   delegazione VVF ad un convegno. Non è un'istanza di richiesta il terremoto, che essendo un
    ///   macro evento calamitoso darà luogo a più richieste di assistenza.
    /// </summary>
    public class RichiestaAssistenza : Entity
    {
        /// <summary>
        ///   Contiene la lista degli eventi considerati di interesse per la richiesta.
        /// </summary>
        private List<Evento> _eventi;

        public IEnumerable<Evento> ListaEventi { get { return _eventi.ToArray(); } }

        /// <summary>
        ///   Costruisce una nuova istanza di <see cref="RichiestaAssistenza" />
        /// </summary>
        [JsonConstructor]
        public RichiestaAssistenza()
        {
            this._eventi = new List<Evento>();
            this.Tipologie = new List<string>();
            this.Tags = new HashSet<string>();
            this.UtInLavorazione = new List<string>();
            this.UtPresaInCarico = new List<string>();
        }

        /// <summary>
        ///   E' la priorità della richiesta. Questa informazione è di ausilio nell'accodamento
        ///   delle richieste.
        /// </summary>
        /// <remarks>
        ///   Al momento non è sensato assegnare una priorità a richieste del tipo vigilanza. Questo
        ///   aspetto deve essere valutato successivamente.
        /// </remarks>
        public enum Priorita
        {
            /// <summary>
            ///   Livello 1
            /// </summary>
            Bassissima = 1,

            /// <summary>
            ///   Livello 2
            /// </summary>
            Bassa,

            /// <summary>
            ///   Livello 3
            /// </summary>
            Media,

            /// <summary>
            ///   Livello 4
            /// </summary>
            Alta,

            /// <summary>
            ///   Livello 5
            /// </summary>
            Altissima
        }

        /// <summary>
        ///   Cambio lo stato di una singola partenza e dei relativi mezzi e stato squadre
        /// </summary>
        /// <param name="partenza">La partenza la quale devo cambiarne lo stato</param>
        /// <param name="stato">Lo stato che va attribuito alla partenza</param>
        internal void CambiaStatoPartenza(Partenza partenza, CambioStatoMezzo stato, ISendNewItemSTATRI sendNewItemSTATRI, ICheckCongruitaPartenze check)
        {
            check.CheckCongruenza(stato, partenza.Codice);

            switch (stato.Stato)
            {
                case Costanti.MezzoInUscita:

                    if (!Eventi.OfType<InizioPresaInCarico>().Any())
                    {
                        new InizioPresaInCarico(this, stato.Istante.AddSeconds(1), CodOperatore);
                        SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, StatoRichiesta, CodOperatore, "", stato.Istante, null);
                    }

                    new UscitaPartenza(this, partenza.Mezzo.Codice, stato.Istante.AddSeconds(2), CodOperatore, partenza.Codice);

                    partenza.Mezzo.IdRichiesta = Id;

                    break;

                case Costanti.MezzoInViaggio:

                    var dataComposizione = stato.Istante.AddMinutes(1);
                    new ComposizionePartenze(this, dataComposizione, CodOperatore, false, partenza);

                    SincronizzaStatoRichiesta(Costanti.RichiestaAssegnata, StatoRichiesta, CodOperatore, "", stato.Istante, null);

                    partenza.Mezzo.IdRichiesta = Id;

                    break;

                case Costanti.MezzoSulPosto:

                    new ArrivoSulPosto(this, partenza.Mezzo.Codice, stato.Istante, CodOperatore, partenza.Codice);

                    SincronizzaStatoRichiesta(Costanti.RichiestaPresidiata, StatoRichiesta, CodOperatore, "", stato.Istante, null);

                    partenza.Mezzo.IdRichiesta = Id;

                    break;

                case Costanti.MezzoInRientro:

                    new PartenzaInRientro(this, partenza.Mezzo.Codice, stato.Istante, CodOperatore, partenza.Codice);

                    break;

                case Costanti.MezzoRientrato:

                    partenza.Mezzo.IdRichiesta = null;
                    partenza.Terminata = true;

                    new PartenzaRientrata(this, partenza.Mezzo.Codice, stato.Istante, CodOperatore, partenza.Codice);

                    //sendNewItemSTATRI.InvioRichiesta(this);

                    break;
            }
        }

        /// <summary>
        ///   Aggiorno lo stato della richiesta in base al vecchio stato
        /// </summary>
        /// <param name="stato">stato da attribuire alla richiesta</param>
        /// <param name="statoRichiesta">stato attuale della richiesta</param>
        /// <param name="id">id della fonte (operatore)</param>
        /// <param name="motivazione">testo della motivazione</param>
        internal void SincronizzaStatoRichiesta(string stato, IStatoRichiesta statoRichiesta, string id, string motivazione, DateTime dataEvento, List<EnteDTO> EntiIntervenuti)
        {
            if (stato == Costanti.RichiestaChiusa && !(statoRichiesta is Chiusa))
            {
                new ChiusuraRichiesta(motivazione, this, dataEvento, id, EntiIntervenuti);
            }
            else if (stato.Equals(Costanti.RichiestaRiaperta) && !(statoRichiesta is Riaperta))
            {
                if (lstPartenze.Where(p => !p.PartenzaAnnullata).ToList().Count == 0 || Partenze.All(p => p.Partenza.PartenzaAnnullata))
                    new RiaperturaRichiesta(motivazione, this, dataEvento, id);
                else
                    new AssegnataRichiesta(this, DateTime.UtcNow, id);
            }
            else if (stato.Equals(Costanti.RichiestaAssegnata) && !(statoRichiesta is Assegnata))
            {
                new AssegnataRichiesta(this, dataEvento, id);
            }
            else if (stato.Equals(Costanti.RichiestaPresidiata) && !(statoRichiesta is Presidiata))
            {
                new RichiestaPresidiata(this, dataEvento, id);
            }
            else if (stato.Equals(Costanti.RichiestaSospesa) && !(statoRichiesta is Sospesa))
            {
                new RichiestaSospesa(motivazione, this, dataEvento, id);
            }
        }

        /// <summary>
        ///   Questo metodo analizza la richiesta, ne desume il tipo di rilevanza e aggiunge gli
        ///   eventi necessari a sincronizzare la rilevanza corrente con quella richiesta nei
        ///   parametri di ingresso.
        /// </summary>
        /// <param name="rilevanzaGrave">
        ///   Indica se la richiesta deve impostata a rilevante per gravità
        /// </param>
        /// <param name="rilevanzaStArCu">
        ///   Indica se la richiesta deve impostata a rilevante per edifici Storico/Artistico/Culturali
        /// </param>
        /// <param name="fonte">La fonte dell'evento</param>
        /// <param name="motivazione">La motivazione dell'aggiornamento della rilevanza</param>
        internal void SincronizzaRilevanza(bool rilevanzaGrave, bool rilevanzaStArCu, string fonte, string motivazione, DateTime istateRichiesta)
        {
            var ultimoEventoRilevanza = (MarcaRilevante)this.Eventi.LastOrDefault(e => e is MarcaRilevante);

            var rilevanzaGraveCorrente =
                ultimoEventoRilevanza != null &&
                ultimoEventoRilevanza.PerGravita;

            var rilevanzaStArCuCorrente =
                ultimoEventoRilevanza != null &&
                ultimoEventoRilevanza.PerEdificioStArCu;

            if ((rilevanzaGraveCorrente ^ rilevanzaGrave) || (rilevanzaStArCuCorrente ^ rilevanzaStArCu))
            {
                new MarcaRilevante(this, istateRichiesta, fonte, motivazione, rilevanzaGrave, rilevanzaStArCu);
            }
        }

        /// <summary>
        ///   <para>
        ///     Il codice intervento è un codice parlante che si utilizza per identificare
        ///     univocamente una richiesta. Si può per esempio utilizzare nelle comunicazioni
        ///     verbali o annotare su un foglietto.
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
        ///   <para>
        ///     Gli operativi del CNVVF spingono per avere un codice parlante, del tipo "RM.12345".
        ///     In questa modalità di composizione, il codice reca informazioni geografiche che
        ///     potrebbero variare durante il corso di evasione dell'intervento, rendendo il codice
        ///     fuorviante. Tuttavia per il momento si decide di usare questa metodologia.
        ///   </para>
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   E' il codice generato nel momento in cui una chiamata viene gestita
        /// </summary>
        /// <remarks>
        ///   A differenza del codice questo campo non è giornaliero ma annuale, per questo nel
        ///   codice non sono presenti il giorno il mese e l'anno
        /// </remarks>
        public string CodRichiesta { get; set; }

        /// <summary>
        ///   E' il codice dell'operatore che ha registrato la richiesta
        /// </summary>
        public string CodOperatore { get; set; }

        /// <summary>
        ///   E' il codice dell'unità operativa competente per l'intervento
        /// </summary>
        /// <remarks>
        ///   La competenza di un intervento può cambiare durante la vita della richiesta. Il cambio
        ///   è documentato da un apposito evento della richiesta.
        /// </remarks>
        public string CodSOCompetente { get; set; }

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
        ///   Espone la lista degli eventi considerati di interesse per la richiesta.
        /// </summary>
        public IReadOnlyList<Evento> Eventi
        {
            get
            {
                return this._eventi;
            }
        }

        /// <summary>
        ///   Indica se la richiesta è sospesa
        /// </summary>
        /// <remarks>
        ///   La richiesta è sospesa se, prima del termine della sua evasione, tutte le risorse le
        ///   sono state sottratte e dirottate presso altro intervento
        /// </remarks>
        public bool Sospesa
        {
            get
            {
                return this._eventi
                    .LastOrDefault() is RichiestaSospesa || this._eventi
                    .LastOrDefault() is RevocaPerRiassegnazione;
            }
            set
            {
            }
        }

        /// <summary>
        ///   Indica se la richiesta è in attesa
        /// </summary>
        /// <remarks>La richiesta è in attesa se non le è stata ancora assegnata alcuna partenza</remarks>
        public bool InAttesa
        {
            get
            {
                var composizionePartenza = Partenze;

                return composizionePartenza.All(x =>
                           x.Partenza.Mezzo.Stato == Costanti.MezzoInRientro
                           || x.Partenza.Mezzo.Stato == Costanti.MezzoRientrato) && StatoRichiesta is InAttesa;
            }
            set
            {
            }
        }

        /// <summary>
        ///   Restituisce l'elenco degli stati dei mezzi coinvolti nella Richiesta di Assistenza
        /// </summary>
        public IDictionary<string, IStatoMezzo> MezziCoinvolti
        {
            get
            {
                var listaComposizioni = this.Eventi
                    .OfType<ComposizionePartenze>()
                    .ToList();

                //return ListaComposizioni.Select(x => x.Partenza).ToList();

                var d = new Dictionary<string, IStatoMezzo>();

                //var eventiPartenza = this.eventi
                //    .Where(e => e is IPartenza)
                //    .Select(e => (IPartenza)e);

                var eventiPartenzaRaggruppatiPerMezzo = listaComposizioni.SelectMany
                    (
                        e => e.Partenza.Mezzo.Codice,
                        (evento, codiceMezzo) => new
                        {
                            Codice = codiceMezzo,
                            Evento = evento
                        }
                    )
                    .GroupBy(el => el.Codice, el => el.Evento);

                foreach (var gruppoEventiPartenza in eventiPartenzaRaggruppatiPerMezzo)
                {
                    var codice = gruppoEventiPartenza.Key;
                    var eventi = gruppoEventiPartenza.AsEnumerable();
                    var processoreStato = new ProcessoreStato();
                    //processoreStato.ProcessaEventi(eventi);
                    //var stato = processoreStato.Stato;

                    //d[codice.ToString()] = stato;
                }

                // Se la richiesta è chiusa, i mezzi devono essere stati tutti liberati.
                //Debug.Assert(!this.Chiusa || d.Values.All(stato => stato.Disponibile), "La richiesta è chiusa ma contiene mezzi non liberi");

                return d;
            }
        }

        /// <summary>
        ///   Indica l'istante di chiusura della richiesta, impostato dall'evento <see cref="ChiusuraRichiesta" />
        /// </summary>
        public DateTime? IstanteChiusura
        {
            get
            {
                var ultimaChiusura = this.Eventi
                    .OfType<ChiusuraRichiesta>()
                    .ToList().LastOrDefault();

                return ultimaChiusura != null ? (DateTime?)ultimaChiusura.Istante : null;
            }
            set
            {
            }
        }

        /// <summary>
        ///   E' la lista ordinata (per importanza decrescente) delle tipologie di soccorso.
        /// </summary>
        /// <remarks>
        ///   Per es. è la lista { valanga, soccorso a persona, ricerca disperso, messa in sicurezza
        ///   } in un sinistro simile al Rigopiano
        /// </remarks>
        public virtual List<string> Tipologie { get; set; }

        public TipologiaDettaglio DettaglioTipologia { get; set; }

        /// <summary>
        ///   La località dove è avvenuto il fatto
        /// </summary>
        public virtual Localita Localita { get; set; }

        /// <summary>
        ///   Il turno nel quale viene presa la chiamata
        /// </summary>
        public string TrnInsChiamata { get; set; }

        /// <summary>
        ///   Indica se il terreno è uno tra Boschi/Campi/Sterpaglie e ne indica i mq.
        /// </summary>
        public List<TipologiaTerreno> TipoTerreno { get; set; }

        /// <summary>
        ///   Lista degli enti intervenuti (Es. ACEA)
        /// </summary>
        public List<string> CodEntiIntervenuti { get; set; }

        /// <summary>
        ///   Lista degli enti al quale è stata passata la richiesta (Es. ACEA)
        /// </summary>
        public List<string> CodEntiPresaInCarico { get; set; }

        /// <summary>
        ///   Se l'intervento è su un obiettivo ritenuto rilevante (Es. Colosseo) si seleziona da
        ///   interfaccia e si registra il codice
        /// </summary>
        public ObiettivoSensibile ObiettivoSensibile { get; set; }

        /// <summary>
        ///   E' la descrizione della richiesta, che ne sintetizza le caratteristiche principali.
        /// </summary>
        public virtual string Descrizione { get; set; }

        /// <summary>
        ///   E' la zona di emergenza a cui la richiesta è legata
        /// </summary>
        public virtual string[] CodZoneEmergenza { get; set; }

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
                var ultimoEventoChiusura = this._eventi.LastOrDefault() is ChiusuraRichiesta;
                if (ultimoEventoChiusura)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            set
            {
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

        /// <summary>
        ///   Indica se il luogo del sinistro è presidiato
        /// </summary>
        public virtual bool Presidiata
        {
            get
            {
                var composizionePartenze = Partenze;
                var elencoPresidiate = this.Eventi
                    .OfType<RichiestaPresidiata>()
                    .ToList();

                return elencoPresidiate.Count > 0 && composizionePartenze.Any(x => x.Partenza.Mezzo.Stato == Costanti.MezzoSulPosto && !x.Partenza.PartenzaAnnullata && !x.Partenza.Terminata && !x.Partenza.Sganciata);
            }
            set
            {
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
                var eventoAssegnazionePriorita = this._eventi
                    .LastOrDefault(e => e is AssegnazionePriorita) as AssegnazionePriorita;

                return eventoAssegnazionePriorita?.Priorita ?? RichiestaAssistenza.Priorita.Media;
            }
        }

        /// <summary>
        ///   Restituisce l'istante della Richiesta di Assistenza
        /// </summary>
        public virtual DateTime? IstanteRicezioneRichiesta
        {
            get
            {
                var eventoSegnalazione = this._eventi
                    .FirstOrDefault(e => e is Segnalazione) as Segnalazione;

                return eventoSegnalazione?.Istante;
            }
        }

        /// <summary>
        ///   Restituisce l'istante della prima presa in carico da parte di un operatore,
        ///   identificato dall'apposito evento.
        /// </summary>
        public virtual DateTime? IstantePresaInCarico
        {
            get
            {
                var eventoPresaInCarico = this._eventi
                    .FirstOrDefault(e => e is InizioPresaInCarico) as InizioPresaInCarico;

                if (eventoPresaInCarico == null)
                {
                    return null;
                }
                else
                {
                    return eventoPresaInCarico.Istante;
                }
            }
        }

        ///<summary>
        ///
        /// Restituisce la lista di Utenti che hanno in lavorazione la richiesta
        ///
        /// </summary>
        public List<string> UtInLavorazione { get; set; }

        ///<summary>
        ///
        /// Restituisce la lista di Utenti che hanno preso in carico la richiesta
        ///
        /// </summary>
        public List<string> UtPresaInCarico { get; set; }

        /// <summary>
        ///   Restituisce l'istante della prima assegnazione di una risorsa squadra/mezzo alla <see cref="RichiestaAssistenza" />.
        /// </summary>
        public virtual DateTime? IstantePrimaAssegnazione
        {
            get
            {
                var eventoAssegnazione = this._eventi
                    .FirstOrDefault(e => e is ComposizionePartenze) as ComposizionePartenze;

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
        ///   Indica se la richiesta è rilevante per qualche motivo
        /// </summary>
        public bool Rilevante
        {
            get
            {
                var ultimoEventoRilevanza = (MarcaRilevante)this._eventi
                    .LastOrDefault(e => e is MarcaRilevante);

                if (ultimoEventoRilevanza != null)
                    return ultimoEventoRilevanza.PerGravita || ultimoEventoRilevanza.PerEdificioStArCu;

                return false;
            }
        }

        /// <summary>
        ///   Indica se la richiesta è rilevante per gravità
        /// </summary>
        public bool RilevanteGrave
        {
            get
            {
                var ultimoEventoRilevanza = (MarcaRilevante)this._eventi
                    .LastOrDefault(e => e is MarcaRilevante);

                if (ultimoEventoRilevanza != null)
                    return ultimoEventoRilevanza.PerGravita;

                return false;
            }
        }

        /// <summary>
        ///   Indica se la richiesta è rilevante per edificio Storico/Artistico/Culturale
        /// </summary>
        public bool RilevanteStArCu
        {
            get
            {
                var ultimoEventoRilevanza = (MarcaRilevante)this._eventi
                    .LastOrDefault(e => e is MarcaRilevante);

                if (ultimoEventoRilevanza != null)
                    return ultimoEventoRilevanza.PerEdificioStArCu;

                return false;
            }
        }

        /// <summary>
        ///   Restituisce lo stato della Richiesta
        /// </summary>
        public IStatoRichiesta StatoRichiesta
        {
            get
            {
                var partenze = this.Partenze;

                if (partenze.Count > 0)
                {
                    if (partenze.ToList().FindAll(p => p.Partenza.Terminata || p.Partenza.Sganciata).Count < partenze.Count)
                    {
                        var partenzeAperte = partenze.ToList().FindAll(p => !p.Partenza.Terminata && !p.Partenza.Sganciata);

                        if (partenzeAperte.FindAll(p => p.Partenza.Mezzo.Stato.Equals("In Viaggio")).Count > 0 &&
                            partenzeAperte.FindAll(p => p.Partenza.Mezzo.Stato.Equals("Sul Posto")).Count == 0)
                            return new Assegnata();
                        else if (partenzeAperte.FindAll(p => p.Partenza.Mezzo.Stato.Equals("Sul Posto")).Count > 0)
                        {
                            this.Presidiata = true;
                            return new Presidiata();
                        }
                        else
                        {
                            this.Sospesa = true;
                            return new Sospesa();
                        }
                    }
                    else
                    {
                        if (_eventi.OrderByDescending(p => p.Istante).First() is ChiusuraRichiesta)
                        {
                            this.Chiusa = true;
                            return new Chiusa();
                        }
                        else
                        {
                            this.Sospesa = true;
                            return new Sospesa();
                        }
                    }
                }
                else
                {
                    this.InAttesa = true;
                    return new InAttesa();
                }
            }
        }

        /// <summary>
        ///   Restituisce le sole istanze della classe Telefonata presenti all'interno della lista
        ///   degli eventi.
        /// </summary>
        public IList<Telefonata> Telefonate
        {
            get
            {
                return this._eventi
                    .OfType<Telefonata>()
                    .ToList();
            }
        }

        public IList<ComposizionePartenze> Partenze
        {
            get
            {
                var listaComposizioni = this.Eventi
                    .OfType<ComposizionePartenze>()
                    .ToList();

                var listaPartenze = this.Eventi
                    .OfType<AbstractPartenza>()
                    .OrderByDescending(i => i.Istante)
                    .OrderByDescending(c => c.CodicePartenza)
                    .ToList();

                var listaPartenzeAnnullatePerNPN = this.Eventi
                    .OfType<RevocaPerInterventoNonPiuNecessario>()
                    .ToList();

                var listaPartenzeAnnullatePerAltraMotivazione = this.Eventi
                    .OfType<RevocaPerAltraMotivazione>()
                    .ToList();
                var listaPartenzeAnnullatePerFuoriServizio = this.Eventi
                    .OfType<RevocaPerFuoriServizio>()
                    .ToList();
                var listaPartenzeAnnullatePerRiassegnazione = this.Eventi
                    .OfType<RevocaPerRiassegnazione>()
                    .ToList();

                foreach (var evento in listaComposizioni)
                {
                    var UltimoEventoPartenza = listaPartenze.FindAll(m => m.CodiceMezzo.Equals(evento.Partenza.Mezzo.Codice)).FirstOrDefault().TipoEvento;

                    if (UltimoEventoPartenza.Equals("ComposizionePartenza"))
                    {
                        evento.Partenza.Mezzo.Stato = "In Viaggio";
                        foreach (var squadra in evento.Partenza.Squadre)
                        {
                            squadra.Stato = Squadra.StatoSquadra.InViaggio;
                        }
                    }

                    if (UltimoEventoPartenza.Equals("MezzoInRientro"))
                    {
                        evento.Partenza.Mezzo.Stato = "In Rientro";
                        foreach (var squadra in evento.Partenza.Squadre)
                        {
                            squadra.Stato = Squadra.StatoSquadra.InRientro;
                        }
                    }
                    else if (UltimoEventoPartenza.Equals("ArrivoSulPosto"))
                    {
                        evento.Partenza.Mezzo.Stato = "Sul Posto";
                        foreach (var squadra in evento.Partenza.Squadre)
                        {
                            squadra.Stato = Squadra.StatoSquadra.SulPosto;
                        }
                    }
                    else if (UltimoEventoPartenza.Equals("MezzoRientrato"))
                    {
                        evento.Partenza.Mezzo.Stato = "Rientrato";
                        foreach (var squadra in evento.Partenza.Squadre)
                        {
                            squadra.Stato = Squadra.StatoSquadra.InSede;
                        }
                    }

                    if (listaPartenzeAnnullatePerNPN.FindAll(x => x.CodiceMezzo.Equals(evento.Partenza.Mezzo.Codice)).ToList().Count > 0)
                    {
                        foreach (var annullamento in listaPartenzeAnnullatePerNPN.FindAll(x => x.CodiceMezzo.Equals(evento.Partenza.Mezzo.Codice)).ToList())
                        {
                            if (evento.Istante < annullamento.Istante)
                                evento.Partenza.PartenzaAnnullata = true;
                        }
                    }
                    if (listaPartenzeAnnullatePerAltraMotivazione.FindAll(x => x.CodiceMezzo.Equals(evento.Partenza.Mezzo.Codice)).ToList().Count > 0)
                    {
                        foreach (var annullamento in listaPartenzeAnnullatePerAltraMotivazione.FindAll(x => x.CodiceMezzo.Equals(evento.Partenza.Mezzo.Codice)).ToList())
                        {
                            if (evento.Istante < annullamento.Istante)
                                evento.Partenza.PartenzaAnnullata = true;
                        }
                    }
                    if (listaPartenzeAnnullatePerFuoriServizio.FindAll(x => x.CodiceMezzo.Equals(evento.Partenza.Mezzo.Codice)).ToList().Count > 0)
                    {
                        foreach (var annullamento in listaPartenzeAnnullatePerFuoriServizio.FindAll(x => x.CodiceMezzo.Equals(evento.Partenza.Mezzo.Codice)).ToList())
                        {
                            if (evento.Istante < annullamento.Istante)
                                evento.Partenza.PartenzaAnnullata = true;
                        }
                    }
                    if (listaPartenzeAnnullatePerRiassegnazione.FindAll(x => x.CodiceMezzo.Equals(evento.Partenza.Mezzo.Codice)).ToList().Count > 0)
                    {
                        foreach (var annullamento in listaPartenzeAnnullatePerRiassegnazione.FindAll(x => x.CodiceMezzo.Equals(evento.Partenza.Mezzo.Codice)).ToList())
                        {
                            if (evento.Istante < annullamento.Istante)
                                evento.Partenza.PartenzaAnnullata = true;
                        }
                    }
                }

                return listaComposizioni;
            }
        }

        /// <summary>
        ///   Il richiedente della richiesta.
        /// </summary>
        public virtual Richiedente Richiedente { get; set; }

        /// <summary>
        ///   E' il codice delle unità operative di prima, seconda, terza... competenza, in ordine
        ///   di preferenza.
        /// </summary>
        public virtual string[] CodUOCompetenza { get; set; }

        /// <summary>
        ///   Lista delle Competenze della richiesta
        /// </summary>
        public virtual List<Sede> Competenze { get; set; }

        /// <summary>
        ///   Codice della scheda Nue, estratto dalla prima telefonata che è legata ad una scheda
        ///   contatto del Nue.
        /// </summary>
        public virtual string CodNue
        {
            get
            {
                var primoCodiceNue = this._eventi
                    .OfType<Telefonata>()
                    .Select(e => e.CodiceSchedaContatto)
                    .FirstOrDefault(cod => !string.IsNullOrWhiteSpace(cod));

                return primoCodiceNue;
            }
        }

        /// <summary>
        ///   Calcola lo stato di invio del fonogramma per la richiesta, in base all'ultimo evento
        ///   fonogramma presente nella richiesta.
        /// </summary>
        public virtual IStatoFonogramma StatoInvioFonogramma
        {
            get
            {
                var ultimoEventoFonogramma = this._eventi
                    .LastOrDefault(e => e is IFonogramma);

                switch (ultimoEventoFonogramma)
                {
                    case FonogrammaInviato _:
                        return new Fonogramma.Inviato();

                    case InviareFonogramma _:
                        return new Fonogramma.DaInviare();

                    default:
                        return new Fonogramma.NonNecessario();
                }
            }
        }

        public SO115App.Models.Classi.Fonogramma.Fonogramma Fonogramma
        {
            get
            {
                var ultimoEventoFonogramma = this._eventi
                    .LastOrDefault(e => e is IFonogramma);

                switch (ultimoEventoFonogramma)
                {
                    case FonogrammaInviato _:
                        return MappaFonogramma(ultimoEventoFonogramma, "I");

                    case InviareFonogramma _:
                        return MappaFonogramma(ultimoEventoFonogramma, "D");

                    default:
                        return null;
                }
            }
        }

        private SO115App.Models.Classi.Fonogramma.Fonogramma MappaFonogramma(Evento infoFonogramma, string tipoFonogramma)
        {
            SO115App.Models.Classi.Fonogramma.Fonogramma InfoFonogramma = new SO115App.Models.Classi.Fonogramma.Fonogramma();

            if (tipoFonogramma.Equals("I"))
            {
                var info = ((FonogrammaInviato)infoFonogramma);
                InfoFonogramma.Destinatari = info.Destinatari;
                InfoFonogramma.IdOperatore = info.CodiceFonte;
                InfoFonogramma.IdRichiesta = info.CodiceRichiesta;
                InfoFonogramma.NumeroFonogramma = info.NumeroFonogramma;
                InfoFonogramma.ProtocolloFonogramma = info.ProtocolloFonogramma;
                InfoFonogramma.Stato = SO115App.Models.Classi.Fonogramma.StatoFonogramma.Inviato;
            }
            else if (tipoFonogramma.Equals("D"))
            {
                var info = ((InviareFonogramma)infoFonogramma);
                InfoFonogramma.Destinatari = info.Destinatari;
                InfoFonogramma.IdOperatore = info.CodiceFonte;
                InfoFonogramma.IdRichiesta = info.CodiceRichiesta;
                InfoFonogramma.NumeroFonogramma = info.NumeroFonogramma;
                InfoFonogramma.ProtocolloFonogramma = info.ProtocolloFonogramma;
                InfoFonogramma.Stato = SO115App.Models.Classi.Fonogramma.StatoFonogramma.DaInviare;
            }

            return InfoFonogramma;
        }

        /// <summary>
        ///   Modella la complessità legata ad una <see cref="RichiestaAssistenza" />. Le soglie
        ///   sono le seguenti: 0 - 20: bassa; 21 - 60: media; maggiore di 61: alta;
        /// </summary>
        public virtual Complessita.IComplessita Complessita
        {
            get
            {
                if (this._eventi.Count <= 20)
                {
                    return new Complessita.Bassa();
                }

                if (this._eventi.Count <= 60)
                {
                    return new Complessita.Media();
                }

                return new Complessita.Alta();
            }
        }

        public string NotePubbliche { get; set; }

        public string NotePrivate { get; set; }

        /// <summary>
        ///   Aggiunge un evento alla lista degli eventi. L'evento deve essersi verificato in un
        ///   istante superiore a quello dell'ultimo evento in lista. In caso contrario il metodo
        ///   solleva un'eccezione.
        /// </summary>
        /// <param name="evento">L'evento da aggiungere</param>
        public void AddEvento(Evento evento)
        {
            const string OrarioErrato = "Impossibile aggiungere un evento ad una partenza che ne ha già uno più recente.";
            const string OrarioFuturo = "Impossibile aggiungere un evento con data futura.";
            const string EventoGiaPresente = "Impossibile aggiungere l'evento specificato. L'evento è già presente.";

            var uscitaPartenza = evento as UscitaPartenza;
            var composizionePartenza = evento as ComposizionePartenze;
            var telefonata = evento as Telefonata;
            var richiestaSoccorsoAereo = evento as RichiestaSoccorsoAereo;
            var inviareFonogramma = evento as InviareFonogramma;
            var fonogrammaInviato = evento as FonogrammaInviato;
            var entiIntervenuti = evento as InserimentoEnteIntervenuto;
            var sostituzione = evento as SostituzionePartenzaFineTurno;

            if ((composizionePartenza == null
                && telefonata == null
                && uscitaPartenza == null
                && richiestaSoccorsoAereo == null
                && inviareFonogramma == null
                && fonogrammaInviato == null
                && entiIntervenuti == null
                && sostituzione == null)
                && evento.Istante.AddHours(2) > DateTime.Now.AddSeconds(1))
                throw new Exception(OrarioFuturo);

            if (_eventi.Count > 0)
            {
                if (evento is AbstractPartenza && _eventi.OfType<AbstractPartenza>().Any())
                {
                    var InViaggio = _eventi.OfType<ComposizionePartenze>()
                                    .Where(e => e.CodicePartenza == ((AbstractPartenza)evento).CodicePartenza)
                                    .Where(e => Aperta).FirstOrDefault();

                    var SulPosto = _eventi.OfType<ArrivoSulPosto>()
                                    .Where(e => e.CodicePartenza == ((AbstractPartenza)evento).CodicePartenza)
                                    .Where(e => Aperta).FirstOrDefault();

                    var InRientro = _eventi.OfType<PartenzaInRientro>()
                                    .Where(e => e.CodicePartenza == ((AbstractPartenza)evento).CodicePartenza)
                                    .Where(e => Aperta).FirstOrDefault();

                    var Rientrata = _eventi.OfType<PartenzaRientrata>()
                                    .Where(e => e.CodicePartenza == ((AbstractPartenza)evento).CodicePartenza)
                                    .Where(e => Aperta).FirstOrDefault();

                    if (evento is ArrivoSulPosto)
                    {
                        if (SulPosto != null)
                            throw new Exception(EventoGiaPresente);

                        if (InViaggio != null)
                            if (evento.Istante <= InViaggio.Istante)
                                throw new Exception(OrarioErrato);

                        if (InRientro != null)
                            if (evento.Istante >= InRientro.Istante)
                                throw new Exception(OrarioErrato);

                        if (Rientrata != null)
                            if (evento.Istante >= Rientrata.Istante)
                                throw new Exception(OrarioErrato);
                    }

                    if (evento is PartenzaInRientro)
                    {
                        if (InRientro != null)
                            throw new Exception(EventoGiaPresente);

                        if (InViaggio != null)
                            if (evento.Istante <= InViaggio.Istante)
                                throw new Exception(OrarioErrato);

                        if (SulPosto != null)
                            if (evento.Istante <= SulPosto.Istante)
                                throw new Exception(OrarioErrato);

                        if (Rientrata != null)
                            if (evento.Istante >= Rientrata.Istante)
                                throw new Exception(OrarioErrato);
                    }

                    if (evento is PartenzaRientrata)
                    {
                        if (Rientrata != null)
                            throw new Exception(EventoGiaPresente);

                        if (InViaggio != null)
                            if (evento.Istante <= InViaggio.Istante)
                                throw new Exception(OrarioErrato);

                        if (InRientro != null)
                            if (evento.Istante <= InRientro.Istante)
                                throw new Exception(OrarioErrato);

                        if (SulPosto != null)
                            if (evento.Istante <= SulPosto.Istante)
                                throw new Exception(OrarioErrato);
                    }
                }
            }

            _eventi.Add(evento);
        }

        /// <summary>
        ///   E' un testo che riassume lo stato della richiesta, tra i seguenti: X (chiusa), C
        ///   (chiamata), A (assegnata), S (sospesa), P (presidiata). Gli stati sono mutuamente
        ///   esclusivi e sono utilizzati esclusivamente a scopo di filtraggio efficiente sul database.
        /// </summary>
        public string TestoStatoRichiesta
        {
            get
            {
                var stato = this.StatoRichiesta;

                if (stato is Assegnata)
                    return "A";
                else if (stato is Presidiata)
                    return "P";
                else if (stato is Sospesa)
                    return "S";
                else if (stato is Chiusa)
                    return "X";
                else
                    return "C";

                //var eventoChiusura = _eventi.LastOrDefault() is ChiusuraRichiesta;
                //var eventoSospesa = _eventi.LastOrDefault() is RichiestaSospesa || _eventi.LastOrDefault() is RevocaPerRiassegnazione;
                //var eventoPresidiata = _eventi.LastOrDefault() is RichiestaPresidiata || _eventi.LastOrDefault() is ArrivoSulPosto;
                //var eventoAssegnata = _eventi.LastOrDefault() is AssegnataRichiesta || _eventi.LastOrDefault() is ComposizionePartenze; //this.CodRichiesta != null ? true : false; //
                //var eventoRiaperta = _eventi.LastOrDefault() is RiaperturaRichiesta;
                //var eventoRientrata = _eventi.LastOrDefault() is PartenzaRientrata;
                //var eventoInRientro = _eventi.LastOrDefault() is PartenzaInRientro;

                //if (eventoChiusura)
                //    return "X";
                //else if (eventoPresidiata)
                //    return "P";
                //else if (eventoAssegnata || eventoRiaperta || eventoInRientro || eventoRientrata)
                //    return "A";
                //else if (eventoSospesa)
                //    return "S";
                //else
                //    return "C";
            }
            protected set
            {
            }
        }

        public List<Partenza> lstPartenze => Eventi.OfType<ComposizionePartenze>()?.Select(c => c.Partenza).ToList();

        public List<Partenza> lstPartenzeInCorso => Partenze?
            .Where(p => !p.Partenza.PartenzaAnnullata)
            .Select(p => p.Partenza)
            .Where(p => !p.PartenzaAnnullata && !p.Sganciata && !p.Terminata)
            .ToList();

        /// <summary>
        ///   Se non ci sono partenze è uguale a 0
        /// </summary>
        public string CodiceUltimaPartenza => _eventi.OfType<AbstractPartenza>().Count() != 0 ?
            _eventi.OfType<AbstractPartenza>().Select(e => e.CodicePartenza).Max() ?? "0"
            : "0";

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
        public bool Esercitazione { get; set; } = false;

        [BsonIgnore]
        public List<string> lstSquadre => Partenze.SelectMany(p => p.Partenza.Squadre).Select(s => s.Nome).ToList();

        [BsonIgnore]
        public DateTime dataOraInserimento => Telefonate.First().DataOraInserimento;
    }
}
