using System.Collections.Generic;
using CQRS.Commands.Validators;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Classi.Utility;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.ResetPrenotazioneMezzo
{
    public class ResetPrenotazioneMezzoValidator : ICommandValidator<ResetPrenotazioneMezzoCommand>
    {
        private readonly IGetMezzoByCodice _iGetMezzoPrenotato;

        public ResetPrenotazioneMezzoValidator(IGetMezzoByCodice iGetMezzoPrenotato)
        {
            _iGetMezzoPrenotato = iGetMezzoPrenotato;
        }

        public IEnumerable<ValidationResult> Validate(ResetPrenotazioneMezzoCommand command)
        {
            if (_iGetMezzoPrenotato.Get(command.MezzoPrenotato.mezzoComposizione.Mezzo.Codice) == null)
                yield return new ValidationResult(Costanti.MezzoNonPresente);
        }
    }
}
