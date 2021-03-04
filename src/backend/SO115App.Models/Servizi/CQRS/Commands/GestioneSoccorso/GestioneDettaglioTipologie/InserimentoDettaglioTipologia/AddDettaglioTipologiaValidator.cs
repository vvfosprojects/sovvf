using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia
{
    public class AddDettaglioTipologiaValidator : ICommandValidator<AddDettaglioTipologiaCommand>
    {
        public IEnumerable<ValidationResult> Validate(AddDettaglioTipologiaCommand command)
        {
            if (command.DettaglioTipologia == null || command.DettaglioTipologia == new TipologiaDettaglio() { })
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            else
            {
                if (command.DettaglioTipologia.Descrizione == "")
                    yield return new ValidationResult("Descrizione non inserita");
            }
        }
    }
}
