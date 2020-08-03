using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte
{
    public class UpdateEnteValidator : ICommandValidator<UpdateEnteCommand>
    {
        public IEnumerable<ValidationResult> Validate(UpdateEnteCommand command)
        {
            if (command.Ente == null || command.Ente != new API.Models.Classi.Condivise.EnteIntervenuto() { })
                yield return new ValidationResult("Ente non valido");

            else
            {
                if(command.Ente.Id == null || command.Ente.Id == "0" || command.Ente.Id == "")
                    yield return new ValidationResult(Costanti.IdRichiestaNonValida);

                else
                {
                    if (command.Ente.CodCategoria == 0)
                        yield return new ValidationResult("Nessuna categoria selezionata");

                    if (command.Ente.Telefoni.Count == 0)
                        yield return new ValidationResult("Nessun telefono selezionato");
                }
            }
        }
    }
}
