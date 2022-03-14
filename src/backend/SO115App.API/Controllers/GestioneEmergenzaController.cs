using CQRS.Authorization;
using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.Allerta;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.AnnullaEmergenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.CreazioneCra;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.InsertEmergenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.Richiesta;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.RichiestaCreazioneCRA;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.RichiestaGestita;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.UpdateEmergenza;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetEmergenzaById;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetListaEmergenzeByCodComando;
using SO115App.Models.Servizi.CQRS.Queries.GestioneEmergenza.GetTipologieEmergenza;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneEmergenzaController : ControllerBase
    {
        private readonly ICommandHandler<InsertEmergenzaCommand> _insertHandler;
        private readonly ICommandHandler<UpdateEmergenzaCommand> _updateHandler;
        private readonly ICommandHandler<AnnullaEmergenzaCommand> _annullaHandler;
        private readonly IQueryHandler<GetTipologieEmergenzaQuery, GetTipologieEmergenzaResult> _getTipologieHandler;
        private readonly IQueryHandler<GetEmergenzaByIdQuery, GetEmergenzaByIdResult> _getEmergenzaByIdHandler;
        private readonly IQueryHandler<GetListaEmergenzeByCodComandoQuery, GetListaEmergenzeByCodComandoResult> _getListaEmergenzeByCodComandoHandler;
        private readonly ICommandHandler<AllertaCommand> _allertaHandler;
        private readonly ICommandHandler<RichiestaCommand> _richiestaHandler;
        private readonly ICommandHandler<RichiestaGestitaCommand> _richiestaGestitaHandler;
        private readonly ICommandHandler<RichiestaCreazioneCRACommand> _richiestaCreazioneCraHandler;
        private readonly ICommandHandler<CreazioneCraCommand> _creazioneCraHandler;

        public GestioneEmergenzaController(ICommandHandler<InsertEmergenzaCommand> InsertHandler,
                                           ICommandHandler<UpdateEmergenzaCommand> UpdateHandler,
                                           ICommandHandler<AnnullaEmergenzaCommand> AnnullaHandler,
                                           IQueryHandler<GetTipologieEmergenzaQuery, GetTipologieEmergenzaResult> GetTipologieHandler,
                                           IQueryHandler<GetEmergenzaByIdQuery, GetEmergenzaByIdResult> GetEmergenzaByIdHandler,
                                           IQueryHandler<GetListaEmergenzeByCodComandoQuery, GetListaEmergenzeByCodComandoResult> GetListaEmergenzeByCodComandoHandler,
                                           ICommandHandler<AllertaCommand> AllertaHandler,
                                           ICommandHandler<RichiestaCommand> richiestaHandler,
                                           ICommandHandler<RichiestaGestitaCommand> richiestaGestitaHandler,
                                           ICommandHandler<RichiestaCreazioneCRACommand> richiestaCreazioneCraHandler,
                                           ICommandHandler<CreazioneCraCommand> creazioneCraHandler)
        {
            _insertHandler = InsertHandler;
            _updateHandler = UpdateHandler;
            _annullaHandler = AnnullaHandler;
            _getTipologieHandler = GetTipologieHandler;
            _getEmergenzaByIdHandler = GetEmergenzaByIdHandler;
            _getListaEmergenzeByCodComandoHandler = GetListaEmergenzeByCodComandoHandler;
            _allertaHandler = AllertaHandler;
            _richiestaHandler = richiestaHandler;
            _richiestaGestitaHandler = richiestaGestitaHandler;
            _richiestaCreazioneCraHandler = richiestaCreazioneCraHandler;
            _creazioneCraHandler = creazioneCraHandler;
        }

        /// <summary>
        ///   Aggiunge una nuova emergenza
        /// </summary>
        [HttpPost("InsertEmergenza")]
        public async Task<IActionResult> InsertEmergenza([FromBody] Emergenza emergenza)
        {
            emergenza.CodComandoRichiedente = Request.Headers["codicesede"].ToString().Split(',')[0];

            var command = new InsertEmergenzaCommand()
            {
                CodOperatore = Request.Headers["IdUtente"].ToString(),
                InfoEmergenza = emergenza
            };

            try
            {
                _insertHandler.Handle(command);
                return Ok(command.InfoEmergenza);
            }
            catch (Exception ex)
            {
                Log.Error("Errore InsertEmergenza: {0}", ex.Message);
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Aggiorna un'emergenza
        /// </summary>
        [HttpPost("UpDateEmergenza")]
        public async Task<IActionResult> UpDateEmergenza([FromBody] EmergenzaDTO emergenza)
        {
            var command = new UpdateEmergenzaCommand()
            {
                CodOperatore = Request.Headers["IdUtente"].ToString(),
                CodSede = Request.Headers["codicesede"].ToString().Split(',')[0],
                InfoEmergenza = emergenza
            };

            try
            {
                _updateHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Log.Error("Errore UpDateEmergenza: {0}", ex.Message);
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Crea un nuovo CRA e la sua almeratura (DOA e PCA)
        /// </summary>
        [HttpPost("CreazioneCra")]
        public async Task<IActionResult> CreazioneCra([FromBody] CreazioneCraDTO dto)
        {
            var command = new CreazioneCraCommand()
            {
                CodOperatore = Request.Headers["IdUtente"].ToString(),
                CodSede = Request.Headers["codicesede"].ToString().Split(',')[0],
                Cra = dto.Cra,
                IdEmergenza = dto.IdEmergenza,
                istanteRichiestaCra = dto.istanteRichiestaCra
            };

            try
            {
                _creazioneCraHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Log.Error("Errore UpDateEmergenza: {0}", ex.Message);
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Annulla un'emergenza precedentemente creata
        /// </summary>
        [HttpPost("AnnullaEmergenza")]
        public async Task<IActionResult> AnnullaEmergenza([FromBody] AnnullaEmergenzaCommand command)
        {
            command.CodOperatore = Request.Headers["IdUtente"].ToString();
            command.CodSede = Request.Headers["codicesede"].ToString().Split(',')[0];
            try
            {
                _annullaHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Log.Error("Errore AnnullaEmergenza: {0}", ex.Message);
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Invia un'allerta emergenza alla dirigenza di riferimento e al con
        /// </summary>
        [HttpPost("AllertaEmergenza")]
        public async Task<IActionResult> AllertaEmergenza([FromBody] AllertaCommand command)
        {
            command.CodOperatore = Request.Headers["IdUtente"].ToString();
            command.CodSede = Request.Headers["codicesede"].ToString().Split(',')[0];
            try
            {
                _allertaHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Registra una richiesta, da parte del comando, di intervento delle colonne mobili, sull'emergenza
        /// </summary>
        [HttpPost("AddRichiestaEmergenza")]
        public async Task<IActionResult> AddRichiestaEmergenza([FromBody] RichiestaCommand command)
        {
            command.CodOperatore = Request.Headers["IdUtente"].ToString();
            command.CodSede = Request.Headers["codicesede"].ToString().Split(',')[0];
            try
            {
                _richiestaHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Registra una richiesta di creazione CRA
        /// </summary>
        [HttpPost("AddRichiestaCreazioneCraEmergenza")]
        public async Task<IActionResult> AddRichiestaCreazioneCraEmergenza([FromBody] RichiestaCreazioneCRACommand command)
        {
            command.CodOperatore = Request.Headers["IdUtente"].ToString();
            command.CodSede = Request.Headers["codicesede"].ToString().Split(',')[0];
            try
            {
                _richiestaCreazioneCraHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Gestisce una precedente richiesta di intervento sull'emergenza
        /// </summary>
        [HttpPost("GestisciRichiestaEmergenza")]
        public async Task<IActionResult> GestisciRichiestaEmergenza([FromBody] RichiestaGestitaCommand command)
        {
            command.CodOperatore = Request.Headers["IdUtente"].ToString();
            command.CodSede = Request.Headers["codicesede"].ToString().Split(',')[0];
            try
            {
                _richiestaGestitaHandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Restituisce l'elenco delle tipologie di emergenza
        /// </summary>
        [HttpGet("GetTipologieEmergenza")]
        public async Task<IActionResult> GetTipologieEmergenza()
        {
            try
            {
                var query = new GetTipologieEmergenzaQuery()
                {
                    IdSede = Request.Headers["codicesede"].ToString().Split(',')[0]
                };

                return Ok(_getTipologieHandler.Handle(query));
            }
            catch (Exception ex)
            {
                Log.Error("Errore GetTipologieEmergenza: {0}", ex.Message);
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Restituisce il dettaglio un'emergenza
        /// </summary>
        [HttpGet("GetEmergenzaById")]
        public async Task<IActionResult> GetEmergenzaById(string Id)
        {
            try
            {
                var query = new GetEmergenzaByIdQuery()
                {
                    IdSede = Request.Headers["codicesede"].ToString().Split(',')[0],
                    IdEmergenza = Id
                };

                return Ok(_getEmergenzaByIdHandler.Handle(query));
            }
            catch (Exception ex)
            {
                Log.Error("Errore GetEmergenzaById: {0}", ex.Message);
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Restituisce l'elenco delle emergenze di una sede
        /// </summary>
        [HttpPost("GetListaEmergenzeByCodSede")]
        public async Task<IActionResult> GetListaEmergenzeByCodSede(GetListaEmergenzeByCodComandoQuery query)
        {
            try
            {
                query.IdSede = Request.Headers["codicesede"].ToString().Split(',');
                query.IdOperatore = Request.Headers["IdUtente"].ToString();

                return Ok(_getListaEmergenzeByCodComandoHandler.Handle(query));
            }
            catch (Exception ex)
            {
                Log.Error("Errore GetListaEmergenzeByCodSede: {0}", ex.Message);
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
