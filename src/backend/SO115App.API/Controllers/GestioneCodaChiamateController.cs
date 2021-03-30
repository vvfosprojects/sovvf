using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.CodaChiamate;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCompetenze;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneCodaChiamateController : ControllerBase
    {
        private readonly IQueryHandler<CodaChiamateQuery, CodaChiamateResult> _getCodaChiamate;

        public GestioneCodaChiamateController(IQueryHandler<CodaChiamateQuery, CodaChiamateResult> getCodaChiamate)
        {
            _getCodaChiamate = getCodaChiamate;
        }

        [HttpGet("GetInfoIstogramma")]
        public async Task<IActionResult> GetInfoIstogramma()
        {
            try
            {
                var query = new CodaChiamateQuery()
                {
                    CodiciSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)
                };

                return Ok(_getCodaChiamate.Handle(query));
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
