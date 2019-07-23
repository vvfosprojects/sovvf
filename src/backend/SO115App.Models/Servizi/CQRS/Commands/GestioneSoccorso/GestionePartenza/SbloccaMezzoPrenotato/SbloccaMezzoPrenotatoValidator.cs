using System.Collections.Generic;
using CQRS.Commands.Validators;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GetSbloccaMezzoPrenotato;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.SbloccaMezzoPrenotato
{
    public class SbloccaMezzoPrenotatoValidator : ICommandValidator<SbloccaMezzoPrenotatoCommand>
    {
        private readonly IGetSbloccaMezzoPrenotato _mezzo;

        public SbloccaMezzoPrenotatoValidator(IGetSbloccaMezzoPrenotato iGetMezzoPrenotato)
        {
            _mezzo = iGetMezzoPrenotato;
        }
        public IEnumerable<ValidationResult> Validate(SbloccaMezzoPrenotatoCommand command)
        {

            if (_mezzo.GetMezzo(command) == null)

                yield return new ValidationResult(Costanti.MezzoNonPresente);
        }
    }
}