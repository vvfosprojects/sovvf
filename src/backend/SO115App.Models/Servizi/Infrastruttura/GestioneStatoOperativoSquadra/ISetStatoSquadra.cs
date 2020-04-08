//-----------------------------------------------------------------------
// <copyright file="ISetStatoSquadra.cs" company="CNVVF">
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
namespace SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra
{
    /// <summary>
    ///   servizio per il set dello stato operativo di una squadra
    /// </summary>
    public interface ISetStatoSquadra
    {
        /// <summary>
        ///   metodo del servizio che setta lo stato operativo della squadra su base dati
        /// </summary>
        /// <param name="idSquadra">l'identificativo della squadra</param>
        /// <param name="idRichiesta">l'identificativo della richiesta</param>
        /// <param name="statoSquadra">lo stato operativo da trascrivere</param>
        void SetStato(string idSquadra, string idRichiesta, string statoSquadra, string codiceSede);
    }
}
