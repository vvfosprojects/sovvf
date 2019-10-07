using Microsoft.AspNetCore.Mvc;
using SO115App.ApiGac.Models;
using SO115App.ApiGac.Services;
using System;
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
        public ActionResult<List<Mezzo>> GetUtilizzabili([FromQuery]List<string> codiciSedi, string genereMezzo, string siglaMezzo)
        {
            return _getMezzi.GetMezziUtilizzabili(codiciSedi, genereMezzo, siglaMezzo);
        }

        [HttpGet("MezziFuoriServizio")]
        public ActionResult<List<Mezzo>> GetFuoriServizio([FromQuery]List<string> codiciSedi, string genereMezzo, string siglaMezzo)
        {
            return _getMezzi.GetMezziFuoriServizio(codiciSedi, genereMezzo, siglaMezzo);
        }

        [HttpGet("ID")]
        public ActionResult<List<Mezzo>> GetFromID([FromQuery]List<string> codiciMezzo)
        {
            return _getMezzi.GetMezziFromCodiceMezzo(codiciMezzo);
        }

        [HttpGet("ICCID")]
        public ActionResult<List<Mezzo>> GetFromICCID([FromQuery]List<string> iccid)
        {
            return _getMezzi.GetMezziFromICCID(iccid);
        }

        [HttpGet("SELETTIVA")]
        public ActionResult<List<Mezzo>> GetSELETTIVA([FromQuery]List<string> idRadio)
        {
            return _getMezzi.GetMezziFromRadioId(idRadio);
        }

        [HttpPost("Movimentazione")]
        public void Put([FromForm]string codiceMezzo, string idRichiesta, string statoOperativo, string timeStamp)
        {
            var timeStampDT = DateTime.Parse(timeStamp);
            var movimentazione = new Movimentazione
            {
                IdRichiesta = idRichiesta,
                StatoOperativo = statoOperativo,
                DataMovimentazione = timeStampDT
            };
            _setMezzo.SetMovimentazione(codiceMezzo, movimentazione);
        }
    }
}
