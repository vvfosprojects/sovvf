using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaValidation : ICommandValidator<ModificaPartenzaCommand>
    {
        public IEnumerable<ValidationResult> Validate(ModificaPartenzaCommand command)
        {
            if (command.ModificaPartenza.CodRichiesta == null || command.ModificaPartenza.CodRichiesta == "")
            {
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            }

            if (command.ModificaPartenza.Mezzo == null || command.ModificaPartenza.Mezzo == default)
            {
                yield return new ValidationResult("Nessun mezzo selezionato");
            }

            if (command.ModificaPartenza.Squadre == null || 
                command.ModificaPartenza.Squadre.Count == 0 || 
                command.ModificaPartenza.Squadre.Any(c => c == null || c == default))
            {
                yield return new ValidationResult("Nessuna squadra selezionata");
            }

            if (command.ModificaPartenza.SequenzaStati != null)
                if(command.ModificaPartenza.SequenzaStati.Any(s => s.Stato == null || s.Stato == "" || s.DataOraAggiornamento == null || s.DataOraAggiornamento == default))
                {
                    yield return new ValidationResult("Nessuna mezzo selezionato");
                }

            if (command.ModificaPartenza.Annullamento)
            {
                if(command.ModificaPartenza.CodMezzoDaAnnullare == null || command.ModificaPartenza.CodMezzoDaAnnullare == "")
                {
                    yield return new ValidationResult("Nessun codice mezzo selezionato");
                }

                if (command.ModificaPartenza.CodSquadreDaAnnullare == null || 
                    command.ModificaPartenza.CodSquadreDaAnnullare.Count() == 0 || 
                    command.ModificaPartenza.CodSquadreDaAnnullare.Any(c => c == null || c == ""))
                {
                    yield return new ValidationResult("Codici squadre errati");
                }

                if (command.ModificaPartenza.DataAnnullamento == null || command.ModificaPartenza.DataAnnullamento == default)
                {
                    yield return new ValidationResult("Nessuna data annullamento selezionata");
                }
            }
        }
    }
}
