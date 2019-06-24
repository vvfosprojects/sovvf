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
using CQRS.Queries;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizionePartenzaAvanzata
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class ComposizionePartenzaAvanzataQueryHandler : IQueryHandler<ComposizionePartenzaAvanzataQuery, ComposizionePartenzaAvanzataResult>
    {
        private readonly IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> _ComposizioneMezzihandler;
        private readonly IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> _ComposizioneSquadrehandler;

        public ComposizionePartenzaAvanzataQueryHandler(IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult> ComposizioneMezzihandler,
            IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult> ComposizioneSquadrehandler
            )
        {
            this._ComposizioneMezzihandler = ComposizioneMezzihandler;
            this._ComposizioneSquadrehandler = ComposizioneSquadrehandler;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public ComposizionePartenzaAvanzataResult Handle(ComposizionePartenzaAvanzataQuery query)
        {
            var ComposizioneMezziquery = new ComposizioneMezziQuery
            {
                Filtro = query.Filtro
            };
            var ComposizioneSquadrequery = new ComposizioneSquadreQuery
            {
                Filtro = query.Filtro
            };

            var composizioneAvanzata = new Classi.Composizione.ComposizionePartenzaAvanzata()
            {
                ComposizioneMezzi = this._ComposizioneMezzihandler.Handle(ComposizioneMezziquery).ComposizioneMezzi,
                ComposizioneSquadre = this._ComposizioneSquadrehandler.Handle(ComposizioneSquadrequery).ComposizioneSquadre,

            };

            return new ComposizionePartenzaAvanzataResult()
            {
                ComposizionePartenzaAvanzata = composizioneAvanzata
            };
        }

       
    }
}
