using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.AddEnte
{
    public class AddEnteCommand
    {
        public EnteIntervenuto Ente { get; set; }
    }
}
