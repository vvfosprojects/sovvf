//-----------------------------------------------------------------------
// <copyright file="SituazioneMezziQueryHandler.cs" company="CNVVF">
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
using System.Linq;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.ResultDTO;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;
using Modello.Servizi.Infrastruttura.Organigramma;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi
{
    /// <summary>
    ///   Restituisce lo stato dei mezzi impiegati per il soccorso.
    /// </summary>
    public class SituazioneMezziQueryHandler : IQueryHandler<SituazioneMezziQuery, SituazioneMezziResult>
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetRichiestePerSituazioneMezzi getRichiestePerSituazioneMezzi;

        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetUnitaOperativaPerCodice getUnitaOperativaPerCodice;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getRichiestePerSituazioneMezzi">Istanza del servizio <see cref="IGetRichiestePerSituazioneMezzi" /></param>
        /// <param name="getUnitaOperativaPerCodice">Istanza del servizio <see cref="IGetUnitaOperativaPerCodice" /></param>
        public SituazioneMezziQueryHandler(
            IGetRichiestePerSituazioneMezzi getRichiestePerSituazioneMezzi,
            IGetUnitaOperativaPerCodice getUnitaOperativaPerCodice)
        {
            this.getRichiestePerSituazioneMezzi = getRichiestePerSituazioneMezzi;
            this.getUnitaOperativaPerCodice = getUnitaOperativaPerCodice;
        }

        /// <summary>
        ///   Metodi di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public SituazioneMezziResult Handle(SituazioneMezziQuery query)
        {
            var listaCodiciUnitaOperative = new HashSet<string>();
            foreach (var uo in query.UnitaOperative)
            {
                if (uo.Ricorsivo)
                {
                    var nodo = this.getUnitaOperativaPerCodice.Get(uo.Codice);
                    var nodi = nodo.GetSottoAlbero();

                    foreach (var singoloNodo in nodi)
                    {
                        listaCodiciUnitaOperative.Add(singoloNodo.Codice);
                    }
                }
                else
                {
                    listaCodiciUnitaOperative.Add(uo.Codice);
                }
            }

            var richiesteDiAssistenza = this.getRichiestePerSituazioneMezzi.Get(listaCodiciUnitaOperative);
            var eventiMarcati = richiesteDiAssistenza.SelectMany(r => r.Eventi.Select(e => new
            {
                CodiceRichiesta = r.Codice,
                Evento = e
            }))
            .OrderByDescending(em => em.Evento.Istante);

            var eventiPartenzaMarcati = eventiMarcati
                .Where(em => em.Evento is IPartenza)
                .Select(em => new
                {
                    CodiceRichiesta = em.CodiceRichiesta,
                    Evento = em.Evento as IPartenza
                });

            var codiciMezzo = eventiPartenzaMarcati.SelectMany(e => e.Evento.CodiciMezzo).Distinct();

            foreach (var c in codiciMezzo)
            {
                var eventoPiuRecente = eventiPartenzaMarcati.First(e => e.Evento.CodiciMezzo.Contains(c));
                var stato = eventoPiuRecente.Evento.GetStatoMezzo();
                var istante = eventoPiuRecente.Evento.Istante;
                var codiceRichiestaAssistenza = eventoPiuRecente.CodiceRichiesta;
            }
        }
    }
}
