//-----------------------------------------------------------------------
// <copyright file="Componente.cs" company="CNVVF">
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
namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza
{
    /// <summary>
    ///   Modella il componente di una squadra
    /// </summary>
    public class Componente
    {
        /// <summary>
        ///   La descrizione della qualifica
        /// </summary>
        public string DescrizioneQualifica { get; set; }

        /// <summary>
        ///   Il nominativo esteso del componente
        /// </summary>
        public string Nominativo { get; set; }

        /// <summary>
        ///   Il tooltip, utile specialmente per sanare problemi di omonimia
        /// </summary>
        public string Tooltip { get; set; }

        /// <summary>
        ///   Indicazione del ruolo di capopartenza
        /// </summary>
        public bool CapoPartenza { get; set; }

        /// <summary>
        ///   Indicazione del ruolo di autista
        /// </summary>
        public bool Autista { get; set; }

        /// <summary>
        ///   Indicazione del ruolo di rimpiazzo
        /// </summary>
        public bool Rimpiazzo { get; set; }
    }
}
