using SO115App.Models.Classi.RubricaDTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Rubrica
{
    public interface IGetRubrica
    {
        public List<ContattoExt> Get();
    }
}
