﻿using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using System;

namespace SO115App.FakePersistence.JSon.Utility
{
    public class GeneraCodiceRichiesta : IGeneraCodiceRichiesta
    {
        public string GeneraCodiceIntervento(string codiceProvincia, int anno)
        {
            int ultimeDueCifreAnno = anno % 100;
            int nuovoNumero = GetMaxCodice.GetMax();
            string returnFormatString = string.Format("{0}{1}{2:D5}", codiceProvincia.Split('.')[0], ultimeDueCifreAnno, nuovoNumero);
            return returnFormatString;
        }

        public string GeneraCodiceChiamata(string codiceProvincia, int anno)
        {
            int ultimeDueCifreAnno = anno % 100;
            int giorno = DateTime.UtcNow.Day;
            int mese = DateTime.UtcNow.Month;
            int nuovoNumero = GetMaxCodice.GetMaxCodiceChiamata();
            string returnString = string.Format("{0}{1}{2}{3}{4:D5}", codiceProvincia.Split('.')[0], giorno, mese, ultimeDueCifreAnno, nuovoNumero);
            return returnString;
        }

        public int GeneraCodicePartenza()
        {
            throw new NotImplementedException();
        }
    }
}
