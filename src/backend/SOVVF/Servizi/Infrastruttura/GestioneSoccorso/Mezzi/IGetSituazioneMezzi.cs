//-----------------------------------------------------------------------
// <copyright file="IGetSituazioneMezzi.cs" company="CNVVF">
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
using Modello.Classi.Organigramma;
using Modello.Classi.Soccorso.Mezzi.SituazioneMezzo;

namespace Modello.Servizi.Infrastruttura.GestioneSoccorso.Mezzi
{
    /// <summary>
    ///   Servizio che restituisce la situazione dei mezzi in servizio
    /// </summary>
    public interface IGetSituazioneMezzi
    {
        /// <summary>
        ///   Restituisce la situazione dei mezzi in servizio con riferimento alle unità operative
        ///   indicate. Se la lista è vuota viene restituita la situazione di interesse per l'utente autenticato.
        /// </summary>
        /// <param name="codiciUnitaOperative">I codici delle unità operative di interesse</param>
        /// <returns>La situazione dei mezzi</returns>
        IEnumerable<SituazioneMezzo> Get(ISet<PinNodo> codiciUnitaOperative);
    }
}
