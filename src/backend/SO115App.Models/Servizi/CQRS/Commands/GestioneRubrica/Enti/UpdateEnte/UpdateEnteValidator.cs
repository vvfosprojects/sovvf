using CQRS.Commands.Validators;
using CQRS.Validation;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte
{
    public class UpdateEnteValidator : ICommandValidator<UpdateEnteCommand>
    {
        public IEnumerable<ValidationResult> Validate(UpdateEnteCommand command)
        {
            //if (command.CodRichiesta.Trim().Length == 0)
            //{
            //    yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            //}

            return new List<ValidationResult>();
        }
    }
}
