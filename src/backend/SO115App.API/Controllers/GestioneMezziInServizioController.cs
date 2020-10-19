using System;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneMezziInServizioController : ControllerBase
    {
        private readonly IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> _addHandler;

        public GestioneMezziInServizioController(IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> addHandler)
        {
            _addHandler = addHandler;
        }

        [HttpPost("GetListaMezzi")]
        public async Task<IActionResult> GetListaMezzi([FromBody] ListaMezziInServizioQuery query)
        {
            query.IdOperatore = Request.Headers["IdUtente"].ToString();
            query.CodiciSede = Request.Headers["CodiceSede"].ToString().Split(',');

            try
            {
                return Ok(_addHandler.Handle(query));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains("404"))
                    return StatusCode(404, new { message = "Servizio non raggiungibile. Riprovare più tardi" });
                else
                    return BadRequest(new { ex.Message });
            }
        }
    }
}
