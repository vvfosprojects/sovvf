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
