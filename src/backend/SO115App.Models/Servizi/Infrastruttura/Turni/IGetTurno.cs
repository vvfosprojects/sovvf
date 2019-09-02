using SO115App.API.Models.Classi.Utenti;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.Turni
{
    public interface IGetTurno
    {
        Turno Get();
    }
}
