﻿using CQRS.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.AddEnte;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.UpdateEnte;
using System;
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
        public GestioneEntiController(ICommandHandler<AddEnteCommand> addEnte, ICommandHandler<UpdateEnteCommand> updateEnte)
        {
            _updateEnteHandler = updateEnte;
            _addEnteHandler = addEnte;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add()
        {
            try
            {
                var command = new AddEnteCommand()
                {
                    //
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

        [HttpPost("Update")]
        public async Task<IActionResult> Update()
        {
            try
            {
                var command = new UpdateEnteCommand()
                {
                    //
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
    }
}
