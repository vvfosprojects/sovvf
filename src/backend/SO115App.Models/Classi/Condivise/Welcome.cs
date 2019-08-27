//-----------------------------------------------------------------------
// <copyright file="TipologiaTerreno.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Filtri;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Marker;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Condivise
{
    public class Welcome
    {
        public BoxMezzi BoxListaMezzi { get; set; }
        public BoxPersonale BoxListaPersonale { get; set; }
        public BoxInterventi BoxListaInterventi { get; set; }
        public List<SintesiRichiesta> ListaSintesi { get; set; }
        public List<ChiamateInCorso> ListaChiamateInCorso { get; set; }
        public CentroMappa CentroMappaMarker { get; set; }
        public Filtri ListaFiltri { get; set; }
    }
}
