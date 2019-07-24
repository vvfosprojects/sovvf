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
        private readonly IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> _addhandler;

        public GestioneMezziInServizioController(
            IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> Addhandler)
        {
            _addhandler = Addhandler;
        }

        [HttpPost("GetListaMezzi")]
        public async Task<IActionResult> GetListaMezzi([FromBody]ListaMezziInServizioQuery filtro)
        {
            var headerValues = Request.Headers["IdUtente"];
            string idUtente = headerValues.FirstOrDefault();

            var query = new ListaMezziInServizioQuery()
            {
                IdSede = filtro.IdSede
            };

            try
            {
                return Ok(this._addhandler.Handle(query));
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
