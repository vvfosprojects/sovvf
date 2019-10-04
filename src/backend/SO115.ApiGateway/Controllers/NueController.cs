using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeoCoordinatePortable;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SO115.ApiGateway.Servizi;
using SO115App.ApiGateway.Classi;

namespace SO115.ApiGateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NueController : ControllerBase
    {
        private readonly NueService _SchedaContattoService;

        public NueController(NueService SchedaContattoService)
        {
            _SchedaContattoService = SchedaContattoService;
        }

        [HttpGet("SchedaContattoAttuale")]
        public Task<SchedaContatto> Get([FromQuery] string codiceSede, string codicePostazioneOperatore)
        {
            return _SchedaContattoService.GetSchedaContattoAttuale(codiceSede, codicePostazioneOperatore);
        }

        [HttpGet("GetByCF")]
        public Task<List<SchedaContatto>> Get([FromQuery] List<string> codiciFiscali)
        {
            return _SchedaContattoService.GetSchedeContattoFromCodiciFiscali(codiciFiscali);
        }

        [HttpGet("GetByArea")]
        public Task<List<SchedaContatto>> Get([FromQuery] double lat1, double lon1, double lat2, double lon2)
        {
            return _SchedaContattoService.GetSchedeContattoBySpatialArea(lat1, lon1, lat2, lon2);
        }

        [HttpGet("GetByText")]
        public Task<List<SchedaContatto>> Get([FromQuery] string text)
        {
            return _SchedaContattoService.GetSchedeContattoFromText(text);
        }

        [HttpGet("GetByTipo")]
        public Task<List<SchedaContatto>> GetByTipo([FromQuery] List<string> tipoScheda)
        {
            return _SchedaContattoService.GetSchedeContattoFromListTipo(tipoScheda);
        }

        [HttpGet("GetByCodiceSede")]
        public Task<List<SchedaContatto>> GetByCodiceSede([FromQuery] string codiceSede)
        {
            return _SchedaContattoService.GetSchedeContattoFromCodiceSede(codiceSede);
        }

        [HttpGet("GetLette")]
        public Task<List<SchedaContatto>> GetLette([FromQuery] bool letta)
        {
            return _SchedaContattoService.GetSchedeContattoLetta(letta);
        }

        [HttpGet("GetGestite")]
        public Task<List<SchedaContatto>> GetGestite([FromQuery] bool gestista)
        {
            return _SchedaContattoService.GetSchedeContattoGestita(gestista);
        }

        [HttpGet("GetByTimeSpan")]
        public Task<List<SchedaContatto>> GetByTipeSpan([FromQuery] DateTime dataDa, DateTime dataA)
        {
            return _SchedaContattoService.GetSchedeContattoTimeSpan(dataDa, dataA);
        }

        [HttpPut("SetLetta")]
        public void PutLetta([FromBody] string codiceScheda, string codiceSede, string codiceFiscale, bool letta)
        {
            _SchedaContattoService.SetLetta(codiceScheda, codiceSede, codiceFiscale, letta);
        }

        [HttpPut("SetGestita")]
        public void PutGestita([FromBody] string codiceScheda, string codiceSede, string codiceFiscale, bool gestita)
        {
            _SchedaContattoService.SetGestita(codiceScheda, codiceSede, codiceFiscale, gestita);
        }
    }
}
