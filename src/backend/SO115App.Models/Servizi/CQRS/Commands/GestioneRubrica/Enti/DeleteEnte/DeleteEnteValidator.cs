using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte
{
    public class DeleteEnteValidator : ICommandValidator<DeleteEnteCommand>
    {
        public IEnumerable<ValidationResult> Validate(DeleteEnteCommand command)
        {
            var lstNumeri = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

            if (command.CodiceEnte == "0" || !command.CodiceEnte.All(c => lstNumeri.Contains(c)))
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
        }
    }
}
