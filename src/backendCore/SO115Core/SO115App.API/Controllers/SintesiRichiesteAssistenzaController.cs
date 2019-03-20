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
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using SimpleInjector;
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

    [Route("api/[controller]")]
    [ApiController]
    public class SintesiRichiesteAssistenzaController : ControllerBase
    {
        private IGeneratoreRichieste _generatore;    

        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> handler;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public SintesiRichiesteAssistenzaController(
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> handler)
        {            
            this.handler = handler;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="filtro">Il filtro per le richieste</param>
        /// <returns>Le sintesi delle richieste di assistenza</returns>
        [HttpGet]     
        public async Task<IActionResult> Get()
        {
            GeneratoreRichieste gen = new GeneratoreRichieste();                  
            _generatore = gen;    
                     
            //VIENE UTILIZZATO SOLO PER TEST E FAKE
            FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza();
            filtro.SearchKey = "0";
            filtro.RichiestaSingola = false;

            var query = new SintesiRichiesteAssistenzaQuery()
            {
                Filtro = filtro
                ,ListaRichieste = _generatore.ListaRichieste.ToList()
            };

            return Ok(this.handler.Handle(query));
        }


        [HttpGet("{searchkey}/{richiestaSingola}")]
        public async Task<IActionResult> Get(string searchkey,string richiestaSingola)
        {
            GeneratoreRichieste gen = new GeneratoreRichieste();                  
            _generatore = gen;    

            FiltroRicercaRichiesteAssistenza filtro = new FiltroRicercaRichiesteAssistenza();
            filtro.SearchKey = searchkey;
            filtro.RichiestaSingola = Convert.ToBoolean(richiestaSingola);

            var query = new SintesiRichiesteAssistenzaQuery()
            {
                Filtro = filtro
            };


            return Ok(this.handler.Handle(query));
        }


        [HttpPost]
        public SintesiRichiesteAssistenzaResult Post(FiltroRicercaRichiesteAssistenza filtro)
        {
            
            var query = new SintesiRichiesteAssistenzaQuery()
            {
                Filtro = filtro
            };

            return this.handler.Handle(query);
        }


    }
}
