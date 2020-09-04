using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaValidation : ICommandValidator<ModificaPartenzaCommand>
    {
        public IEnumerable<ValidationResult> Validate(ModificaPartenzaCommand command)
        {
            if (command.CodRichiesta == null || command.CodRichiesta == "")
            {
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            }
        }
    }
}
