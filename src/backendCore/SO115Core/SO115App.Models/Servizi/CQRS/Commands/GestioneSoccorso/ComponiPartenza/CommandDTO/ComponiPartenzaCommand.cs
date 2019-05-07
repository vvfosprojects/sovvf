//-----------------------------------------------------------------------
// <copyright file="ComponiPartenzaCommand.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using System.Collections.Generic;

namespace SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza.CommandDTO
{
    /// <summary>
    ///   DTO del command <see cref="ComponiPartenza" />
    /// </summary>
    public class ComponiPartenzaCommand
    {
        /// <summary>
        ///   E' l'id che identifica sul database la richiesta di assistenza.
        /// </summary>
        public string IdRichiestaAssistenza { get; set; }

        /// <summary>
        ///   E' l'attributo che identifica la collezione di <see cref="ComposizionePartenze" /> già
        ///   definita nelle classi del dominio
        /// </summary>
        public IEnumerable<ComposizionePartenze> ComposizioniPartenza { get; set; }
    }
}