using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti
{
    public interface IGetStringCoordinateByCodSede
    {
        public string[] Get(string codiceSede);
    }
}
