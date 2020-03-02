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

        [HttpGet]
        public IHttpActionResult GetPersonaleByCF(string codiceFiscale, string codiceSede)
        {
            try
            {
                var getPersonaleByCF = new GetPersonaleByCF();
                return Ok(getPersonaleByCF.GetByCF(codiceSede, codiceFiscale));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IHttpActionResult GetPersonaleByCodSede(string codiceSede)
        {
            try
            {
                var getPersonaleByCodSede = new GetPersonaleByCodSede();
                return Ok(getPersonaleByCodSede.GetByCodSede(codiceSede));
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
