//-----------------------------------------------------------------------
// <copyright file="GetSituazioneMezzi.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.API.Models.Classi.Soccorso.Mezzi.SituazioneMezzo;
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma;

namespace SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.Implementation
{
    /// <summary>
    ///   Implementazione del servizio di restituzione della situazione dei mezzi
    /// </summary>
    public class GetSituazioneMezzi : IGetSituazioneMezzi
    {
        /// <summary>
        ///   L'istanza del servizio <see cref="IGetUnitaOperativeVisibiliPerSoccorso" />
        /// </summary>
        private readonly IGetUnitaOperativeVisibiliPerSoccorso getCodiciUnitaOperativeVisibiliPerSoccorso;

        /// <summary>
        ///   L'istanza del servizio <see cref="IEspandiPinNodoSuOrganigramma" />
        /// </summary>
        private readonly IEspandiPinNodoSuOrganigramma espandiPinsNodoSuOrganigramma;

        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetRichiestePerSituazioneMezzi getRichiestePerSituazioneMezzi;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getCodiciUnitaOperativeVisibiliPerSoccorso">Istanza del servizio <see cref="IGetUnitaOperativeVisibiliPerSoccorso" /></param>
        /// <param name="espandiPinsNodoSuOrganigramma">Istanza del servizio <see cref="IEspandiPinNodoSuOrganigramma" /></param>
        /// <param name="getRichiestePerSituazioneMezzi">Istanza del servizio <see cref="IGetRichiestePerSituazioneMezzi" /></param>
        public GetSituazioneMezzi(
            IGetUnitaOperativeVisibiliPerSoccorso getCodiciUnitaOperativeVisibiliPerSoccorso,
            IEspandiPinNodoSuOrganigramma espandiPinsNodoSuOrganigramma,
            IGetRichiestePerSituazioneMezzi getRichiestePerSituazioneMezzi)
        {
            this.getCodiciUnitaOperativeVisibiliPerSoccorso = getCodiciUnitaOperativeVisibiliPerSoccorso;
            this.espandiPinsNodoSuOrganigramma = espandiPinsNodoSuOrganigramma;
            this.getRichiestePerSituazioneMezzi = getRichiestePerSituazioneMezzi;
        }

        /// <summary>
        ///   Restituisce la situazione dei mezzi in servizio di interesse per l'utente correntemente autenticato
        /// </summary>
        /// <returns>La situazione dei mezzi</returns>
        public IEnumerable<SituazioneMezzo> Get()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        ///   Restituisce la situazione dei mezzi in servizio con riferimento alle unità operative indicate
        /// </summary>
        /// <param name="codiciUnitaOperative">I codici delle unità operative di interesse</param>
        /// <returns>La situazione dei mezzi</returns>
        public IEnumerable<SituazioneMezzo> Get(ISet<PinNodo> codiciUnitaOperative)
        {
            IEnumerable<string> listaCodiciUnitaOperative;

            // se il DTO contiene un riferimento null, si usa il profilo di default dell'utente autenticato
            if (codiciUnitaOperative == null || !codiciUnitaOperative.Any())
            {
                listaCodiciUnitaOperative = this.getCodiciUnitaOperativeVisibiliPerSoccorso.Get();
            }
            else
            { // altrimenti si espande l'elenco dei pins
                var pinsNodi = codiciUnitaOperative
                    .Select(t => new PinNodo(t.Codice, t.Ricorsivo));

                listaCodiciUnitaOperative = this.espandiPinsNodoSuOrganigramma.Espandi(pinsNodi);
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
                e => e.Evento.CodiciMezzo,
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
                let eventoPiuRecente = gruppo.OrderByDescending(e => e.Evento.istante).First()
                let stato = new ProcessoreStato().ProcessaEventi(gruppo.Select(e => e.Evento)).Stato
                select new SituazioneMezzo()
                {
                    Codice = gruppo.Key,
                    CodiceStato = stato.Codice,
#warning il codice richiesta e l'istante devono essere prelevati dallo stato, e non dall'evento più recente che potrebbe essere ininfluente
                    CodiceRichiestaAssistenza = eventoPiuRecente.CodiceRichiesta,
                    IstanteAggiornamentoStato = eventoPiuRecente.Evento.istante
                };

            return situazioneMezzi;
        }
    }
}
