using SO115App.WSNue.DataContract;
using SO115App.WSNue.Utility;
using System.ServiceModel;

namespace SO115App.WSNue.Interface
{
    [ServiceContract(Namespace = Costanti.NUE_NAME_SPASE_SERVICE_CONTRACT)]
    public interface IEntiService
    {
        [OperationContract(Action = "http://entiservice.ws.nue.gov.it/IEntiService/GestContatto")]
        GestContattoResponse GestContatto(string EnteMittente,
                                          string EnteDestinatario,
                                          string SedeMittente,
                                          string SedeDestinataria,
                                          string ProvinciaMittente,
                                          string ProvinciaDestinatario,
                                          string SchedaContatto);
    }
}
