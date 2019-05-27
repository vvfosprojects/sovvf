using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace DomainModel.CQRS.Commands.ChiamataInCorsoMarker
{
    public class CancellazioneChiamataInCorsoCommandHandler : ICommandHandler<CancellazioneChiamataInCorsoMarkerCommand>
    {
        private readonly IDeleteChiamataInCorso _iDelChiamataInCorso;

        public CancellazioneChiamataInCorsoCommandHandler(IDeleteChiamataInCorso iDelChiamataInCorso)
        {
            this._iDelChiamataInCorso = iDelChiamataInCorso;
        }

        public void Handle(CancellazioneChiamataInCorsoMarkerCommand command)
        {
            _iDelChiamataInCorso.DeleteChiamataInCorso(command.IdChiamataInCorso);
        }
    }
}
