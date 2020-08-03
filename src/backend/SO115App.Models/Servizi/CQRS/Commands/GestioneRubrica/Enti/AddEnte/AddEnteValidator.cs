using CQRS.Commands.Validators;
using CQRS.Validation;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte
{
    public class AddEnteValidator : ICommandValidator<AddEnteCommand>
    {
        public IEnumerable<ValidationResult> Validate(AddEnteCommand command)
        {
            if (command.Ente == null || command.Ente != new API.Models.Classi.Condivise.EnteIntervenuto() { })
                yield return new ValidationResult("Ente non valido");

            else
            {
                if (command.Ente.CodCategoria == 0)
                    yield return new ValidationResult("Nessuna categoria selezionata");

                if(command.Ente.Telefoni.Count == 0)
                    yield return new ValidationResult("Nessun telefono selezionato");
            }
        }
    }
}
