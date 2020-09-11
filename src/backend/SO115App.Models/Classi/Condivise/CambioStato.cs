using SO115App.Models.Classi.Utility;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Classi.Condivise
{
    public class CambioStato
    {
        public DateTime DataOraAggiornamento { get; set; }
        public string Stato { get; set; }

        public string Coerente(List<CambioStato> lst)
        {
            var statoPrecedente = getStatoPrecedente(lst.OrderByDescending(c => c.DataOraAggiornamento).ToList());

            if (statoPrecedente == null)
                return null;

            switch (Stato)
            {
                case "In Uscita": return checkCoerenza(CoerenzeStati.InUscita, statoPrecedente);

                case "In Viaggio": return checkCoerenza(CoerenzeStati.InViaggio, statoPrecedente);

                case "Sul Posto": return checkCoerenza(CoerenzeStati.SulPosto, statoPrecedente);

                case "In Rientro": return checkCoerenza(CoerenzeStati.InRientro, statoPrecedente);

                case "Rientrato": return checkCoerenza(CoerenzeStati.Rientrato, statoPrecedente);

                case "In Sede": return checkCoerenza(CoerenzeStati.InSede, statoPrecedente);

                case "Istituto": return checkCoerenza(CoerenzeStati.Istituto, statoPrecedente);

                case "Fuori Servizio": return checkCoerenza(CoerenzeStati.FuoriServizio, statoPrecedente);
            }

            throw new Exception("Errore controllo sequenza stati");
        }

        /// <summary>
        /// Il metodo verifica la coerenza tra due stati e genera un messaggio di errore ad hoc.
        /// </summary>
        /// <param name="coerenzeStatoAttuale">Costante CoerenzaStati</param>
        /// <returns>Messaggio ad HOC di errore</returns>
        private string checkCoerenza(List<string> coerenzeStatoAttuale, CambioStato statoPrecedente)
        {
            if (!coerenzeStatoAttuale.Contains(statoPrecedente.Stato))
                return $"Lo stato {Stato} non può seguire lo stato {statoPrecedente.Stato}";

            //else if (DataOraAggiornamento <= statoPrecedente.DataOraAggiornamento)
            //    return $"La data dello stato {Stato} è piu recente di quella di {statoPrecedente.Stato}";

            return null;
        }

        /// <summary>
        /// Il metodo cerca lo stato che precede quello valorizzato nella classe. 
        /// La lista degli stati deve essere ordinata al di fuori del metodo per non sprecare performance
        /// </summary>
        /// <param name="lst">La lista degli stati ordinata</param>
        private CambioStato getStatoPrecedente(List<CambioStato> lst)
        {
            bool trovato = false;

            foreach (var item in lst)
            {
                if (trovato == true)
                    return item;

                if (item == this)
                    trovato = true;
            }

            return null;
        }
    }

    /// <summary>
    /// La classe CoerenzeStati contiene per ogni stato (proprietà) tutti gli stati che possono precederlo.
    /// In questa classe, la proprietà che scelgo ritorna tutte le relative coerenze.
    /// </summary>
    public static class CoerenzeStati
    {
        public static List<string> InSede = new List<string> { Costanti.MezzoRientrato };
        public static List<string> InUscita = new List<string> { Costanti.MezzoInSede, Costanti.MezzoRientrato };
        public static List<string> InViaggio = new List<string> { Costanti.MezzoInSede, Costanti.MezzoRientrato, Costanti.MezzoInUscita };
        public static List<string> SulPosto = new List<string> { };
        public static List<string> InRientro = new List<string> { Costanti.MezzoInUscita, Costanti.MezzoInViaggio, Costanti.MezzoSulPosto };
        public static List<string> Rientrato = new List<string> { };

        public static List<string> Istituto = new List<string> { };
        public static List<string> FuoriServizio = new List<string> { };
    }
}
