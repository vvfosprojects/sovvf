using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Qualifiche
{
    public interface IGetPercorsoByIdQualifica
    {
        Task<PercorsoQualifica> Get(string idQualifica);
    }
}
