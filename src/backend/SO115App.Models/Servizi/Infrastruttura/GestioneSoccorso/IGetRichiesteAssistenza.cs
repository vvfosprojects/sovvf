﻿using SO115App.API.Models.Classi.Soccorso;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso
{
    public interface IGetRichiesteAssistenza
    {
        IEnumerable<RichiestaAssistenza> GetRichieste();
    }
}
