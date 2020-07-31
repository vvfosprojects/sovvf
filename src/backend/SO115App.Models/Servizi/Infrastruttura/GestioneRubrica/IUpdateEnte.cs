using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.UpdateEnte;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneRubrica
{
    public interface IUpdateEnte
    {
        void Update(UpdateEnteCommand command);
    }
}
