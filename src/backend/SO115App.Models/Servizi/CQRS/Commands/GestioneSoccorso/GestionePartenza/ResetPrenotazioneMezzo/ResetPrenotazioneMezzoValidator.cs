using System.Collections.Generic;
using CQRS.Commands.Validators;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato;
using SO115App.Models.Servizi.Infrastruttura.GetResetPrenotazioneMezzo;
using ValidationResult = CQRS.Validation.ValidationResult;

namespace DomainModel.CQRS.Commands.ResetPrenotazioneMezzo
{
    public class ResetPrenotazioneMezzoValidator : ICommandValidator<ResetPrenotazioneMezzoCommand>
    {
        private readonly IGetResetPrenotazioneMezzo _mezzo;
        private readonly Costanti _costanti = new Costanti();

        public ResetPrenotazioneMezzoValidator(IGetResetPrenotazioneMezzo iGetMezzoPrenotato)
        {
            _mezzo = iGetMezzoPrenotato;
        }
        public IEnumerable<ValidationResult> Validate(ResetPrenotazioneMezzoCommand command)
        {

            if (_mezzo.GetMezzo(command) == null)

                yield return new ValidationResult(_costanti.MezzoNonPresente);
        }
    }
}