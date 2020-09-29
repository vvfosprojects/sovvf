using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.DeleteTrasferimento
{
    public class DeleteTrasferimentoValidator : ICommandValidator<DeleteTrasferimentoCommand>
    {
        public IEnumerable<ValidationResult> Validate(DeleteTrasferimentoCommand command)
        {
            if (command.Id == null || command.Id == "")
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
        }
    }
}
