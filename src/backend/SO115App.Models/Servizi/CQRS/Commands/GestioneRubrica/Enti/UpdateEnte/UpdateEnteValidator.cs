using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte
{
    public class UpdateEnteValidator : ICommandValidator<UpdateEnteCommand>
    {
        public IEnumerable<ValidationResult> Validate(UpdateEnteCommand command)
        {
            if (command.Ente == null || command.Ente == new API.Models.Classi.Condivise.EnteIntervenuto() { })
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);

            else
            {
                if(command.Ente.Id == null || command.Ente.Id == "0" || command.Ente.Id == "")
                    yield return new ValidationResult(Costanti.IdRichiestaNonValida);

                else
                {
                    if (command.Ente.Codice == 0)
                        yield return new ValidationResult("Nessun codice selezionato");

                    if (command.Ente.CodCategoria == 0)
                        yield return new ValidationResult("Nessuna categoria selezionata");

                    if (command.Ente.Telefoni == null || command.Ente.Telefoni.Count == 0
                        || command.Ente.Telefoni.Any(c => c.Numero.ToList().Any(x => !new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', ' ' }.Contains(x))))
                        yield return new ValidationResult("Telefoni non validi");

                    if (command.Ente.Descrizione == "" || command.Ente.Descrizione == null)
                        yield return new ValidationResult("Nessuna descrizione selezionata");
                }
            }
        }
    }
}
