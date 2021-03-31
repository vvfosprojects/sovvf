using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede
{
    public interface IGetSedeAssociazioniByCodSede
    {
        public Task<string> GetCodUnitaOrganizzativaByCodSede(string CodSede);
    }
}
