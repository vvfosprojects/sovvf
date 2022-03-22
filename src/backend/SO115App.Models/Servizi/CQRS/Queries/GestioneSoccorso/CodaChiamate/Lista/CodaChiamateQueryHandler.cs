//-----------------------------------------------------------------------
// <copyright file="CodaChiamateQueryHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.Turni;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.CodaChiamate
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori della Navbar.
    /// </summary>
    public class CodaChiamateQueryHandler : IQueryHandler<CodaChiamateQuery, CodaChiamateResult>
    {
        private readonly IGetListaSintesi _iGetListaSintesi;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetTurno _getTurno;
        private readonly IGetBoxPersonale _getBoxPersonale;
        private readonly IGetStatoSquadra _getStatoSquadra;

        public CodaChiamateQueryHandler(IGetListaSintesi iGetListaSintesi, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
                                        IGetTurno getTurno, IGetBoxPersonale getBoxPersonale, IGetStatoSquadra getStatoSquadra)
        {
            _iGetListaSintesi = iGetListaSintesi;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getTurno = getTurno;
            _getBoxPersonale = getBoxPersonale;
            _getStatoSquadra = getStatoSquadra;
        }

        /// <summary>
        ///   Query che estrae tutti i parametri iniziali della Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Tutti i parametri iniziali della Home Page</returns>
        public CodaChiamateResult Handle(CodaChiamateQuery query)
        {
            var turnoCorrente = _getTurno.Get().Codice.Substring(0, 1);
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();

            foreach (var sede in query.CodiciSede)
            {
                pinNodi.Add(new PinNodo(sede, true));
            }
            var listaSedi = listaSediAlberate.Result.GetSottoAlbero(pinNodi);
            foreach (var figlio in listaSedi)
            {
                pinNodi.Add(new PinNodo(figlio.Codice, true));
            }

            query.Filtro = new FiltroRicercaRichiesteAssistenza();
            query.Filtro.UnitaOperative = pinNodi.ToHashSet();
            query.Filtro.IncludiRichiesteAperte = true;
            query.Filtro.IncludiRichiesteChiuse = false;

            var listaSintesi = _iGetListaSintesi.GetListaSintesiRichieste(query.Filtro);

            InfoIstogramma info = new InfoIstogramma();
            info.ListaCodaChiamate = new List<Istogramma>();

            var boxPersonale = _getBoxPersonale.Get(listaSedi.Select(s => s.Codice).ToArray());
            var listaAttuale = boxPersonale.workShift.Select(s => s.Attuale).ToList();
            foreach (var unita in listaSedi)
            {
                if (!unita.Nome.Equals("Centro Operativo Nazionale"))
                {
                    var listaSquadre = new List<SquadraOpService>();

                    if (listaAttuale != null)
                        listaSquadre = listaAttuale[0].Squadre.Where(s => s.Distaccamento.Equals(unita.Codice)).ToList();

                    var statoSquadre = _getStatoSquadra.Get(turnoCorrente, new List<string> { unita.Codice });

                    var infoDistaccamento = new Istogramma()
                    {
                        codDistaccamento = unita.Codice,
                        descDistaccamento = /*unita.Codice.Contains("1000") ? "Comando VV.F. " + :*/ unita.Nome,
                        numRichieste = listaSintesi.Count > 0 ? listaSintesi.FindAll(x => x.CodUOCompetenza[0].Equals(unita.Codice) && (x.Stato.Equals("Chiamata") || x.Sospesa)).Count() : 0,
                        squadreLibere = listaSquadre != null ? listaSquadre.Count() - statoSquadre.Count : 0,
                        squadreOccupate = statoSquadre.Count
                    };

                    info.ListaCodaChiamate.Add(infoDistaccamento);
                }
            }

            return new CodaChiamateResult()
            {
                infoIstogramma = info.ListaCodaChiamate.OrderByDescending(x => x.numRichieste).OrderBy(x => x.codDistaccamento).ToList()
            };
        }
    }
}
