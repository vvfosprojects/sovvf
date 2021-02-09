using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Classi.Utenti.Autenticazione;
using System.Collections.Generic;

namespace SO115App.Models.Classi.ServiziEsterni.Utility
{
    /// <summary>
    ///   classe statica che si occupa del mapping tra l'oggetto in arrivo da Utenti Comuni e la
    ///   classe personale VVF
    /// </summary>
    public static class MapPersonaleVVFsuPersonaleUC
    {
        /// <summary>
        ///   metodo della classe che effettua il mapping
        /// </summary>
        /// <param name="listaPersonaleUC">la lista di PersonaleUC</param>
        /// <returns>una lista di personaleVVF</returns>
        public static List<PersonaleVVF> Map(List<PersonaleUC> listaPersonaleUC)
        {
            var listaPersonaleVVF = new List<PersonaleVVF>();
            foreach (var personaUC in listaPersonaleUC)
            {
                listaPersonaleVVF.Add(new PersonaleVVF
                {
                    codiceFiscale = personaUC.CodiceFiscale,
                    sede = new DistaccamentoPersonale() 
                    { 
                        id = personaUC.Sede.Id,
                        descrizione = personaUC.Sede.Descrizione
                    },
                    nome = $"{personaUC.Cognome}.{personaUC.Nome}"
                });
            }
            return listaPersonaleVVF;
        }
    }
}
