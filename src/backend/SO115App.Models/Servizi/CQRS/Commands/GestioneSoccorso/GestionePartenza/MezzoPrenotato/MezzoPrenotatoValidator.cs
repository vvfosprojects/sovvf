using System.Collections.Generic;
using CQRS.Commands.Validators;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Classi.Utility;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.MezzoPrenotato
{
    public class MezzoPrenotatoValidator : ICommandValidator<MezzoPrenotatoCommand>
    {
        private readonly IGetMezzoByCodice _iGetMezzoPrenotato;

        public MezzoPrenotatoValidator(IGetMezzoByCodice iGetMezzoPrenotato)
        {
            _iGetMezzoPrenotato = iGetMezzoPrenotato;
        }

        public IEnumerable<ValidationResult> Validate(MezzoPrenotatoCommand command)
        {
            if (_iGetMezzoPrenotato.Get(command.MezzoPrenotato.MezzoComposizione.Mezzo.Codice) == null)
                yield return new ValidationResult(Costanti.MezzoNonPresente);
        }
    }
}
