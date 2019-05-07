//-----------------------------------------------------------------------
// <copyright file="Squadra.cs" company="CNVVF">
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

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza
{
    /// <summary>
    ///   Modella la squadra
    /// </summary>
    public class Squadra
    {
        /// <summary>
        ///   Il nome della squadra
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        ///   E' l'istante in cui la squadra ha terminato il suo impegno sulla richiesta. Se è null,
        ///   la squadra è ancora impegnata sulla richiesta.
        /// </summary>
        public DateTime? IstanteTermineImpegno { get; set; }

        /// <summary>
        ///   I componenti della squadra
        /// </summary>
        public Componente[] Componenti { get; set; }
    }
}
