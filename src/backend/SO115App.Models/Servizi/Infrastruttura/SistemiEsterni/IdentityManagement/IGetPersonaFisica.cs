using SO115App.Models.Classi.ServiziEsterni.IdentityManagement;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement
{
    public interface IGetPersonaFisica
    {
        List<PersonaFisica> Get(List<string> codiceFiscale);
    }
}
