using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetDettaglioDipendenteById
    {
        Task<string> GetTelefonoDipendenteByIdDipendente(string IdDipendente);
    }
}
