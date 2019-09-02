using System;
using System.Collections.Generic;
using System.Text;
using SO115App.API.Models.Classi.Utenti;

namespace SO115App.Models.Servizi.Infrastruttura.Turni
{
    public interface IUpdateTurni
    {
        void Update(List<Turno> turni);
    }
}
