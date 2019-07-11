using DomainModel.CQRS.Commands.GestrionePartenza.AggiornaStatoMezzo;

namespace SO115App.Models.Servizi.Infrastruttura.Composizione
{
    public interface IUpdateStatoPartenze
    {
        void Update(AggiornaStatoMezzoCommand query);
    }
}
