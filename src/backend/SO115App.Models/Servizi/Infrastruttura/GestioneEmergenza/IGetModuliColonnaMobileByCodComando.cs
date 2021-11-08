using SO115App.Models.Classi.Emergenza;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza
{
    public interface IGetModuliColonnaMobileByCodComando
    {
        public List<ModuliColonnaMobile> Get(string codComando, string NomeModulo);
    }
}
