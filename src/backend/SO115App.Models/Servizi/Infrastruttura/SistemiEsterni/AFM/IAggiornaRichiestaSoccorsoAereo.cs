using SO115App.Models.Classi.ServiziEsterni.AFM;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM
{
    public interface IAggiornaRichiestaSoccorsoAereo
    {
        /// <summary>
        /// E' una put, quindi agiorna/inserisce
        /// </summary>
        /// <param name="richiesta"></param>
        InfoAFM Aggiorna(NuovaRichiestaAFM richiesta);
    }
}
