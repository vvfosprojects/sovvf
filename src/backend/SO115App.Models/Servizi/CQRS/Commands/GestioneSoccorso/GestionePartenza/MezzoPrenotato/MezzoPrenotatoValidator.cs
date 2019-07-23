using System.Collections.Generic;
using CQRS.Commands.Validators;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.MezzoPrenotato
{
    public class MezzoPrenotatoValidator : ICommandValidator<MezzoPrenotatoCommand>
    {
        private readonly IGetMezzoPrenotato _mezzo;

        public MezzoPrenotatoValidator(IGetMezzoPrenotato iGetMezzoPrenotato)
        {
            this._mezzo = iGetMezzoPrenotato;
        }
        public IEnumerable<ValidationResult> Validate(MezzoPrenotatoCommand command)
        {

            if (_mezzo.GetMezzo(command) == null)

                yield return new ValidationResult(Costanti.MezzoNonPresente);
        }
    }
}