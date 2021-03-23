using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze
{
    public interface IGetCompetenzeByCoordinateIntervento
    {
        public string[] GetCompetenzeByCoordinateIntervento(Coordinate coordinate);
    }
}
