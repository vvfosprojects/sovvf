using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Modello.Servizi.CQRS.Queries;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.ResultDTO;

namespace RestInterface.Controllers.Soccorso
{
    public class SintesiRichiesteAssistenzaController : ApiController
    {
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> handler;

        public SintesiRichiesteAssistenzaController(
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> handler)
        {
            this.handler = handler;
        }

        // GET: api/SintesiRichiesteAssistenza
        public SintesiRichiesteAssistenzaResult Get()
        {
            return handler.Handle(new SintesiRichiesteAssistenzaQuery());
        }
    }
}
