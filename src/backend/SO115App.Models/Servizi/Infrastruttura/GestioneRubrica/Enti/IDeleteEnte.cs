using SO115App.API.Models.Servizi.Infrastruttura.Organigramma.Implementazioni;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti
{
    public interface IDeleteEnte
    {
        void Delete(string codice);
    }
}
