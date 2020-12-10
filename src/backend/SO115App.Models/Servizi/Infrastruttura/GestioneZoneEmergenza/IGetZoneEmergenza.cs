using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneZoneEmergenza
{
    public interface IGetZoneEmergenza
    {
        List<string> GetAll();
    }
}
