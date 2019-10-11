using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GeoCoordinatePortable;
using Microsoft.AspNetCore.Mvc;
using SO115App.ApiNUE.Model;
using SO115App.ApiNUE.Services;

namespace SO115App.ApiNUE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedaContattoController : ControllerBase
    {
        private readonly GetSchedaContatto _getSchedaContatto;
        private readonly SetSchedaContatto _setSchedaContatto;

        public SchedaContattoController(GetSchedaContatto getSchedaContatto, SetSchedaContatto setSchedaContatto)
        {
            _getSchedaContatto = getSchedaContatto;
            _setSchedaContatto = setSchedaContatto;
        }

        [HttpGet("SchedaContattoAttuale")]
        public ActionResult<SchedaContatto> Get([FromQuery] string codiceSede, string codicePostazioneOperatore)
        {
            return _getSchedaContatto.GetSchedaContattoAttuale(codiceSede, codicePostazioneOperatore);
        }

        [HttpGet("GetByCF")]
        public ActionResult<List<SchedaContatto>> Get([FromQuery] List<string> codiciFiscali)
        {
            return _getSchedaContatto.GetSchedeContattoFromCodiciFiscali(codiciFiscali);
        }

        [HttpGet("GetByArea")]
        public ActionResult<List<SchedaContatto>> Get([FromQuery] double lat1, double lon1, double lat2, double lon2)
        {
            var topRight = new GeoCoordinate
            {
                Latitude = lat1,
                Longitude = lon1
            };
            var bottomLeft = new GeoCoordinate
            {
                Latitude = lat2,
                Longitude = lon2
            };
            return _getSchedaContatto.GetSchedeContattoBySpatialArea(topRight, bottomLeft);
        }

        [HttpGet("GetByText")]
        public ActionResult<List<SchedaContatto>> Get([FromQuery] string text)
        {
            return _getSchedaContatto.GetSchedeContattoFromText(text);
        }

        [HttpGet("GetByTipo")]
        public ActionResult<List<SchedaContatto>> GetByTipo([FromQuery] List<string> tipoScheda)
        {
            return _getSchedaContatto.GetSchedeContattoFromListTipo(tipoScheda);
        }

        [HttpGet("GetByCodiceSede")]
        public ActionResult<List<SchedaContatto>> GetByCodiceSede([FromQuery] string codiceSede)
        {
            return _getSchedaContatto.GetSchedeContattoFromCodiceSede(codiceSede);
        }

        [HttpGet("GetLette")]
        public ActionResult<List<SchedaContatto>> GetLette([FromQuery] bool letta)
        {
            return _getSchedaContatto.GetSchedeContattoLetta(letta);
        }

        [HttpGet("GetGestite")]
        public ActionResult<List<SchedaContatto>> GetGestite([FromQuery] bool gestita)
        {
            return _getSchedaContatto.GetSchedeContattoGestita(gestita);
        }

        [HttpGet("GetByTimeSpan")]
        public ActionResult<List<SchedaContatto>> GetByTipeSpan([FromQuery] DateTime dataDa, DateTime dataA)
        {
            return _getSchedaContatto.GetSchedeContattoTimeSpan(dataDa, dataA);
        }

        [HttpPut("SetLetta")]
        public void PutLetta([FromBody] string codiceScheda, string codiceSede, string codiceFiscale, bool letta)
        {
            _setSchedaContatto.SetLetta(codiceScheda, codiceSede, codiceFiscale, letta);
        }

        [HttpPut("SetGestita")]
        public void PutGestita([FromBody] string codiceScheda, string codiceSede, string codiceFiscale, bool gestita)
        {
            _setSchedaContatto.SetGestita(codiceScheda, codiceSede, codiceFiscale, gestita);
        }
    }
}
