using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.DeletePos;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.EditPos;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.InsertPos;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.GetPOSById;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestionePOSController : ControllerBase
    {
        private readonly ICommandHandler<AddPosCommand> _addhandler;
        private readonly IQueryHandler<GetElencoPOSQuery, GetElencoPOSResult> _getHandler;
        private readonly IQueryHandler<GetPOSByIdQuery, GetPOSByIdResult> _getPosByIdHandler;
        private readonly ICommandHandler<DeletePosCommand> _deletehandler;
        private readonly ICommandHandler<EditPosCommand> _edithandler;

        public GestionePOSController(

            ICommandHandler<AddPosCommand> Addhandler,
            IQueryHandler<GetElencoPOSQuery, GetElencoPOSResult> GetHandler,
            IQueryHandler<GetPOSByIdQuery, GetPOSByIdResult> GetPosByIdHandler,
            ICommandHandler<DeletePosCommand> Deletehandler,
            ICommandHandler<EditPosCommand> Edithandler)

        {
            _addhandler = Addhandler;
            _deletehandler = Deletehandler;
            _edithandler = Edithandler;
            _getHandler = GetHandler;
            _getPosByIdHandler = GetPosByIdHandler;
        }

        /// <summary>
        ///   Metodo che permette di inserire una POS
        /// </summary>
        [HttpPost("Add")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Add([FromForm] DtoPos pos)
        {
            //var codiceSede = Request.Headers["codicesede"];

            //pos.CodSede = codiceSede;
            var command = new AddPosCommand()
            {
                Pos = pos
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

        /// <summary>
        ///   Metodo che restituisce la lista delle POS
        /// </summary>
        [HttpPost("")]
        [ProducesResponseType(typeof(GetElencoPOSResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Get([FromBody] GetElencoPOSQuery getListaPosQuery)
        {
            try
            {
                return Ok(_getHandler.Handle(getListaPosQuery));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Metodo che restituisce una specifica POS
        /// </summary>
        [HttpGet("GetPosById")]
        [ProducesResponseType(typeof(MemoryStream), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetPosById(string Id, string CodSede)
        {
            //var codiceSede = Request.Headers["codicesede"];

            var getQuery = new GetPOSByIdQuery()
            {
                CodiceSede = CodSede,
                IdPos = Id
            };

            try
            {
                return File(_getPosByIdHandler.Handle(getQuery).FdFile, "application/pdf");
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Metodo che permette di eliminare una POS
        /// </summary>
        [HttpGet("Delete")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Delete(string Id, string CodSede)
        {
            //var codiceSede = Request.Headers["codicesede"];
            var command = new DeletePosCommand()
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

        /// <summary>
        ///   Metodo che permette di modificare una POS
        /// </summary>
        [HttpPost("Edit")]
        [ProducesResponseType(typeof(object), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Edit([FromForm] DtoPos pos)
        {
            //var codiceSede = Request.Headers["codicesede"];

            //pos.CodSede = codiceSede;
            var command = new EditPosCommand()
            {
                Pos = pos
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
