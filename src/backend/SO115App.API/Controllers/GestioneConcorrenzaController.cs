﻿using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneConcorrenza;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.AddBlock;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteAllBlocks;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteBlock;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneConcorrenzaController : ControllerBase
    {
        private readonly IQueryHandler<GetAllBlocksQuery, GetAllBlocksResult> _getAll;
        private readonly ICommandHandler<AddBlockCommand> _addhandler;
        private readonly ICommandHandler<DeleteAllBlocksCommand> _deleteAllBlocksHandler;
        private readonly ICommandHandler<DeleteBlockCommand> _deleteBlockHandler;

        public GestioneConcorrenzaController(IQueryHandler<GetAllBlocksQuery, GetAllBlocksResult> getAll,
                                             ICommandHandler<AddBlockCommand> Addhandler,
                                             ICommandHandler<DeleteAllBlocksCommand> DeleteAllBlocksHandler,
                                             ICommandHandler<DeleteBlockCommand> DeleteBlockHandler)
        {
            _getAll = getAll;
            _addhandler = Addhandler;
            _deleteAllBlocksHandler = DeleteAllBlocksHandler;
            _deleteBlockHandler = DeleteBlockHandler;
        }

        [HttpGet("GetAll")]
        [ProducesResponseType(typeof(GetAllBlocksResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var query = new GetAllBlocksQuery()
                {
                    CodiciSede = new string[1] { Request.Headers["codiceSede"] }
                };

                return Ok(_getAll.Handle(query));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Add")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Add([FromBody] List<Concorrenza> ListaConcorrenze)
        {
            try
            {
                foreach (var c in ListaConcorrenze)
                {
                    c.IdOperatore = Request.Headers["idUtente"];
                    c.CodComando = Request.Headers["codiceSede"];
                }
                var command = new AddBlockCommand()
                {
                    CodComando = Request.Headers["codiceSede"],
                    concorrenza = ListaConcorrenze
                };

                _addhandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Delete")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Delete([FromBody] List<Concorrenza> ListaConcorrenze)
        {
            try
            {
                var command = new DeleteBlockCommand()
                {
                    ListaIdConcorrenza = ListaConcorrenze.Select(c => c.Id).ToList(),
                    CodiceSede = Request.Headers["codiceSede"],
                };

                _deleteBlockHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("DeleteAll")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> DeleteAll()
        {
            try
            {
                var command = new DeleteAllBlocksCommand()
                {
                    IdOperatore = Request.Headers["idUtente"],
                    CodiceSede = Request.Headers["codiceSede"]
                };

                _deleteAllBlocksHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))

                    return StatusCode(403, new
                    {
                        message = Costanti.UtenteNonAutorizzato
                    });

                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
