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
using System.Collections.Generic;
using System.Linq;
using Modello.Classi.Soccorso;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.ResultDTO;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;
using Modello.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using Modello.Servizi.Infrastruttura.Organigramma;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso
{
    /// <summary>
    ///   Restituisce gli indicatori sullo stato del soccorso per un insieme di unità operative.
    /// </summary>
    public class IndicatoriStatoSoccorsoQueryHandler : IQueryHandler<IndicatoriStatoSoccorsoQuery, IndicatoriStatoSoccorsoResult>
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetUnitaOperativaPerCodice getUnitaOperativaPerCodice;

        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetRichiesteAssistenzaInCorso getRichiesteAssistenzaInCorso;

        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetNumeroMezziSoccorsoOraInServizio getNumeroMezziSoccorsoOraInServizio;

        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetNumeroSquadreSoccorsoOraInServizio getNumeroSquadreSoccorsoOraInServizio;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getUnitaOperativaPerCodice">Istanza del servizio <see cref="IGetUnitaOperativaPerCodice" /></param>
        /// <param name="getRichiesteAssistenzaPerIndicatoriPerUnitaOperative">
        ///   Istanza del servizio <see cref="IGetRichiesteAssistenzaPerIndicatoriPerUnitaOperative" />
        /// </param>
        /// <param name="getNumeroMezziSoccorsoOraInServizio">Istanza del servizio <see cref="IGetNumeroMezziSoccorsoOraInServizio" /></param>
        /// <param name="getNumeroSquadreSoccorsoOraInServizio">Istanza del servizio <see cref="IGetNumeroSquadreSoccorsoOraInServizio" /></param>
        public IndicatoriStatoSoccorsoQueryHandler(
                IGetUnitaOperativaPerCodice getUnitaOperativaPerCodice,
                IGetRichiesteAssistenzaInCorso getRichiesteAssistenzaInCorso,
                IGetNumeroMezziSoccorsoOraInServizio getNumeroMezziSoccorsoOraInServizio,
                IGetNumeroSquadreSoccorsoOraInServizio getNumeroSquadreSoccorsoOraInServizio)
        {
            this.getUnitaOperativaPerCodice = getUnitaOperativaPerCodice;
            this.getRichiesteAssistenzaInCorso = getRichiesteAssistenzaInCorso;
            this.getNumeroMezziSoccorsoOraInServizio = getNumeroMezziSoccorsoOraInServizio;
            this.getNumeroSquadreSoccorsoOraInServizio = getNumeroSquadreSoccorsoOraInServizio;
        }

        /// <summary>
        ///   Metodi di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public IndicatoriStatoSoccorsoResult Handle(IndicatoriStatoSoccorsoQuery query)
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

            // estrarre le richieste di assistenza in corso relative alle Unità Operative interessate
            var richiesteAssistenza = this.getRichiesteAssistenzaInCorso.Get(listaCodiciUnitaOperative).ToArray();

            // estrae una lista che include una lista di eventi per ogni richiesta
            var eventi = richiesteAssistenza.Select(r => r.Eventi);

            // calcolare i valori degli indicatori.
            var result = new IndicatoriStatoSoccorsoResult()
            {
                NumeroRichiesteInCorso = richiesteAssistenza.Count(),
                NumeroRichiesteSospese = richiesteAssistenza.Count(r => r.Sospesa),
                NumeroRichiesteInAttesa = richiesteAssistenza.Count(r => r.InAttesa),

                NumeroMezziSoccorsoSulPosto = richiesteAssistenza.Sum(r => r.MezziCoinvolti.Count(m => m.StatoDelMezzo is SulPosto)),
                NumeroMezziSoccorsoInRientro = richiesteAssistenza.Sum(r => r.MezziCoinvolti.Count(m => m.StatoDelMezzo is InRientro)),
                NumeroMezziSoccorsoInViaggio = richiesteAssistenza.Sum(r => r.MezziCoinvolti.Count(m => m.StatoDelMezzo is InViaggio)),
                NumeroSquadreSoccorsoImpegnate = richiesteAssistenza.Sum(r => r.CapiPartenzaCoinvolti.Count(m => m.StatoDelCapoPartenza != CapoPartenzaCoinvolto.StatoCapoPartenza.RientratoInSede))
            };

            result.NumeroTotaleMezziSoccorso = this.getNumeroMezziSoccorsoOraInServizio.Get(listaCodiciUnitaOperative);
            result.NumeroTotaleSquadreSoccorso = this.getNumeroSquadreSoccorsoOraInServizio.Get(listaCodiciUnitaOperative);
            return result;
        }
    }
}
