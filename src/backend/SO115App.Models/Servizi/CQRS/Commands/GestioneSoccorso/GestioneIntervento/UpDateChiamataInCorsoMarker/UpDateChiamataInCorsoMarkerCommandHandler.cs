using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace DomainModel.CQRS.Commands.ChiamataInCorsoMarker
{
    public class UpDateChiamataInCorsoCommandHandler : ICommandHandler<UpDateChiamataInCorsoMarkerCommand>
    {
        private readonly IUpDateChiamataInCorso _iUpDateChiamataInCorso;

        public UpDateChiamataInCorsoCommandHandler(IUpDateChiamataInCorso iUpDateChiamataInCorso)
        {
            this._iUpDateChiamataInCorso = iUpDateChiamataInCorso;
        }

        public void Handle(UpDateChiamataInCorsoMarkerCommand command)
        {
            _iUpDateChiamataInCorso.UpDateChiamata(command.ChiamataInCorso);
        }
    }
}
