﻿using System;
using System.Threading.Tasks;
using CQRS.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.ModificaDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneDettaglioTipologiaController : ControllerBase
    {
        private readonly ICommandHandler<AddDettaglioTipologiaCommand> _addhandler;
        private readonly ICommandHandler<ModifyDettaglioTipologiaCommand> _updatehandler;
        private readonly ICommandHandler<DeleteDettaglioTipologiaCommand> _deletehandler;
        private readonly IGetListaDettaglioTipologia _getListaDettagliTipologia;

        public GestioneDettaglioTipologiaController(ICommandHandler<AddDettaglioTipologiaCommand> Addhandler,
            ICommandHandler<ModifyDettaglioTipologiaCommand> Updatehandler,
            ICommandHandler<DeleteDettaglioTipologiaCommand> Deletehandler,
            IGetListaDettaglioTipologia getListaDettagliTipologia)
        {
            _addhandler = Addhandler;
            _updatehandler = Updatehandler;
            _deletehandler = Deletehandler;
            _getListaDettagliTipologia = getListaDettagliTipologia;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromBody] DettaglioTipologiaQuery query)
        {
            try
            {
                query.IdOperatore = Request.Headers["IdUtente"];
                query.IdSede = Request.Headers["codicesede"].ToString().Split(',');

                return Ok(_getListaDettagliTipologia.Get(query));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(TipologiaDettaglio dettaglio)
        {
            try
            {
                var command = new AddDettaglioTipologiaCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    DettaglioTipologia = dettaglio
                };

                _addhandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> Delete(int CodDettaglio)
        {
            try
            {
                var command = new DeleteDettaglioTipologiaCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    CodDettaglioTipologia = CodDettaglio
                };

                _deletehandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        [HttpPost("Modify")]
        public async Task<IActionResult> Modify(TipologiaDettaglio dettaglio)
        {
            try
            {
                var command = new ModifyDettaglioTipologiaCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    DettaglioTipologia = dettaglio
                };

                _updatehandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }
    }
}
