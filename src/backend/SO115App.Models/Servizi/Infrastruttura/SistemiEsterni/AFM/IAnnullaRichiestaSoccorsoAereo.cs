using SO115App.Models.Classi.ServiziEsterni.AFM;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM
{
    public interface IAnnullaRichiestaSoccorsoAereo
    {
        ErroreRichiestaSoccorsoAereo Annulla(AnnullaRichiestaSoccorsoAereo richiesta, string CodiceRichiesta);
    }
}
