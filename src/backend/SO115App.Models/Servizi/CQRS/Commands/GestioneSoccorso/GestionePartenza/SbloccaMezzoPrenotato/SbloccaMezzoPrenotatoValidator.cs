using System.Collections.Generic;
using CQRS.Commands.Validators;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Classi.Utility;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.SbloccaMezzoPrenotato
{
    public class SbloccaMezzoPrenotatoValidator : ICommandValidator<SbloccaMezzoPrenotatoCommand>
    {
        private readonly IGetMezzoByCodice _iGetMezzoPrenotato;

        public SbloccaMezzoPrenotatoValidator(IGetMezzoByCodice iGetMezzoPrenotato)
        {
            _iGetMezzoPrenotato = iGetMezzoPrenotato;
        }

        public IEnumerable<ValidationResult> Validate(SbloccaMezzoPrenotatoCommand command)
        {
            if (_iGetMezzoPrenotato.Get(command.MezzoPrenotato.mezzoComposizione.Mezzo.Codice) == null)

                yield return new ValidationResult(Costanti.MezzoNonPresente);
        }
    }
}
