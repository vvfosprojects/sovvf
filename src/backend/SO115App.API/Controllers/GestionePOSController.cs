using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.DeletePos;
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

        public GestionePOSController(

            ICommandHandler<AddPosCommand> Addhandler,
            IQueryHandler<GetElencoPOSQuery, GetElencoPOSResult> GetHandler,
            IQueryHandler<GetPOSByIdQuery, GetPOSByIdResult> GetPosByIdHandler,
            ICommandHandler<DeletePosCommand> Deletehandler)

        {
            _addhandler = Addhandler;
            _deletehandler = Deletehandler;
            _getHandler = GetHandler;
            _getPosByIdHandler = GetPosByIdHandler;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromForm] DtoPos pos)
        {
            var codiceSede = Request.Headers["codicesede"];

            pos.CodSede = codiceSede;
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

        [HttpPost("")]
        public async Task<IActionResult> Get([FromBody] GetElencoPOSQuery getListaPosQuery)
        {
            var codiceSede = Request.Headers["codicesede"];

            getListaPosQuery.CodiceSede = codiceSede;

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

        [HttpGet("GetPosById")]
        public async Task<IActionResult> GetPosById(string Id)
        {
            var codiceSede = Request.Headers["codicesede"];

            var getQuery = new GetPOSByIdQuery()
            {
                CodiceSede = codiceSede,
                IdPos = Id
            };

            try
            {
                return Ok(_getPosByIdHandler.Handle(getQuery));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("Delete")]
        public async Task<IActionResult> Delete(string IdPos)
        {
            var command = new DeletePosCommand()
            {
                Id = IdPos
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
    }
}
