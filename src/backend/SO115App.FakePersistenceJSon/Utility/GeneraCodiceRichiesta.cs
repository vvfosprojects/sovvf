using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using System;

namespace SO115App.FakePersistence.JSon.Utility
{
    public class GeneraCodiceRichiesta : IGeneraCodiceRichiesta
    {
        private readonly IGetMaxCodice _iGetMaxCodice;

        public GeneraCodiceRichiesta(IGetMaxCodice iGetMaxCodice)
        {
            _iGetMaxCodice = iGetMaxCodice;
        }

        public string Genera(string codiceProvincia, int anno)
        {
            int ultimeDueCifreAnno = anno % 100;
            string nuovoNumero = _iGetMaxCodice.GetMax().ToString();
            return string.Format("{0}-{1}-{2:D5}", codiceProvincia, ultimeDueCifreAnno, nuovoNumero);
        }
    }
}
