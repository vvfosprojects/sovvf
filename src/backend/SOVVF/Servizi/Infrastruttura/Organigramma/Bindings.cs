using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SimpleInjector;
using SimpleInjector.Packaging;

namespace Modello.Servizi.Infrastruttura.Organigramma
{
    public class Bindings : IPackage
    {
        public void RegisterServices(Container container)
        {
            container.Register<IGetUnitaOperativaPerCodice, GetUnitaOperativaPerCodice>();
        }
    }
}
