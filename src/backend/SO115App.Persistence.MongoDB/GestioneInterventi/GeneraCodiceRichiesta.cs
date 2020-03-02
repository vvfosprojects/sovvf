using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using SO115App.Persistence.MongoDB.GestioneInterventi.Utility;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneInterventi
{
    public class GeneraCodiceRichiesta : IGeneraCodiceRichiesta
    {
        private readonly GetMaxCodice _getMaxCodice;

        public GeneraCodiceRichiesta(GetMaxCodice getMaxCodice)
        {
            _getMaxCodice = getMaxCodice;
        }

        public string Genera(string codiceProvincia, int anno)
        {
            int ultimeDueCifreAnno = anno % 100;
            int maxNumero = _getMaxCodice.GetMax();
            string returnFormatString = string.Format("{0}{1}{2:D5}", codiceProvincia.Split('.')[0], ultimeDueCifreAnno, maxNumero);
            return returnFormatString;
        }

        public string GeneraCodiceChiamata(string codiceProvincia, int anno)
        {
            int ultimeDueCifreAnno = anno % 100;
            int giorno = DateTime.UtcNow.Day;
            int mese = DateTime.UtcNow.Month;
            int maxNumero = _getMaxCodice.GetMaxCodiceChiamata();
            string returnString = string.Format("{0}{1}{2}{3}{4:D5}", codiceProvincia.Split('.')[0], giorno, mese, ultimeDueCifreAnno, maxNumero);
            return returnString;
        }
    }
}
