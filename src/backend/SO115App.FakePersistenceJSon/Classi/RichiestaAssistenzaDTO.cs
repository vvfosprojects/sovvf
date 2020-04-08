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
        private List<Object> eventi;

        /// <summary>
        ///   Costruisce una nuova istanza di <see cref="RichiestaAssistenza" />
        /// </summary>
        [JsonConstructor]
        public RichiestaAssistenzaDTO()
        {
            this.eventi = new List<Object>();
            this.Tipologie = new List<string>();
            this.Telefonate = new List<Telefonata>();
            this.Tags = new HashSet<string>();
            this.Competenze = new List<Sede>();
        }

        public string Id { get; set; }
        public string Cod { get; set; }

        public string CodRichiesta { get; set; }

        public string CodSOCompetente { get; set; }

        public ISet<string> CodSOAllertate { get; set; }

        public List<Object> Eventi
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

        public bool Sospesa { get; set; }
        public bool InAttesa { get; set; }

        public virtual bool Rilevante
        {
            get;
            set;
        }

        public bool RilevanteGrave { get; set; }

        public bool RilevanteStArCu { get; set; }

        public IEnumerable<SquadraCoinvolta> SquadreCoinvolte
        {
            get;
            set;
        }

        public DateTime? IstanteChiusura { get; internal set; }
        public virtual List<string> Tipologie { get; set; }
        public virtual Localita Localita { get; set; }
        public string TrnInsChiamata { get; set; }
        public List<TipologiaTerreno> TipoTerreno { get; set; }
        public List<string> CodEntiIntervenuti { get; set; }
        public ObiettivoSensibile ObiettivoSensibile { get; set; }
        public virtual string Descrizione { get; set; }
        public virtual string[] CodZoneEmergenza { get; set; }
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

        public virtual bool Presidiata
        {
            get
            {
                var ElencoPresidiate = this.Eventi
                    .Where(e => e is RichiestaPresidiata)
                    .Select(e => e as RichiestaPresidiata)
                    .ToList();

                if (ElencoPresidiate.Count > 0)
                    return true;

                return false;
            }
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

        public List<string> UtInLavorazione { get; set; }

        public List<string> UtPresaInCarico { get; set; }

        public virtual DateTime? IstantePrimaAssegnazione
        {
            get;
            set;
        }

        public IStatoRichiesta StatoRichiesta
        {
            get
            {
                if (this.Chiusa)
                {
                    return new Chiusa();
                }
                else if (this.Presidiata)
                {
                    return new Presidiata();
                }
                else if (this.Aperta && this.Partenze == null)
                {
                    return new InAttesa();
                }
                else if (this.Partenze != null && !this.Presidiata)
                {
                    return new Assegnata();
                }
                else if (this.Sospesa)
                    return new Sospesa();
                else
                    return new InAttesa();
            }
        }

        public virtual Richiedente Richiedente { get; set; }

        public virtual string[] CodUOCompetenza { get; set; }
        public virtual List<Sede> Competenze { get; set; }

        public virtual string CodNue
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

        public string NotePubbliche { get; set; }

        public string NotePrivate { get; set; }

        public string CodOperatore { get; set; }
    }
}
