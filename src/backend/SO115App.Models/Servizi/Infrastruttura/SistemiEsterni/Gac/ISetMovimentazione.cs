//-----------------------------------------------------------------------
// <copyright file="ISetMovimentazione.cs" company="CNVVF">
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

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac
{
    /// <summary>
    ///   Servizio scrive la movimentazione del mezzo sul servizio esterno GAC.
    /// </summary>
    public interface ISetMovimentazione
    {
        /// <summary>
        ///   scrive la movimentazione
        /// </summary>
        /// <param name="codiceMezzo">il codice del mezzo in movimentaizone</param>
        /// <param name="idRichiesta">il codice della richiesta</param>
        /// <param name="statoOperativo">lo stato operativo del mezzo</param>
        /// <param name="timeStamp">la data di inizio movimentazione</param>

        void Set(string codiceMezzo, string idRichiesta, string statoOperativo, DateTime timeStamp);
    }
}
