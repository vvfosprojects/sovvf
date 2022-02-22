using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.ModificaDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia.GetDettagliTipoligiaByIdTipologia;
using System;
using System.Threading.Tasks;

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
        private readonly IQueryHandler<DettaglioTipologiaQuery, DettaglioTipologiaResult> _getListaDettagliTipologia;
        private readonly IQueryHandler<GetDettagliTipoligiaByIdTipologiaQuery, GetDettagliTipoligiaByIdTipologiaResult> _getListaDettagliTipologieByIdTipologia;

        public GestioneDettaglioTipologiaController(ICommandHandler<AddDettaglioTipologiaCommand> Addhandler,
            ICommandHandler<ModifyDettaglioTipologiaCommand> Updatehandler,
            ICommandHandler<DeleteDettaglioTipologiaCommand> Deletehandler,
            IQueryHandler<DettaglioTipologiaQuery, DettaglioTipologiaResult> getListaDettagliTipologia,
            IQueryHandler<GetDettagliTipoligiaByIdTipologiaQuery, GetDettagliTipoligiaByIdTipologiaResult> getListaDettagliTipologieByIdTipologia)
        {
            _addhandler = Addhandler;
            _updatehandler = Updatehandler;
            _deletehandler = Deletehandler;
            _getListaDettagliTipologia = getListaDettagliTipologia;
            _getListaDettagliTipologieByIdTipologia = getListaDettagliTipologieByIdTipologia;
        }

        /// <summary>
        ///   Restituisce la lista dei dettagli tipoogia di un comando
        /// </summary>
        [HttpPost("Get")]
        public async Task<IActionResult> Get([FromBody] DettaglioTipologiaQuery query)
        {
            try
            {
                query.IdOperatore = Request.Headers["IdUtente"];
                query.IdSede = Request.Headers["codicesede"].ToString().Split(',');

                return Ok(_getListaDettagliTipologia.Handle(query));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        /// <summary>
        ///   Restituisce la lista dei dettagli tipoogia di una specifica tipologia
        /// </summary>
        [HttpGet("GetByIdTipologia")]
        public async Task<IActionResult> GetByIdTipologia(int idTipologia)
        {
            try
            {
                var query = new GetDettagliTipoligiaByIdTipologiaQuery()
                {
                    CodiceTipologia = idTipologia,
                    IdSede = Request.Headers["codicesede"].ToString().Split(',')
                };

                return Ok(_getListaDettagliTipologieByIdTipologia.Handle(query));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        /// <summary>
        ///   Aggiunge un dettaglio tipologia associato ad una tipologia
        /// </summary>
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

        /// <summary>
        ///   Cancella un dettaglio tipologia associato ad una tipologia
        /// </summary>
        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody] TipologiaDettaglioDelete Dettaglio)
        {
            try
            {
                var command = new DeleteDettaglioTipologiaCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    CodDettaglioTipologia = Dettaglio.codDettaglio
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

        /// <summary>
        ///   Modifica un dettaglio tipologia associato ad una tipologia
        /// </summary>
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
