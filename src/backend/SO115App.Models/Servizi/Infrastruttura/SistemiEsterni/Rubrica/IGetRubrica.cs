using SO115App.Models.Classi.RubricaDTO;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Rubrica
{
    public interface IGetRubrica
    {
        public List<ContattoExt> Get();
    }
}
