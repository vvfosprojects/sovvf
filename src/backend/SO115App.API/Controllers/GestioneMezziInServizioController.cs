using System.Linq;
using System.Threading.Tasks;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneMezziInServizioController : ControllerBase
    {
        private readonly IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> _addHandler;

        public GestioneMezziInServizioController(
            IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> addHandler)
        {
            _addHandler = addHandler;
        }

        [HttpGet("GetListaMezzi")]
        public async Task<IActionResult> GetListaMezzi()
        {
            var headerValues = Request.Headers["IdUtente"];
            var codiceSede = Request.Headers["CodiceSede"];

            var query = new ListaMezziInServizioQuery()
            {
                IdSede = codiceSede
            };

            try
            {
                return Ok(this._addHandler.Handle(query));
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
