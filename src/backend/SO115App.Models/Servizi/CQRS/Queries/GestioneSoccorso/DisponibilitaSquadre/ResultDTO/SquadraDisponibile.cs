//-----------------------------------------------------------------------
// <copyright file="SquadraDisponibile.cs" company="CNVVF">
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
using System.Collections.Generic;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre.ResultDTO
{
    /// <summary>
    ///   Modella la squadra disponibile
    /// </summary>
    public class SquadraDisponibile
    {
        /// <summary>
        ///   E' il ticket della squadra
        /// </summary>
        public string Ticket { get; set; }

        /// <summary>
        ///   E' la sigla parlante della squadra
        /// </summary>
        public string Sigla { get; set; }

        /// <summary>
        ///   E' il tooltip che verrà mostrato sul client (es: data inizio e fine servizio prevista
        ///   ed effettiva)
        /// </summary>
        public string Tooltip { get; set; }

        /// <summary>
        ///   Descrizione Unità Operativa Responsabile della squadra
        /// </summary>
        public string DescrizioneUnitaOperativaResponsabile { get; set; }

        /// <summary>
        ///   Elenco dei membri che compongono la squadra
        /// </summary>
        public IEnumerable<Membro> Membri { get; set; }

        /// <summary>
        ///   Indica se la squadra è stata selezionata (se è vuoto indica che la squadra non è selezionata)
        /// </summary>
        public SelezioneSquadra SelezionataDa { get; set; }
    }
}