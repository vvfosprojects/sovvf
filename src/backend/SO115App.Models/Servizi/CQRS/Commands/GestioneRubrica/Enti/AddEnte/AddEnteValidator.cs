using CQRS.Commands.Validators;
using CQRS.Validation;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte
{
    public class AddEnteValidator : ICommandValidator<AddEnteCommand>
    {
        public IEnumerable<ValidationResult> Validate(AddEnteCommand command)
        {
            // Controlli sul richiedente
            //if (command.CodRichiesta.Trim().Length == 0)
            //{
            //    yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            //}

            return new List<ValidationResult>();
        }
    }
}
