using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento
{
    public class AddTrasferimentoValidator : ICommandValidator<AddTrasferimentoCommand>
    {
        public IEnumerable<ValidationResult> Validate(AddTrasferimentoCommand command)
        {
            if (command.TrasferimentoChiamata == null || command.TrasferimentoChiamata == default)
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            else
            {
                if (command.TrasferimentoChiamata.CodRichiesta == null || command.TrasferimentoChiamata.CodRichiesta == "")
                    yield return new ValidationResult("Nessun codice richiesta");

                if (command.TrasferimentoChiamata.CodSedeA == null || command.TrasferimentoChiamata.CodSedeA.Count() == 0)
                    yield return new ValidationResult("Nessun codice sede a");
            }
        }
    }
}
