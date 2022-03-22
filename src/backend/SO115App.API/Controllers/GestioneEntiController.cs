using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.GestioneEntiIntervenuti;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica.Categorie;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneEntiController : ControllerBase
    {
        private readonly ICommandHandler<AddEnteCommand> _addEnteHandler;
        private readonly ICommandHandler<UpdateEnteCommand> _updateEnteHandler;
        private readonly ICommandHandler<DeleteEnteCommand> _deleteEnteHandler;
        private readonly IQueryHandler<RubricaQuery, RubricaResult> _rubricaQueryHandler;
        private readonly IQueryHandler<CategorieEntiQuery, CategorieEntiResult> _categorieQueryHandler;
        private readonly ICommandHandler<EntiIntervenutiCommand> _insertEnteintervenuto;

        public GestioneEntiController(ICommandHandler<AddEnteCommand> addEnte,
            ICommandHandler<UpdateEnteCommand> updateEnte,
            ICommandHandler<DeleteEnteCommand> deleteEnteHandler,
            IQueryHandler<RubricaQuery, RubricaResult> rubricaQueryHandler,
            IQueryHandler<CategorieEntiQuery, CategorieEntiResult> categorieQueryHandler,
            ICommandHandler<EntiIntervenutiCommand> insertEnteintervenuto)
        {
            _updateEnteHandler = updateEnte;
            _addEnteHandler = addEnte;
            _deleteEnteHandler = deleteEnteHandler;
            _rubricaQueryHandler = rubricaQueryHandler;
            _categorieQueryHandler = categorieQueryHandler;
            _insertEnteintervenuto = insertEnteintervenuto;
        }

        /// <summary>
        ///   Restituisce l'elenco degli elementi presenti in rubrica
        /// </summary>
        [HttpPost("")]
        [ProducesResponseType(typeof(RubricaResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Get([FromBody] RubricaQuery rubricaQuery)
        {
            try
            {
                rubricaQuery.IdOperatore = Request.Headers["IdUtente"];
                rubricaQuery.IdSede = Request.Headers["codicesede"].ToString().Split(',');

                return Ok(_rubricaQueryHandler.Handle(rubricaQuery));
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
        ///   Aggiunge un nuovo elemento in rubrica
        /// </summary>
        [HttpPost("Add")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Add(EnteIntervenuto ente)
        {
            try
            {
                var command = new AddEnteCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    Ente = ente
                };

                _addEnteHandler.Handle(command);

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
        ///   Aggiorna un elemento in rubrica
        /// </summary>
        [HttpPost("Update")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Update(EnteIntervenuto ente)
        {
            try
            {
                var command = new UpdateEnteCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    Ente = ente
                };

                _updateEnteHandler.Handle(command);

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
        ///   Cancella un elemento in rubrica
        /// </summary>
        [HttpGet("Delete")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Delete(string Id)
        {
            try
            {
                var command = new DeleteEnteCommand()
                {
                    CodiceSede = Request.Headers["codicesede"].ToString().Split(','),
                    idOperatore = Request.Headers["IdUtente"],
                    Id = Id
                };

                _deleteEnteHandler.Handle(command);

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
        ///   Restituisce l'elenco delle categorie presenti in rubrica
        /// </summary>
        [HttpGet("GetCategorie")]
        [ProducesResponseType(typeof(List<CategoriaEnte>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetCategorie()
        {
            try
            {
                var query = new CategorieEntiQuery()
                {
                    IdOperatore = Request.Headers["IdUtente"],
                    IdSede = Request.Headers["codicesede"]
                };

                return Ok(_categorieQueryHandler.Handle(query).DataArray);
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
        ///   Aggiunge un ente intervenuto in un intervento
        /// </summary>
        [HttpPost("AddEnteIntervenuto")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddEnteIntervenuto(EntiIntervenutiCommand enteIntervenuto)
        {
            try
            {
                enteIntervenuto.CodSede = Request.Headers["codicesede"];
                enteIntervenuto.IdOperatore = Request.Headers["IdUtente"];

                _insertEnteintervenuto.Handle(enteIntervenuto);
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
