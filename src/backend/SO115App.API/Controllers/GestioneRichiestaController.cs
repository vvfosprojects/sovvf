//-----------------------------------------------------------------------
// <copyright file="GestioneRichiestaController.cs" company="CNVVF">
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
using CQRS.Commands;
using CQRS.Queries;
using DomainModel.CQRS.Commands.AllertaAltreSedi;
using DomainModel.CQRS.Commands.HLogBook;
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.RicercaFullText;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Classi.UtilityRichiesta;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCodiciRichiesteAssistenza;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCountInterventiVicinanze;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetInterventiVicinanze;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetSintesiRichiestaAssistenza;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneRichiestaController : ControllerBase
    {
        private readonly ICommandHandler<UpDateStatoRichiestaCommand> _addhandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteQuery;
        private readonly IQueryHandler<GetSintesiRichiestaAssistenzaQuery, GetSintesiRichiestaAssistenzaResult> _getSingolaRichiesta;
        private readonly IQueryHandler<GetCodiciRichiesteAssistenzaQuery, GetCodiciRichiesteAssistenzaResult> _getCodiciRichiesta;
        private readonly IQueryHandler<GetCountInterventiVicinanzeQuery, GetCountInterventiVicinanzeResult> _getCountInterventiVicinanze;
        private readonly IQueryHandler<GetInterventiVicinanzeQuery, GetInterventiVicinanzeResult> _getInterventiVicinanze;
        private readonly ICommandHandler<AllertaAltreSediCommand> _allertaSediHandler;
        private readonly IQueryHandler<RicercaFullTextQuery, RicercaFullTextResult> _ricercaFullTextHandler;
        private readonly ICommandHandler<LogBookCommand> _logBookHandler;

        public GestioneRichiestaController(
            ICommandHandler<UpDateStatoRichiestaCommand> addhandler,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteQuery,
            IQueryHandler<GetSintesiRichiestaAssistenzaQuery, GetSintesiRichiestaAssistenzaResult> getSingolaRichiesta,
            IQueryHandler<GetCodiciRichiesteAssistenzaQuery, GetCodiciRichiesteAssistenzaResult> getCodiciRichiesta,
            IQueryHandler<GetCountInterventiVicinanzeQuery, GetCountInterventiVicinanzeResult> getCountInterventiVicinanze,
            IQueryHandler<GetInterventiVicinanzeQuery, GetInterventiVicinanzeResult> getInterventiVicinanze,
            ICommandHandler<AllertaAltreSediCommand> allertaSediHandler,
            IQueryHandler<RicercaFullTextQuery, RicercaFullTextResult> ricercaFullTextHandler,
            ICommandHandler<LogBookCommand> LogBookHandler
            )
        {
            _addhandler = addhandler;
            _sintesiRichiesteQuery = sintesiRichiesteQuery;
            _getSingolaRichiesta = getSingolaRichiesta;
            _getCodiciRichiesta = getCodiciRichiesta;
            _allertaSediHandler = allertaSediHandler;
            _ricercaFullTextHandler = ricercaFullTextHandler;
            _logBookHandler = LogBookHandler;
            _getCountInterventiVicinanze = getCountInterventiVicinanze;
            _getInterventiVicinanze = getInterventiVicinanze;
        }
    
    
        /// <summary>
        ///   Metodo che restituisce gli Interventi nelle vicinanze
        /// </summary>
        [HttpPost("GetInterventiVicinanze")]
        [ProducesResponseType(typeof(GetInterventiVicinanzeResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetInterventiVicinanze([FromBody] ControlloIndirizzoRichiesta controllo)
        {
            try
            {
                var query = new GetInterventiVicinanzeQuery()
                {
                    CodiciSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"],
                    Coordinate = controllo.Coordinate,
                    Indirizzo = controllo.Indirizzo,
                    Competenze = controllo.Competenze
                };

                return Ok(_getInterventiVicinanze.Handle(query));
            }
            catch (Exception ex)
            {
                ex = ex.GetBaseException();

                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        /// <summary>
        ///   Metodo che restituisce il contatore degli Interventi nelle vicinanze
        /// </summary>
        [HttpPost("GetCountInterventiVicinanze")]
        [ProducesResponseType(typeof(GetCountInterventiVicinanzeResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetCountInterventiVicinanze([FromBody] ControlloIndirizzoRichiesta controllo)
        {
            try
            {
                var query = new GetCountInterventiVicinanzeQuery()
                {
                    CodiciSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"],
                    Coordinate = controllo.Coordinate,
                    Indirizzo = controllo.Indirizzo,
                    Competenze = controllo.Competenze
                };

                return Ok(_getCountInterventiVicinanze.Handle(query));
            }
            catch (Exception ex)
            {
                ex = ex.GetBaseException();

                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        /// <summary>
        ///   Metodo che restituisce una specifica Richiesta di Assistenza
        /// </summary>
        [HttpGet("GetRichiesta")]
        [ProducesResponseType(typeof(SintesiRichiesta), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetRichiesta(string idRichiesta)
        {
            var sintesiQuery = new GetSintesiRichiestaAssistenzaQuery
            {
                CodiceRichiesta = idRichiesta,
                CodiceSede = Request.Headers["codiceSede"]
            };
            try
            {
                return Ok(_getSingolaRichiesta.Handle(sintesiQuery).SintesiRichiesta);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Metodo che restituisce la lista delle Richieste di Assistenza
        /// </summary>
        [HttpGet("GetRichiesteByFullText")]
        [ProducesResponseType(typeof(RicercaFullTextResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetRichiesteByFullText(string TextToSearch)
        {
            var sintesiQuery = new RicercaFullTextQuery
            {
                TextSearch = TextToSearch,
                CodSedi = Request.Headers["codiceSede"].ToString().Split(','),
                IdUtente = Request.Headers["idUtente"]
            };

            try
            {
                return Ok(_ricercaFullTextHandler.Handle(sintesiQuery));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Metodo che restituisce la lista delle Richieste di Assistenza
        /// </summary>
        [HttpPost("GetRichieste")]
        [ProducesResponseType(typeof(GetSintesiRichiestaAssistenzaResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            filtro.idOperatore = Request.Headers["idUtente"];
            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
            {
                CodiciSede = Request.Headers["codiceSede"].ToString().Split(','),
                Filtro = filtro
            };

            try
            {
                return Ok(_sintesiRichiesteQuery.Handle(sintesiRichiesteAssistenzaQuery));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Metodo che restituisce la lista dei codici delle Richieste di Assistenza
        /// </summary>
        [HttpGet("GetCodiciRichieste")]
        [ProducesResponseType(typeof(GetCodiciRichiesteAssistenzaResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetCodiciRichieste(string idRichiesta)
        {
            var sintesiRichiesteAssistenzaQuery = new GetCodiciRichiesteAssistenzaQuery
            {
                CodiciSede = Request.Headers["codiceSede"].ToString().Split(','),
                idRichiesta = idRichiesta
            };

            try
            {
                return Ok(_getCodiciRichiesta.Handle(sintesiRichiesteAssistenzaQuery));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Metodo che permette di aggiornare lo stato di una Richieste di Assistenza
        /// </summary>
        [HttpPost("AggiornaStato")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AggiornaStato([FromBody] UpDateStatoRichiestaCommand richiesta)
        {
            var codiceSede = Request.Headers["codicesede"];
            var headerValues = Request.Headers["IdUtente"];
            var idOperatore = headerValues.FirstOrDefault();

            var command = new UpDateStatoRichiestaCommand()
            {
                IdOperatore = idOperatore,
                IdRichiesta = richiesta.IdRichiesta,
                // Note = richiesta.Note ?? "",
                Stato = richiesta.Stato,
                CodiceSede = codiceSede,
                EntiIntervenuti = richiesta.EntiIntervenuti,
                Motivazione = richiesta.Motivazione
            };

            try
            {
                this._addhandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Metodo che permette di allertare una o più sedi
        /// </summary>
        [HttpPost("AllertaAltreSedi")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AllertaSedi([FromBody] AllertaAltreSediCommand parametri)
        {
            var idOperatore = Request.Headers["IdUtente"];
            parametri.CodUtente = idOperatore;

            try
            {
                this._allertaSediHandler.Handle(parametri);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Metodo che permette di inserire un nuovo elemento nel LogBook
        /// </summary>
        [HttpPost("AddLogBook")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddLogBook([FromBody] LogBookCommand parametri)
        {
            var idOperatore = Request.Headers["IdUtente"];
            parametri.CodUtente = idOperatore;

            try
            {
                this._logBookHandler.Handle(parametri);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }
    }
}
