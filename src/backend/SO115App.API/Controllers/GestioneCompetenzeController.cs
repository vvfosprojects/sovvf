using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCompetenze;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCountInterventiVicinanze;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneCompetenzeController : ControllerBase
    {
        private readonly IQueryHandler<GetCompetenzeQuery, GetCompetenzeResult> _getCompetenze;
        public GestioneCompetenzeController(IQueryHandler<GetCompetenzeQuery, GetCompetenzeResult> getCompetenze)
        {
            _getCompetenze = getCompetenze;
        }

        [HttpPost("GetCompetenze")]
        public async Task<IActionResult> GetCompetenze([FromBody] Coordinate coordinate)
        {
            try
            {
                var query = new GetCompetenzeQuery()
                {
                    CodiciSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"],

                    Coordinate = coordinate
                };

                return Ok(_getCompetenze.Handle(query));
            }
            catch (Exception ex)
            {
                ex = ex.GetBaseException();

                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }
    }
}
