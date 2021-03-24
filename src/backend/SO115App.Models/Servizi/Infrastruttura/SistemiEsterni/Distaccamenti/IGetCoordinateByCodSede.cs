using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti
{
    public interface IGetCoordinateByCodSede
    {
        public Coordinate Get(string codiceSede);
    }
}
