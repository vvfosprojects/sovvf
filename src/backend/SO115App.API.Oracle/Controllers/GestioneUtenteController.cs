using SO115App.Persistence.Oracle.Servizi.Personale;
using System.Web.Http;

namespace SO115App.API.Oracle.Controllers
{
    public class GestioneUtenteController : ApiController
    {
        // GET: api/GestioneUtente
        [HttpGet]
        public IHttpActionResult GetPersonale(string text, string codiceSede)
        {
            try
            {
                var getPersonaleVVF = new GetPersonaleVVF();
                return Ok(getPersonaleVVF.GetPersoneVVF(text, codiceSede));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
