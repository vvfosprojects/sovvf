﻿//-----------------------------------------------------------------------
// <copyright file="FiltroRicercaRichiesteAssistenza.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Organigramma;

namespace SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza
{
    /// <summary>
    ///   Modella il filtro utilizzato per la ricerca di richieste di assistenza
    /// </summary>
    public class FiltroRicercaRichiesteAssistenza
    {
        /// <summary>
        ///   Indica lo stato in cui può trovarsi una richiesta con riferimento all'avanzamento
        ///   nella sua gestione.
        /// </summary>
        public List<string> StatiRichiesta { get; set; }

        /// <summary>
        ///   Indica il numero di pagina che si vuole ricevere (la prima pagina ha indice 1)
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        ///   Indica la dimensione di una pagina
        /// </summary>
        public int PageSize { get; set; } = 7;

        /// <summary>
        ///   Le unità operative per cui vengono selezionate le richieste. Se questo riferimento è
        ///   vuoto si assumono le unità operative sulle quali ha visibilità l'utente correntemente autenticato.
        /// </summary>
        public ISet<PinNodo> UnitaOperative { get; set; }

        /// <summary>
        ///   Indica se si vogliono includere le richieste aperte
        ///   andrebbe eliminato questo filtro
        /// </summary>
        public bool IncludiRichiesteAperte { get; set; } = true;

        /// <summary>
        ///   Indica se si vogliono includere le richieste chiuse
        ///   andrebbe eliminato questo filtro
        /// </summary>
        public bool IncludiRichiesteChiuse { get; set; } = false;

        /// <summary>
        ///   Contiene eventuali filtri delle tipologie
        /// </summary>
        public string[] FiltriTipologie { get; set; }

        /// <summary>
        ///   Indica una chiave di ricerca full-text
        /// </summary>
        public string SearchKey { get; set; }

        /// <summary>
        ///   Indica l'estensione territoriale delle richieste da cercare
        /// </summary>
        public Geolocalizzazione GeoLocalizzazione { get; set; }

        /// <summary>
        ///   L'id dell'operatore che sta facendo la richiesta
        /// </summary>
        public string idOperatore { get; set; }

        public Localita IndirizzoIntervento { get; set; }

        /// <summary>
        /// Indica se visualizzare solo le chiamate, o solo gli interventi, o entrambi
        /// </summary>
        public string TipologiaRichiesta { get; set; } = "ChiamateInterventi";

        public PeriodoChiuse PeriodoChiuse { get; set; }

        public List<string> ZoneEmergenza { get; set; }
    }

    public class PeriodoChiuse
    {
        public string Turno { get; set; }
        public DateTime? Da { get; set; }
        public DateTime? A { get; set; }
        public DateTime? Data { get; set; }
    }
}
