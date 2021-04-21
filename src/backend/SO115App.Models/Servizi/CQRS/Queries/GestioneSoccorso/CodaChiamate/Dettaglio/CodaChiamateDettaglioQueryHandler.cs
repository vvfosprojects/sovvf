//-----------------------------------------------------------------------
// <copyright file="CodaChiamateDettaglioQueryHandler.cs" company="CNVVF">
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
using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.CodaChiamate.Dettaglio
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori della Navbar.
    /// </summary>
    public class CodaChiamateDettaglioQueryHandler : IQueryHandler<CodaChiamateDettaglioQuery, CodaChiamateDettaglioResult>
    {
        private readonly IGetListaSintesi _iGetListaSintesi;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetComposizioneSquadre _iGetComposizioneSquadre;
        private readonly IGetTurno _getTurno;

        public CodaChiamateDettaglioQueryHandler(IGetListaSintesi iGetListaSintesi, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
                                        IGetComposizioneSquadre iGetComposizioneSquadre, IGetTurno getTurno)
        {
            _iGetListaSintesi = iGetListaSintesi;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _iGetComposizioneSquadre = iGetComposizioneSquadre;
            _getTurno = getTurno;
        }

        /// <summary>
        ///   Query che estrae tutti i parametri iniziali della Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Tutti i parametri iniziali della Home Page</returns>
        public CodaChiamateDettaglioResult Handle(CodaChiamateDettaglioQuery query)
        {
            var listaSquadre = Task.Factory.StartNew(() => _iGetComposizioneSquadre.Get(new ComposizioneSquadreQuery() { CodiciSede = new string[] { query.CodiceSede } }));

            var turnoCorrente = _getTurno.Get().Codice.Substring(0, 1);
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>() { new PinNodo(query.CodiceSede, false) };

            var listaSedi = listaSediAlberate.GetSottoAlbero(pinNodi);
            foreach (var figlio in listaSedi)
            {
                pinNodi.Add(new PinNodo(figlio.Codice, false));
            }

            query.Filtro = new FiltroRicercaRichiesteAssistenza()
            {
                UnitaOperative = pinNodi.ToHashSet(),
                IncludiRichiesteAperte = true,
                IncludiRichiesteChiuse = false
            };

            var listaSintesi = _iGetListaSintesi.GetListaSintesiRichieste(query.Filtro);

            var dettaglio = new DettaglioDistaccamento()
            {
                codDistaccamento = query.CodiceSede,
                descDistaccamento = listaSedi.ToList().Find(x => x.Codice.Equals(query.CodiceSede)).Codice.Contains("1000") ? "Sede Centrale" : listaSedi.ToList().Find(x => x.Codice.Equals(query.CodiceSede)).Nome,
                listaSintesi = listaSintesi?.FindAll(x => x.CodUOCompetenza[0].Equals(query.CodiceSede) && (x.Stato.Equals("Chiamata") || x.Stato.Equals("Sospesa"))),
                listaSquadre = listaSquadre.Result.FindAll(x => x.Squadra.Distaccamento.Codice.Equals(query.CodiceSede) && x.Squadra.Turno.Equals(turnoCorrente)).Select(x => x.Squadra).ToList()
            };

            return new CodaChiamateDettaglioResult()
            {
                infoDistaccamento = dettaglio
            };
        }
    }
}
