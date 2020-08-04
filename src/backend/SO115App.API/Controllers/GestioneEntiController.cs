using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneEntiController : ControllerBase
    {
        private readonly ICommandHandler<AddEnteCommand> _addEnteHandler;
        private readonly ICommandHandler<UpdateEnteCommand> _updateEnteHandler;
        private readonly ICommandHandler<DeleteEnteCommand> _deleteEnteHandler;
        private readonly IQueryHandler<RubricaQuery, RubricaResult> _rubricaQueryHandler;

        public GestioneEntiController(ICommandHandler<AddEnteCommand> addEnte,
            ICommandHandler<UpdateEnteCommand> updateEnte,
            ICommandHandler<DeleteEnteCommand> deleteEnteHandler,
            IQueryHandler<RubricaQuery, RubricaResult> rubricaQueryHandler)
        {
            _updateEnteHandler = updateEnte;
            _addEnteHandler = addEnte;
            _deleteEnteHandler = deleteEnteHandler;
            _rubricaQueryHandler = rubricaQueryHandler;
        }

        [HttpPost("")]
        public async Task<IActionResult> Get([FromBody]RubricaQuery rubricaQuery)
        {
            rubricaQuery.IdOperatore = Request.Headers["IdUtente"];
            rubricaQuery.IdSede = Request.Headers["codicesede"].ToString().Split(',');
            try
            {
                return Ok(_rubricaQueryHandler.Handle(rubricaQuery));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(EnteIntervenuto ente)
        {
            try
            {
                var command = new AddEnteCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    Ente = ente
                };

                _addEnteHandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        [HttpPost("Update")]
        public async Task<IActionResult> Update(EnteIntervenuto ente)
        {
            try
            {
                var command = new UpdateEnteCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    Ente = ente
                };

                _updateEnteHandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        [HttpGet("Delete")]
        public async Task<IActionResult> Delete(string Id)
        {
            try
            {
                var command = new DeleteEnteCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    Id = Id
                };

                _deleteEnteHandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }
    }
}
