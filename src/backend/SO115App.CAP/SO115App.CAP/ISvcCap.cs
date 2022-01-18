using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace SO115App.CAP
{
    // NOTA: è possibile utilizzare il comando "Rinomina" del menu "Refactoring" per modificare il nome di interfaccia "ISvcCap" nel codice e nel file di configurazione contemporaneamente.
    [ServiceContract]
    public interface ISvcCap
    {
        [OperationContract]
        void DoWork();
    }
}
