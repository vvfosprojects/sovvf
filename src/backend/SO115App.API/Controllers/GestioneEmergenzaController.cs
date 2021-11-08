using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.AnnullaEmergenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.InsertEmergenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.UpdateEmergenza;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetEmergenzaById;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetListaEmergenzeByCodComando;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetTipologieEmergenza;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneEmergenzaController : ControllerBase
    {
        private readonly ICommandHandler<InsertEmergenzaCommand> _insertHandler;
        private readonly ICommandHandler<UpdateEmergenzaCommand> _updateHandler;
        private readonly ICommandHandler<AnnullaEmergenzaCommand> _annullaHandler;
        private readonly IQueryHandler<GetTipologieEmergenzaQuery, GetTipologieEmergenzaResult> _getTipologieHandler;
        private readonly IQueryHandler<GetEmergenzaByIdQuery, GetEmergenzaByIdResult> _getEmergenzaByIdHandler;
        private readonly IQueryHandler<GetListaEmergenzeByCodComandoQuery, GetListaEmergenzeByCodComandoResult> _getListaEmergenzeByCodComandoHandler;

        public GestioneEmergenzaController(ICommandHandler<InsertEmergenzaCommand> InsertHandler,
                                           ICommandHandler<UpdateEmergenzaCommand> UpdateHandler,
                                           ICommandHandler<AnnullaEmergenzaCommand> AnnullaHandler,
                                           IQueryHandler<GetTipologieEmergenzaQuery, GetTipologieEmergenzaResult> GetTipologieHandler,
                                           IQueryHandler<GetEmergenzaByIdQuery, GetEmergenzaByIdResult> GetEmergenzaByIdHandler,
                                           IQueryHandler<GetListaEmergenzeByCodComandoQuery, GetListaEmergenzeByCodComandoResult> GetListaEmergenzeByCodComandoHandler)
        {
            _insertHandler = InsertHandler;
            _updateHandler = UpdateHandler;
            _annullaHandler = AnnullaHandler;
            _getTipologieHandler = GetTipologieHandler;
            _getEmergenzaByIdHandler = GetEmergenzaByIdHandler;
            _getListaEmergenzeByCodComandoHandler = GetListaEmergenzeByCodComandoHandler;
        }

        [HttpPost("InsertEmergenza")]
        public async Task<IActionResult> InsertEmergenza([FromBody] Emergenza emergenza)
        {
            emergenza.CodComandoRichiedente = Request.Headers["codicesede"].ToString().Split(',')[0];

            var command = new InsertEmergenzaCommand()
            {
                CodOperatore = Request.Headers["IdUtente"].ToString(),
                InfoEmergenza = emergenza
            };

            try
            {
                _insertHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("UpDateEmergenza")]
        public async Task<IActionResult> UpDateEmergenza([FromBody] Emergenza emergenza)
        {
            emergenza.CodComandoRichiedente = Request.Headers["codicesede"].ToString().Split(',')[0];

            var command = new UpdateEmergenzaCommand()
            {
                CodOperatore = Request.Headers["IdUtente"].ToString(),
                InfoEmergenza = emergenza
            };

            try
            {
                _updateHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("AnnullaEmergenza")]
        public async Task<IActionResult> AnnullaEmergenza([FromBody] AnnullaEmergenzaCommand command)
        {
            command.CodOperatore = Request.Headers["IdUtente"].ToString();
            command.CodSede = Request.Headers["codicesede"].ToString().Split(',')[0];
            try
            {
                _annullaHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetTipologieEmergenza")]
        public async Task<IActionResult> GetTipologieEmergenza()
        {
            try
            {
                var query = new GetTipologieEmergenzaQuery()
                {
                    IdSede = Request.Headers["codicesede"].ToString().Split(',')[0]
                };

                return Ok(_getTipologieHandler.Handle(query));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("GetEmergenzaById")]
        public async Task<IActionResult> GetEmergenzaById(string Id)
        {
            try
            {
                var query = new GetEmergenzaByIdQuery()
                {
                    IdSede = Request.Headers["codicesede"].ToString().Split(',')[0],
                    IdEmergenza = Id
                };

                return Ok(_getEmergenzaByIdHandler.Handle(query));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("GetListaEmergenzeByCodSede")]
        public async Task<IActionResult> GetListaEmergenzeByCodSede(GetListaEmergenzeByCodComandoQuery query)
        {
            try
            {
                query.IdSede = Request.Headers["codicesede"].ToString().Split(',');
                query.IdOperatore = Request.Headers["IdUtente"].ToString();

                return Ok(_getListaEmergenzeByCodComandoHandler.Handle(query));
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
