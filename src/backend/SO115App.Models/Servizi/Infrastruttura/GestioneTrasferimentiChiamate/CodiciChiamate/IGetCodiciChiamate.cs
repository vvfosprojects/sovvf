using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate.CodiciChiamate
{
    public interface IGetCodiciChiamate
    {
        List<string> Get(string CodSede);
    }
}
