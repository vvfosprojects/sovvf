using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Servizi.Infrastruttura.Autenticazione;

namespace SOVVF.FakeImplementations.Modello.Autenticazione
{
    internal class GetOperatoreAutenticato : IGetOperatoreAutenticato
    {
        public string Get()
        {
            return "mario.rossi.fake";
        }
    }
}
