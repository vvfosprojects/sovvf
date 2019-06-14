using DomainModel.CQRS.Commands.MezzoPrenotato;
using DomainModel.CQRS.Commands.ResetPrenotazioneMezzo;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.MezzoPrenotato;

namespace SO115App.Models.Servizi.Infrastruttura.GetResetPrenotazioneMezzo
{
    public interface IGetResetPrenotazioneMezzo
    {
        MezzoPrenotato Get(ResetPrenotazioneMezzoCommand query);

        ComposizioneMezzi GetMezzo(ResetPrenotazioneMezzoCommand query);
    }
}