using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie
{
    public interface IModifyDettaglioTipologia
    {
        public void Modify(TipologiaDettaglio command);
    }
}
