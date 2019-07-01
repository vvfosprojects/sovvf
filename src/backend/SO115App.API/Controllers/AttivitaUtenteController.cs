using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Soccorso;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttivitaUtenteController : ControllerBase
    {
        [HttpPost("AddInLavorazione")]
        public async Task<IActionResult> AddInLavorazione([FromBody]AttivitaUtente azione)
        {
            //var command = new AddInLavorazioneCommand()
            //{
            //    AddInLavorazione = azione
            //};

            try
            {
                //this._Addhandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("DeleteInLavorazione")]
        public async Task<IActionResult> DeleteInLavorazione([FromBody]AttivitaUtente azione)
        {
            //var command = new DeleteInLavorazioneCommand()
            //{
            //    DeleteInLavorazione = azione
            //};

            try
            {
                //this._Addhandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("AddPresaInCarico")]
        public async Task<IActionResult> AddPresaInCarico([FromBody]AttivitaUtente azione)
        {
            //var command = new AddPresaInCaricoCommand()
            //{
            //    AddPresaInCarico = azione
            //};

            try
            {
                //this._Addhandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("DeletePresaInCarico")]
        public async Task<IActionResult> DeletePresaInCarico([FromBody]AttivitaUtente azione)
        {
            //var command = new DeletePresaInCaricoCommand()
            //{
            //    DeletePresaInCarico = azione
            //};

            try
            {
                //this._Addhandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
