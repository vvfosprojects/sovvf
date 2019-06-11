using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.MezzoPrenotato;

namespace SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato
{
    public interface IGetMezzoPrenotato
    {
        MezzoPrenotato Get(MezzoPrenotatoCommand query);

        ComposizioneMezzi GetMezzo(MezzoPrenotatoCommand query);
    }
}
