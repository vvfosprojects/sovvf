﻿//-----------------------------------------------------------------------
// <copyright file="AddInterventoCommand.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo
{
    public class AggiornaStatoMezzoCommand
    {
        public string IdUtente { get; set; }

        public string CodRichiesta { get; set; }

        public string IdMezzo { get; set; }
        public string StatoMezzo { get; set; }
        public string CodicePartenza { get; set; }

        public DateTime DataOraAggiornamento { get; set; }

        public SintesiRichiesta Chiamata { get; set; }

        public RichiestaAssistenza Richiesta { get; set; }

        public string[] CodiciSede { get; set; }

        public string AzioneIntervento { get; set; } = null;
    }
}
