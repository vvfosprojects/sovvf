using SO115App.Models.Classi.Concorrenza;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza
{
    public interface IGetBlockByValue
    {
        public Concorrenza Get(string value);
    }
}
