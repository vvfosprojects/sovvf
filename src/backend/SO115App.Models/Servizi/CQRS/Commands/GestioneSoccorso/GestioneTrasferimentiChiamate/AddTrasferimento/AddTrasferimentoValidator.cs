using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento
{
    public class AddTrasferimentoValidator : ICommandValidator<AddTrasferimentoCommand>
    {
        private readonly IGetRichiestaById _getRichiestaById;

        public AddTrasferimentoValidator(IGetRichiestaById getRichiestaById)
        {
            _getRichiestaById = getRichiestaById;
        }

        public IEnumerable<ValidationResult> Validate(AddTrasferimentoCommand command)
        {
            if (command.TrasferimentoChiamata == null || command.TrasferimentoChiamata == default)
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            else
            {
                if (command.TrasferimentoChiamata.CodChiamata == null || command.TrasferimentoChiamata.CodChiamata == "")
                    yield return new ValidationResult("Nessun codice per la chiamata");

                var richiesta = _getRichiestaById.GetByCodice(command.TrasferimentoChiamata.CodChiamata);

                if (richiesta.CodRichiesta != null)
                    yield return new ValidationResult("La richiesta risulta già lavorata, non può essere trasferita");

                if (command.TrasferimentoChiamata.CodSedeA == null || command.TrasferimentoChiamata.CodSedeA == "")
                    yield return new ValidationResult("Nessun codice sede a");
            }
        }
    }
}
