using SO115App.ExternalAPI.Fake.Classi.PersonaleUtentiComuni;
using SO115App.Models.Classi.Utenti.Autenticazione;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Classi.Utility
{
    /// <summary>
    ///   classe statica che si occupa del mapping tra l'oggetto in arrivo da Utenti Comuni e la
    ///   classe personale VVF
    /// </summary>
    internal static class MapPersonaleVVFsuPersonaleUC
    {
        /// <summary>
        ///   metodo della classe che effettua il mapping
        /// </summary>
        /// <param name="listaPersonaleUC">la lista di PersonaleUC</param>
        /// <returns>una lista di personaleVVF</returns>
        internal static List<PersonaleVVF> Map(List<PersonaleUC> listaPersonaleUC)
        {
            var listaPersonaleVVF = new List<PersonaleVVF>();
            foreach (var personaUC in listaPersonaleUC)
            {
                listaPersonaleVVF.Add(new PersonaleVVF
                {
                    CodFiscale = personaUC.CodiceFiscale,
                    CodSede = personaUC.Sede.Id,
                    DescSede = personaUC.Sede.Descrizione,
                    Nominativo = $"{personaUC.Cognome}.{personaUC.Nome}"
                });
            }
            return listaPersonaleVVF;
        }
    }
}
