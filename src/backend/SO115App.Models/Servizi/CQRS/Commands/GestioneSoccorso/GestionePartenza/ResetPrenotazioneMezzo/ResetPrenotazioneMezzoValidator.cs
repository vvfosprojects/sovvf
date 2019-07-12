using System.Collections.Generic;
using CQRS.Commands.Validators;
using SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato;
using SO115App.Models.Servizi.Infrastruttura.GetResetPrenotazioneMezzo;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.ResetPrenotazioneMezzo
{
    public class ResetPrenotazioneMezzoValidator : ICommandValidator<ResetPrenotazioneMezzoCommand>
    {
        private readonly IGetResetPrenotazioneMezzo mezzo;

        public ResetPrenotazioneMezzoValidator(IGetResetPrenotazioneMezzo iGetMezzoPrenotato)
        {
            this.mezzo = iGetMezzoPrenotato;
        }
        public IEnumerable<ValidationResult> Validate(ResetPrenotazioneMezzoCommand command)
        {

            if (mezzo.GetMezzo(command) == null)

                yield return new ValidationResult("Il mezzo non è presente");
        }
    }
}