//-----------------------------------------------------------------------
// <copyright file="RichiesteAssistenza.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.ListaEventi;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.ListaEventi
{
    public class RichiesteAssistenza
    {
        public string Codice { get; set; }
        public object CodiceUnitaOperativaCompetente { get; set; }
        public object CodiciUnitaOperativeAllertate { get; set; }
        public List<Eventi> Eventi { get; set; }
        public object Geolocalizzazione { get; set; }
        public List<Telefonate> Telefonate { get; set; }
        public Operatore Operatore { get; set; }
        public bool Sospesa { get; set; }
        public bool InAttesa { get; set; }
        public object Rilevante { get; set; }
        public MezziCoinvolti MezziCoinvolti { get; set; }
        public object SquadreCoinvolte { get; set; }
        public object IstanteChiusura { get; set; }
        public List<Tipologia> Tipologie { get; set; }
        public Localita Localita { get; set; }
        public string Indirizzo { get; set; }
        public object NoteLocalita { get; set; }
        public string Descrizione { get; set; }
        public object ZoneEmergenza { get; set; }
        public List<object> Tags { get; set; }
        public bool Chiusa { get; set; }
        public bool Aperta { get; set; }
        public int PrioritaRichiesta { get; set; }
        public DateTime IstanteRicezioneRichiesta { get; set; }
        public object IstantePresaInCarico { get; set; }
        public object IstantePrimaAssegnazione { get; set; }
        public StatoRichiesta StatoRichiesta { get; set; }
        public bool Presidiato { get; set; }
        public Richiedente Richiedente { get; set; }
        public object NumeroRichiedente { get; set; }
        public object CodiciUOCompetenza { get; set; }
        public object Competenze { get; set; }
        public object CodiceSchedaNue { get; set; }
        public StatoInvioFonogramma StatoInvioFonogramma { get; set; }
        public Complessita Complessita { get; set; }
        public string Id { get; set; }
    }
}
