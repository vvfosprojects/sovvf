using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace DomainModel.CQRS.Commands.ChiamataInCorsoMarker
{
    public class AddChiamataInCorsoCommandHandler : ICommandHandler<ChiamataInCorsoMarkerCommand>
    {
        private readonly IChiamateInCorso _iAddChiamataInCorso;

        public AddChiamataInCorsoCommandHandler(IChiamateInCorso iAddChiamataInCorso)
        {
            this._iAddChiamataInCorso = iAddChiamataInCorso;
        }

        public void Handle(ChiamataInCorsoMarkerCommand command)
        {
            _iAddChiamataInCorso.AddChiamata(command.AddChiamataInCorso);
        }
    }
}
