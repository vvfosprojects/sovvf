using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetDettaglioDipendenteById
    {
        Task<DettaglioDipententeResult> GetTelefonoDipendenteByIdDipendente(string IdDipendente);
    }
}
