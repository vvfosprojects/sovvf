﻿using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Documentale;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDocumentale.DeleteDoc;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDocumentale.EditDoc;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDocumentale.InsertDoc;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneDocumentale.GetDocById;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneDocumentale.RicercaElencoDoc;

using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneDocumentaleController : ControllerBase
    {
        private readonly ICommandHandler<AddDocCommand> _addhandler;
        private readonly IQueryHandler<GetElencoDocQuery, GetElencoDocResult> _getHandler;
        private readonly IQueryHandler<GetDocByIdQuery, GetDocByIdResult> _getDocByIdHandler;
        private readonly ICommandHandler<DeleteDocCommand> _deletehandler;
        private readonly ICommandHandler<EditDocCommand> _edithandler;

        public GestioneDocumentaleController(

            ICommandHandler<AddDocCommand> Addhandler,
            IQueryHandler<GetElencoDocQuery, GetElencoDocResult> GetHandler,
            IQueryHandler<GetDocByIdQuery, GetDocByIdResult> GetDocByIdHandler,
            ICommandHandler<DeleteDocCommand> Deletehandler,
            ICommandHandler<EditDocCommand> Edithandler)

        {
            _addhandler = Addhandler;
            _deletehandler = Deletehandler;
            _edithandler = Edithandler;
            _getHandler = GetHandler;
            _getDocByIdHandler = GetDocByIdHandler;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromForm] DtoDocumentale doc)
        {
            var command = new AddDocCommand()
            {
                Documento = doc
            };

            try
            {
                _addhandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("")]
        public async Task<IActionResult> Get([FromBody] GetElencoDocQuery getListaDocQuery)
        {
            try
            {
                return Ok(_getHandler.Handle(getListaDocQuery));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetDocumentoById")]
        public async Task<IActionResult> GetDocById(string Id, string CodSede)
        {
            var getQuery = new GetDocByIdQuery()
            {
                CodiceSede = CodSede,
                IdDoc = Id
            };

            try
            {
                return File(_getDocByIdHandler.Handle(getQuery).FdFile, "application/pdf");
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("Delete")]
        public async Task<IActionResult> Delete(string Id, string CodSede)
        {
            var command = new DeleteDocCommand()
            {
                codSede = CodSede,
                Id = Id
            };

            try
            {
                _deletehandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Edit")]
        public async Task<IActionResult> Edit([FromForm] DtoDocumentale doc)
        {
            var command = new EditDocCommand()
            {
                Documento = doc
            };

            try
            {
                _edithandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}