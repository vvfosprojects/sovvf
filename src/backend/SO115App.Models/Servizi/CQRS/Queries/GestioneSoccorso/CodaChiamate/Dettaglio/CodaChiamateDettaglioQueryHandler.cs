﻿//-----------------------------------------------------------------------
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
using Serilog;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static SO115App.API.Models.Classi.Condivise.Squadra;

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

        public CodaChiamateDettaglioQueryHandler(IGetListaSintesi iGetListaSintesi, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
                                        IGetComposizioneSquadre iGetComposizioneSquadre)
        {
            _iGetListaSintesi = iGetListaSintesi;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _iGetComposizioneSquadre = iGetComposizioneSquadre;
        }

        /// <summary>
        ///   Query che estrae tutti i parametri iniziali della Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Tutti i parametri iniziali della Home Page</returns>
        public CodaChiamateDettaglioResult Handle(CodaChiamateDettaglioQuery query)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();

            pinNodi.Add(new PinNodo(query.CodiceSede, false));

            var listaSedi = listaSediAlberate.GetSottoAlbero(pinNodi);
            foreach (var figlio in listaSedi)
            {
                pinNodi.Add(new PinNodo(figlio.Codice, false));
            }

            query.Filtro = new FiltroRicercaRichiesteAssistenza();
            query.Filtro.UnitaOperative = pinNodi.ToHashSet();
            query.Filtro.IncludiRichiesteAperte = true;
            query.Filtro.IncludiRichiesteChiuse = false;

            var listaSintesi = _iGetListaSintesi.GetListaSintesiRichieste(query.Filtro);

            InfoIstogramma info = new InfoIstogramma();
            info.ListaCodaChiamate = new List<Istogramma>();

            ComposizioneSquadreQuery composizioneSquadreQuery = new ComposizioneSquadreQuery()
            {
                CodiceSede = query.CodiceSede
            };

            var listaSquadre = _iGetComposizioneSquadre.Get(composizioneSquadreQuery);

            DettaglioDistaccamento dettaglio = new DettaglioDistaccamento()
            {
                codDistaccamento = listaSedi.First().Codice,
                descDistaccamento = listaSedi.First().Nome,
                listaSintesi = listaSintesi != null ? listaSintesi.FindAll(x => x.CodSOCompetente.Equals(listaSedi.First().Codice) && (x.Stato.Equals("Chiamata") || x.Stato.Equals("Sospesa"))) : null,
                listaSquadre = listaSquadre.Select(x => x.Squadra).ToList()
            };

            return new CodaChiamateDettaglioResult()
            {
                infoDistaccamento = dettaglio
            };
        }
    }
}