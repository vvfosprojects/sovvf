using Microsoft.AspNetCore.Mvc;
using SO115App.ApiGac.Models;
using SO115App.ApiGac.Services;
using System.Collections.Generic;

namespace SO115App.ApiGac.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnagraficaMezziController : ControllerBase
    {
        private readonly GetMezzi _getMezzi;
        private readonly SetMezzo _setMezzo;

        public AnagraficaMezziController(GetMezzi getMezzi, SetMezzo setMezzo)
        {
            _getMezzi = getMezzi;
            _setMezzo = setMezzo;
        }

        [HttpGet("MezziUtilizzabili")]
        public ActionResult<List<Mezzo>> GetUtilizzabili([FromForm]List<Sede> sedi, string genereMezzo, string siglaMezzo)
        {
            return _getMezzi.GetMezziUtilizzabili(sedi, genereMezzo, siglaMezzo);
        }

        [HttpGet("MezziFuoriServizio")]
        public ActionResult<List<Mezzo>> GetFuoriServizio([FromForm]List<Sede> sedi, string genereMezzo, string siglaMezzo)
        {
            return _getMezzi.GetMezziFuoriServizio(sedi, genereMezzo, siglaMezzo);
        }

        [HttpGet("ID")]
        public ActionResult<List<Mezzo>> GetFromID([FromQuery]List<string> codiceMezzo)
        {
            return _getMezzi.GetMezziFromCodiceMezzo(codiceMezzo);
        }

        [HttpGet("ICCID")]
        public ActionResult<List<Mezzo>> GetFromICCID([FromForm]List<string> iccid)
        {
            return _getMezzi.GetMezziFromICCID(iccid);
        }

        [HttpGet("SELETTIVA")]
        public ActionResult<List<Mezzo>> GetSELETTIVA([FromForm]List<string> idRadio)
        {
            return _getMezzi.GetMezziFromRadioId(idRadio);
        }

        [HttpPut("Movimentazione")]
        public void Put([FromForm]string codiceMezzo, Movimentazione movimentazione)
        {
            _setMezzo.SetMovimentazione(codiceMezzo, movimentazione);
        }
    }
}
