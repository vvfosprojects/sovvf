using DomainModel.CQRS.Commands.ConfermaPartenze;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.MezzoPrenotato;

namespace SO115App.Models.Servizi.Infrastruttura.Composizione
{
    public interface IUpdateConfermaPartenze
    {
        ConfermaPartenze Update(ConfermaPartenzeCommand query);
    }
}
