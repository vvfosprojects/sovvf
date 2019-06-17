using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;

[assembly: InternalsVisibleTo("SO115App.FakePersistence.InMemory.Test")]
[assembly: InternalsVisibleTo("SO115App.CompositionRoot")]

namespace SO115App.FakePersistence.InMemory
{
    internal class DbCodiciRichieste : IGeneraCodiceRichiesta
    {
        private readonly Dictionary<string, int> ultimiNumeri = new Dictionary<string, int>();
        private Object lockObj = new object();

        public string Genera(string codiceProvincia, int anno)
        {
            if (codiceProvincia.Length != 2)
                throw new ArgumentException("Il codice della provincia deve essere di 2 caratteri");

            int nuovoNumero;
            var chiave = string.Format("{0}-{1}", codiceProvincia, anno);

            lock (lockObj)
            {
                if (ultimiNumeri.ContainsKey(chiave))
                {
                    nuovoNumero = ultimiNumeri[chiave] + 1;
                    ultimiNumeri[chiave] = nuovoNumero;
                }
                else
                {
                    nuovoNumero = 1;
                    ultimiNumeri[chiave] = 1;
                }
            }

            int ultimeDueCifreAnno = anno % 100;
            return string.Format("{0}-{1}-{2:D5}", codiceProvincia, ultimeDueCifreAnno, nuovoNumero);
        }
    }
}
