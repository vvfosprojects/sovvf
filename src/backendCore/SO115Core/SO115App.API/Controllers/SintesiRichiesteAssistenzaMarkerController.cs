//-----------------------------------------------------------------------
// <copyright file="SintesiRichiesteAssistenzaController.cs" company="CNVVF">
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
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.CQRS.Queries;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.QueryDTO;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.ResultDTO;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste;

namespace SO115App.API.Controllers
{
    /// <summary>
    ///   Controller per l'accesso alla sintesi sulle richieste di assistenza
    /// </summary>
    public class SintesiRichiesteAssistenzaMarkerController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> handler;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public SintesiRichiesteAssistenzaMarkerController(
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> handler)
        {
            this.handler = handler;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="filtro">Il filtro per le richieste</param>
        /// <returns>Le sintesi delle richieste di assistenza</returns>
        [HttpGet] 
        public SintesiRichiesteAssistenzaMarkerResult Get()
        {

            //var session = HttpContext.Current.Session;
            //if (session != null)
            //{
            //    if (session["JSonRichieste"] == null)
            //    {
            //        //VIENE UTILIZZATO SOLO PER TEST E FAKE INSERT SU MONGO DB

            //        var gi = new GeneratoreRichieste(
            //        "RM",
            //        2,
            //        DateTime.Now.AddHours(-12),
            //        DateTime.Now,
            //        25,
            //        30 * 60,
            //        15 * 60,
            //        45 * 60,
            //        15 * 60,
            //        new float[] { .85F, .7F, .4F, .3F, .1F });

            //        var richieste = gi.Genera()
            //            .OrderBy(r => (r.Eventi.First() as Evento).istante)
            //            .ToList();

            //        session["JSonRichieste"] = richieste;
            //    }
            //}


            var query = new SintesiRichiesteAssistenzaMarkerQuery();
            return this.handler.Handle(query);
        }


        [HttpPost]
        public SintesiRichiesteAssistenzaMarkerResult Post([FromBody]FiltroRicercaRichiesteAssistenza filtro)
        {
            
            var query = new SintesiRichiesteAssistenzaMarkerQuery()
            {
                Filtro = filtro
            };

            return this.handler.Handle(query);
        }


    }
}
