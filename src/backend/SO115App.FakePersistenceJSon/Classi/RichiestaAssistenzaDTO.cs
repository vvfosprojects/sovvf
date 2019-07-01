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
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Persistenza;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Fonogramma;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Classi.Utenti;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Soccorso;
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
    public class RichiestaAssistenzaDTO
    {
        private List<Evento> eventi;

        /// <summary>
        ///   Costruisce una nuova istanza di <see cref="RichiestaAssistenza" />
        /// </summary>
        [JsonConstructor]
        public RichiestaAssistenzaDTO()
        {
            this.eventi = new List<Evento>();
            this.Tipologie = new List<Tipologia>();
            this.Telefonate = new List<Telefonata>();
            this.Tags = new HashSet<string>();
            this.Competenze = new List<Sede>();
        }

        public string Id { get; set; }
        public string Codice { get; set; }

        public string CodiceRichiesta { get; set; }

        public string CodiceUnitaOperativaCompetente { get; set; }

        public ISet<string> CodiciUnitaOperativeAllertate { get; set; }

        public List<Evento> Eventi
        {
            get
            {
                return this.eventi;
            }
        }

        public Coordinate Geolocalizzazione { get; set; }

        public List<Telefonata> Telefonate
        {
            get;
            set;
        }

        public List<ComposizionePartenze> Partenze
        {
            get; set;
        }

        public Utente Operatore { get; set; }

        public bool Sospesa { get; set; }
        public bool InAttesa { get; set; }

        public virtual bool Rilevante
        {
            get;
            set;
        }

        public bool RilevanzaStArCu { get; set; }

        public IDictionary<string, IStatoMezzo> MezziCoinvolti
        {
            get;
            set;
        }

        public IEnumerable<SquadraCoinvolta> SquadreCoinvolte
        {
            get;
            set;
        }

        public DateTime? IstanteChiusura { get; internal set; }
        public virtual List<Tipologia> Tipologie { get; set; }
        public virtual Localita Localita { get; set; }
        public Turno TurnoInserimentoChiamata { get; set; }
        public Turno TurnoIntervento { get; set; }
        public List<TipologiaTerreno> TipoTerreno { get; set; }
        public List<EntiIntervenuti> ListaEntiIntervenuti { get; set; }
        public ObiettivoSensibile ObiettivoSensibile { get; set; }
        public virtual string Descrizione { get; set; }
        public virtual string[] ZoneEmergenza { get; set; }
        public ISet<string> Tags { get; set; }

        public bool Chiusa
        {
            get;
            set;
        }

        public bool Aperta
        {
            get;
            set;
        }

        public virtual Priorita PrioritaRichiesta
        {
            get;
            set;
        }

        public virtual DateTime? IstanteRicezioneRichiesta
        {
            get;
            set;
        }

        public virtual DateTime? IstantePresaInCarico
        {
            get;
            set;
        }

        public List<AttivitaUtente> ListaUtentiInLavorazione { get; set; }

        public List<AttivitaUtente> ListaUtentiPresaInCarico { get; set; }

        public virtual DateTime? IstantePrimaAssegnazione
        {
            get;
            set;
        }

        public IStatoRichiesta StatoRichiesta
        {
            get
            {
                var eventoChiusura = this.eventi
                    .Where(e => e is ChiusuraRichiesta);

                if (this.Chiusa)
                {
                    return new Chiusa();
                }

                var elencoMezziCoinvolti = this.MezziCoinvolti;
                if (elencoMezziCoinvolti != null && !elencoMezziCoinvolti.Any())
                {
                    return new InAttesa();
                }
                else
                {
                    if (elencoMezziCoinvolti != null && elencoMezziCoinvolti.Values.Any(e => e.AssegnatoARichiesta))
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

        public virtual bool Presidiato
        {
            get;
            set;
        }

        public virtual Richiedente Richiedente { get; set; }
        public virtual string NumeroRichiedente { get; set; }

        public virtual string[] CodiciUOCompetenza { get; set; }
        public virtual List<Sede> Competenze { get; set; }

        public virtual string CodiceSchedaNue
        {
            get;
            set;
        }

        public virtual API.Models.Classi.Soccorso.Fonogramma.IStatoFonogramma StatoInvioFonogramma
        {
            get
            {
                var ultimoEventoFonogramma = this.eventi
                    .Where(e => e is IFonogramma)
                    .LastOrDefault();

                if (ultimoEventoFonogramma is FonogrammaInviato)
                {
                    return new API.Models.Classi.Soccorso.Fonogramma.Inviato();
                }

                if (ultimoEventoFonogramma is InviareFonogramma)
                {
                    return new API.Models.Classi.Soccorso.Fonogramma.DaInviare();
                }

                return new API.Models.Classi.Soccorso.Fonogramma.NonNecessario();
            }
        }

        public virtual SO115App.API.Models.Classi.Soccorso.Complessita.IComplessita Complessita
        {
            get
            {
                if (this.eventi.Count <= 20)
                {
                    return new SO115App.API.Models.Classi.Soccorso.Complessita.Bassa();
                }

                if (this.eventi.Count <= 60)
                {
                    return new SO115App.API.Models.Classi.Soccorso.Complessita.Media();
                }

                return new SO115App.API.Models.Classi.Soccorso.Complessita.Alta();
            }
        }
    }
}
