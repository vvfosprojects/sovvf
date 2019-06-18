using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta
{
    public interface IGeneraCodiceRichiesta
    {
        string Genera(string codiceProvincia, int anno);
    }
}
