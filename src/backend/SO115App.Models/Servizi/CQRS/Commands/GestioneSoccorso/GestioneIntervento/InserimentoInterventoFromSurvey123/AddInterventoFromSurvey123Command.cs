﻿//-----------------------------------------------------------------------
// <copyright file="AddInterventoFromSurvey123.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;

namespace DomainModel.CQRS.Commands.AddInterventoFromSurvey123
{
    public class AddInterventoFromSurvey123Command
    {
        public ChiamataFromSurvey123 Chiamata { get; set; }

        public string CodiceSede { get; set; }

        public string CodUtente { get; set; }

        public RichiestaAssistenza Intervento { get; set; }

        public string[] CodCompetenze { get; set; }
    }
}
