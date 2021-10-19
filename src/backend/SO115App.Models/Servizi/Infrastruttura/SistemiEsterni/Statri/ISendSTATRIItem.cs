using SO115App.API.Models.Classi.Soccorso;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri
{
    public interface ISendSTATRIItem
    {
        public void InvioRichiesta(RichiestaAssistenza richiesta);
    }
}
