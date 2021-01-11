using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie
{
    public interface IDeleteDettaglioTipologia
    {
        public void Delete(DeleteDettaglioTipologiaCommand command);
    }
}
