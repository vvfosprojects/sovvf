using System.Collections.Generic;
using CQRS.Commands.Validators;
using SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.MezzoPrenotato
{
    public class MezzoPrenotatoValidator : ICommandValidator<MezzoPrenotatoCommand>
    {
        private readonly IGetMezzoPrenotato mezzo;

        public MezzoPrenotatoValidator(IGetMezzoPrenotato iGetMezzoPrenotato)
        {
            this.mezzo = iGetMezzoPrenotato;
        }
        public IEnumerable<ValidationResult> Validate(MezzoPrenotatoCommand command)
        {

            if (mezzo.GetMezzo(command) == null)

                yield return new ValidationResult("Il mezzo non è presente");
        }
    }
}