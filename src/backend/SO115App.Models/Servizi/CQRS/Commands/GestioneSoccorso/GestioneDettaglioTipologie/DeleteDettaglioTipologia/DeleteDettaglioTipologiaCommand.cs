namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia
{
    public class DeleteDettaglioTipologiaCommand
    {
        public string[] CodiceSede { get; set; }
        public string idOperatore { get; set; }
        public int CodDettaglioTipologia { get; set; }
    }
}
