using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using System;

namespace SO115App.FakePersistence.JSon.Utility
{
    public class GeneraCodiceRichiesta : IGeneraCodiceRichiesta
    {
        public GeneraCodiceRichiesta()
        {
        }

        public string Genera(string codiceProvincia, int anno)
        {
            int ultimeDueCifreAnno = anno % 100;
            string nuovoNumero = GetMaxCodice.GetMax().ToString();
            return string.Format("{0}-{1}-{2:D5}", codiceProvincia, ultimeDueCifreAnno, nuovoNumero);
        }
    }
}
