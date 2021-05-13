using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Pos;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.InsertPos;
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
        //private readonly IQueryHandler<GetTriageQuery, GetTriageResult> _getHandler;

        public GestionePOSController(
            ICommandHandler<AddPosCommand> Addhandler) //IQueryHandler<GetTriageQuery, GetTriageResult> GetHandler)
        {
            _addhandler = Addhandler;
            //_getHandler = GetHandler;
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

        //[HttpPost("Get")]
        //public async Task<IActionResult> Get([FromBody] GetTriageQuery getTriageQuery)
        //{
        //    var codiceSede = Request.Headers["codicesede"];

        //    getTriageQuery.CodiceSede = codiceSede;

        //    try
        //    {
        //        return Ok(_getHandler.Handle(getTriageQuery));
        //    }
        //    catch (Exception ex)
        //    {
        //        if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
        //            return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
        //        return BadRequest(new { message = ex.Message });
        //    }
        //}
    }
}
