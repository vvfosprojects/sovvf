using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.AddEnte;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneRubrica
{
    public interface IAddEnte
    {
        void Add(AddEnteCommand command);
    }
}
