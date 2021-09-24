using CQRS.Commands;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo
{
    public class AnnullaRichiestaSoccorsoAereoCommandHandler : ICommandHandler<AnnullaRichiestaSoccorsoAereoCommand>
    {
        private readonly IAnnullaRichiestaSoccorsoAereo _annullaRichiestaSoccorsoAereo;
        private readonly IUpDateRichiestaAssistenza _updateRichiesta;

        public AnnullaRichiestaSoccorsoAereoCommandHandler(IAnnullaRichiestaSoccorsoAereo annullaRichiestaSoccorsoAereo, IUpDateRichiestaAssistenza updateRichiesta)
        {
            _annullaRichiestaSoccorsoAereo = annullaRichiestaSoccorsoAereo;
            _updateRichiesta = updateRichiesta;
        }

        public void Handle(AnnullaRichiestaSoccorsoAereoCommand command)
        {
            var date = DateTime.Now;

            #region AFM Servizio

            command.Annullamento.datetime = date;

            //Comunico al servizio esterno
            var result = _annullaRichiestaSoccorsoAereo.Annulla(command.Annullamento, MapRequestKeyAFM.MapForAFM(command.CodiceRichiesta));

            #endregion

            command.ResponseAFM = result;

            if (!result.IsError()) //OK ANNULLAMENTO
            {
                new AnnullamentoRichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, command.ResponseAFM.GetNoteEvento("Annullamento"), command.ResponseAFM.GetTargaEvento(), result.locality);
            }
            else //ERRORE ANNULLAMENTO
            {
                new AnnullamentoRichiestaSoccorsoAereo(command.Richiesta, date, command.IdOperatore, command.ResponseAFM.GetNoteEvento("Annullamento"), command.ResponseAFM.GetTargaEvento(), result.locality);
            }

            //Salvo richiesta sul db
            _updateRichiesta.UpDate(command.Richiesta);
        }
    }
}
