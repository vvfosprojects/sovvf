using CQRS.Commands.Validators;
using CQRS.Validation;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte
{
    public class AddEnteValidator : ICommandValidator<AddEnteCommand>
    {
        public IEnumerable<ValidationResult> Validate(AddEnteCommand command)
        {
            if (command.Ente == null || command.Ente == new API.Models.Classi.Condivise.EnteIntervenuto() { })
                yield return new ValidationResult("Ente non valido");

            else
            {
                if (command.Ente.CodCategoria == 0)
                    yield return new ValidationResult("Nessuna categoria selezionata");

                if(command.Ente.Telefoni == null || command.Ente.Telefoni.Count == 0)
                    yield return new ValidationResult("Nessun telefono selezionato");

                if (command.Ente.Cap == null || command.Ente.Cap == "")
                    yield return new ValidationResult("Nessun Cap selezionato");

                if (command.Ente.CodSede == null || command.Ente.CodSede == "" || command.Ente.CodSede == "0")
                    yield return new ValidationResult("Nessun codice sede selezionato");

                if (command.Ente.Descrizione == "" || command.Ente.Descrizione == null)
                    yield return new ValidationResult("Nessuna descrizione selezionata");

                if (command.Ente.Email == null || command.Ente.Email == "")
                    yield return new ValidationResult("Nessuna mail selezionata");

                if (command.Ente.NoteEnte == null || command.Ente.NoteEnte == "")
                    yield return new ValidationResult("Nessuna nota selezionata");
            }
        }
    }
}
