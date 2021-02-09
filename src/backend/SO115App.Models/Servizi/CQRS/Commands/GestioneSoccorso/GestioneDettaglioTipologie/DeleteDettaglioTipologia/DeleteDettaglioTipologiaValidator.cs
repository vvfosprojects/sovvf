using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia
{
    public class DeleteDettaglioTipologiaValidator : ICommandValidator<DeleteDettaglioTipologiaCommand>
    {
        public IEnumerable<ValidationResult> Validate(DeleteDettaglioTipologiaCommand command)
        {
            if (command.CodDettaglioTipologia == null)
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
        }
    }
}
