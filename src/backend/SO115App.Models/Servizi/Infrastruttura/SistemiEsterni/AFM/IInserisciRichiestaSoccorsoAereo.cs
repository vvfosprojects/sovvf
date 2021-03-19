using SO115App.Models.Classi.ServiziEsterni.AFM;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM
{
    public interface IInserisciRichiestaSoccorsoAereo
    {
        void Inserisci(NuovaRichiestaAFM richiesta);
    }
}
