//-----------------------------------------------------------------------
// <copyright file="ComposizioneSquadreQueryHandler.cs" company="CNVVF">
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
using System.Threading.Tasks;
using CQRS.Queries;
using Serilog;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Classi.Composizione;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizionePartenzaAvanzata
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class ComposizionePartenzaAvanzataQueryHandler : IQueryHandler<ComposizionePartenzaAvanzataQuery, ComposizionePartenzaAvanzataResult>
    {
        private readonly IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> _composizioneMezzihandler;
        private readonly IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> _composizioneSquadrehandler;

        public ComposizionePartenzaAvanzataQueryHandler(IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> composizioneMezzihandler,
            IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> composizioneSquadrehandler
            )
        {
            this._composizioneMezzihandler = composizioneMezzihandler;
            this._composizioneSquadrehandler = composizioneSquadrehandler;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public ComposizionePartenzaAvanzataResult Handle(ComposizionePartenzaAvanzataQuery query)
        {
            Log.Debug("Inizio elaborazione Composizione partenza avanzata Handler");

            var composizioneMezziquery = new ComposizioneMezziQuery
            {
                Filtro = query.Filtro,
                CodiceSede = query.CodiceSede
            };

            var composizioneSquadreQuery = new ComposizioneSquadreQuery
            {
                Filtro = query.Filtro,
                CodiceSede = query.CodiceSede
            };

            Task<List<Classi.Composizione.ComposizioneMezzi>> mezziTask = Task.Factory.StartNew(() => this._composizioneMezzihandler.Handle(composizioneMezziquery).ComposizioneMezzi);
            Task<List<Classi.Composizione.ComposizioneSquadre>> squadreTask = Task.Factory.StartNew(() => this._composizioneSquadrehandler.Handle(composizioneSquadreQuery).ComposizioneSquadre);

            var composizioneAvanzata = new Classi.Composizione.ComposizionePartenzaAvanzata()
            {
                ComposizioneMezzi = mezziTask.Result,
                ComposizioneSquadre = squadreTask.Result,
            };

            Log.Debug("Fine elaborazione Composizione partenza avanzata Handler");

            return new ComposizionePartenzaAvanzataResult()
            {
                ComposizionePartenzaAvanzata = composizioneAvanzata
            };
        }
    }
}
