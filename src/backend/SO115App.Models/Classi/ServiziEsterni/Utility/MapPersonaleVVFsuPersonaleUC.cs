﻿using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Classi.Utenti.Autenticazione;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

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
        public static List<PersonaleVVF> Map(this List<PersonaleUC> listaPersonaleUC)
        {
            var listaPersonaleVVF = new ConcurrentQueue<PersonaleVVF>();

            listaPersonaleUC.ForEach(personaUC => listaPersonaleVVF.Enqueue(new PersonaleVVF
            {
                codiceFiscale = personaUC.codiceFiscale,
                sede = new DistaccamentoPersonale()
                {
                    id = personaUC.sede.id,
                    descrizione = personaUC.sede.descrizione
                },
                nome = personaUC.nome,
                tipoPersonale = personaUC.tipoPersonale,
                turno = personaUC.turno,
                specializzazioni = personaUC.specializzazioni,
                qualifica = personaUC.qualifica,
                cognome = personaUC.cognome
            }));

            return listaPersonaleVVF.ToList().OrderBy(n => n.nome).ToList();
        }
    }
}
