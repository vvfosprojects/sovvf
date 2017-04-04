//-----------------------------------------------------------------------
// <copyright file="IndicatoriStatoSoccorsoQueryHandler.cs" company="CNVVF">
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
using System.Collections.Generic;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.ResultDTO;
using Modello.Servizi.Infrastruttura.Organigramma;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso
{
    /// <summary>
    ///   Restituisce gli indicatori sullo stato del soccorso per un insieme di unità operative.
    /// </summary>
    public class IndicatoriStatoSoccorsoQueryHandler : IQueryHandler<IndicatoriStatoSoccorsoQuery, IndicatoriStatoSoccorsoResult>
    {
        /// <summary>
        ///   Handler del servizio che restituisce i codici dei sottoalberi in organigramma
        /// </summary>
        private readonly IGetNodiFigliPerCodiceUnitaOperativa getNodiFigliPerCodiceUnitaOperativa;

        /// <summary>
        ///   Metodi di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public IndicatoriStatoSoccorsoResult Handle(IndicatoriStatoSoccorsoQuery query)
        {
            var listaCodiciUnitaOperative = new HashSet<string>();
            foreach (var nodo in query.NodiOrganigramma)
            {
                if (nodo.Ricorsivo)
                {
                    var nodi = this.getNodiFigliPerCodiceUnitaOperativa.Get(nodo.CodiceUnitaOperativa);
                    foreach (var singoloNodo in nodi)
                    {
                        listaCodiciUnitaOperative.Add(singoloNodo.Codice);
                    }
                }
                else
                {
                    listaCodiciUnitaOperative.Add(nodo.CodiceUnitaOperativa);
                }
            }

            // estrarre le richieste di assistenza relative alle Unità Operative interessate

            // calcolare i valori degli indicatori.
            throw new NotImplementedException();
        }
    }
}
