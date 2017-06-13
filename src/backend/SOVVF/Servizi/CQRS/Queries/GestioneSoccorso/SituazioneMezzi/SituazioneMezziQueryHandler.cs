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
using Modello.Classi.Organigramma;
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
        ///   L'istanza del servizio <see cref="IGetUnitaOperativeVisibiliPerSoccorso" />
        /// </summary>
        private readonly IGetUnitaOperativeVisibiliPerSoccorso getCodiciUnitaOperativeVisibiliPerSoccorso;

        /// <summary>
        ///   L'istanza del servizio <see cref="IEspandiTagsNodoSuOrganigramma" />
        /// </summary>
        private readonly IEspandiTagsNodoSuOrganigramma espandiTagsNodoSuOrganigramma;

        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetRichiestePerSituazioneMezzi getRichiestePerSituazioneMezzi;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getCodiciUnitaOperativeVisibiliPerSoccorso">Istanza del servizio <see cref="IGetUnitaOperativeVisibiliPerSoccorso" /></param>
        /// <param name="espandiTagsNodoSuOrganigramma">Istanza del servizio <see cref="IEspandiTagsNodoSuOrganigramma" /></param>
        /// <param name="getRichiestePerSituazioneMezzi">Istanza del servizio <see cref="IGetRichiestePerSituazioneMezzi" /></param>
        public SituazioneMezziQueryHandler(
            IGetUnitaOperativeVisibiliPerSoccorso getCodiciUnitaOperativeVisibiliPerSoccorso,
            IEspandiTagsNodoSuOrganigramma espandiTagsNodoSuOrganigramma,
            IGetRichiestePerSituazioneMezzi getRichiestePerSituazioneMezzi)
        {
            this.getCodiciUnitaOperativeVisibiliPerSoccorso = getCodiciUnitaOperativeVisibiliPerSoccorso;
            this.espandiTagsNodoSuOrganigramma = espandiTagsNodoSuOrganigramma;
            this.getRichiestePerSituazioneMezzi = getRichiestePerSituazioneMezzi;
        }

        /// <summary>
        ///   Metodi di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public SituazioneMezziResult Handle(SituazioneMezziQuery query)
        {
            IEnumerable<string> listaCodiciUnitaOperative;

            // se il DTO contiene un riferimento null, si usa il profilo di default dell'utente autenticato
            if (query.UnitaOperative == null)
            {
                listaCodiciUnitaOperative = this.getCodiciUnitaOperativeVisibiliPerSoccorso.Get();
            }
            else
            { // altrimenti si espande l'elenco dei tags
                var tagsNodi = query.UnitaOperative
                    .Select(t => new TagNodo(t.Codice, t.Ricorsivo));

                listaCodiciUnitaOperative = this.espandiTagsNodoSuOrganigramma.Espandi(tagsNodi);
            }

            // nel caso la lista delle unità operative di interesse sia vuoto, si restituisce un
            // result set vuoto.
            if (!listaCodiciUnitaOperative.Any())
            {
                return new SituazioneMezziResult()
                {
                    SituazioneMezzi = Enumerable.Empty<SituazioneMezzo>()
                };
            }

            // Preleva le richieste
            var richiesteDiAssistenza = this.getRichiestePerSituazioneMezzi.Get(listaCodiciUnitaOperative);

            // Crea la lista degli eventi, conservando per ogni evento il codice della richiesta dal
            // quale proviene
            var eventiConCodiceRichiesta = richiesteDiAssistenza.SelectMany(r => r.Eventi.Select(e => new
            {
                CodiceRichiesta = r.Codice,
                Evento = e
            }));

            // Di tutti gli eventi, seleziona solo quelli di interesse per un mezzo
            var eventiPartenza = eventiConCodiceRichiesta
                .Where(em => em.Evento is IPartenza)
                .Select(em => new
                {
                    CodiceRichiesta = em.CodiceRichiesta,
                    Evento = em.Evento as IPartenza
                });

            // Fa l'unwind degli eventi in base ai mezzi che ogni evento coinvolge, conservando il
            // codice mezzo per ogni evento
            var eventiConCodiceMezzo = eventiPartenza.SelectMany(
                e => e.Evento.CodiciMezzo.Distinct(),
                (evento, codiceMezzo) => new
                {
                    CodiceRichiesta = evento.CodiceRichiesta,
                    CodiceMezzo = codiceMezzo,
                    Evento = evento.Evento
                });

            // Raggruppa gli eventi per codice mezzo
            var eventiPerCodiceMezzo = eventiConCodiceMezzo.GroupBy(e => e.CodiceMezzo);

            var situazioneMezzi =
                from gruppo in eventiPerCodiceMezzo
                let eventoPiuRecente = gruppo.OrderByDescending(e => e.Evento.Istante).First()
                select new SituazioneMezzo()
                {
                    Codice = gruppo.Key,
                    CodiceStato = eventoPiuRecente.Evento.GetStatoMezzo().Codice,
                    CodiceRichiestaAssistenza = eventoPiuRecente.CodiceRichiesta,
                    IstanteAggiornamentoStato = eventoPiuRecente.Evento.Istante
                };

            return new SituazioneMezziResult()
            {
                SituazioneMezzi = situazioneMezzi
            };
        }
    }
}
