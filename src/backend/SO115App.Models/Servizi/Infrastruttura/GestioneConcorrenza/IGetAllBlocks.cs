using SO115App.Models.Classi.Concorrenza;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza
{
    public interface IGetAllBlocks
    {
        public List<Concorrenza> GetAll(string[] CodiciSede);
    }
}
