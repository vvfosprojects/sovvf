//-----------------------------------------------------------------------
// <copyright file="IGetRichiestePerSituazioneMezzi.cs" company="CNVVF">
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
using Modello.Classi.Soccorso;

namespace Modello.Servizi.Infrastruttura.GestioneSoccorso
{
    /// <summary>
    ///   Servizio che restituisce l'elenco delle richieste di Assistenza utilizzate per il calcolo
    ///   della situazione dei mezzi di soccorso
    /// </summary>
    public interface IGetRichiestePerSituazioneMezzi
    {
        /// <summary>
        ///   Restituisce l'elenco delle Richieste di Assistenza
        /// </summary>
        /// <param name="codiciUnitaOperative">Elenco dei codici dell'Unità Operativa</param>
        /// <returns>Elenco delle Richieste</returns>
        IEnumerable<RichiestaAssistenza> Get(IEnumerable<string> codiciUnitaOperative);
    }
}
