using SO115App.WSNue.DataContract;
using SO115App.WSNue.Interface;
using SO115App.WSNue.Manager;
using SO115App.WSNue.Utility;
using System.ServiceModel;
using System.ServiceModel.Activation;

namespace SO115App.WSNue
{
    [ServiceBehavior(AddressFilterMode = AddressFilterMode.Any, Namespace = Costanti.NUE_NAME_SPACE)]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class SvcNue : IEntiService
    {
        public GestContattoResponse GestContatto(string EnteMittente,
                                                 string EnteDestinatario,
                                                 string SedeMittente,
                                                 string SedeDestinataria,
                                                 string ProvinciaMittente,
                                                 string ProvinciaDestinatario,
                                                 string SchedaContatto)
        {
            NueManager manager = new NueManager();
            GestContattoResponse response = new GestContattoResponse();

            InsertSchedaNueRequest request = new InsertSchedaNueRequest()
            {
                enteDestinatario = EnteDestinatario,
                enteMittente = EnteMittente,
                provinciaDestinatario = ProvinciaDestinatario,
                provinciaMittente = ProvinciaMittente,
                schedaContatto = SchedaContatto,
                sedeDestinataria = SedeDestinataria,
                sedeMittente = SedeMittente
            };

            response.response = manager.InserisciSchedaNue(request);

            return response;
        }
    }
}