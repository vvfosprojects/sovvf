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

        public string VerificaCoerenza(List<CambioStato> lst)
        {
            var statoPrecedente = getStatoPrecedente(lst.OrderByDescending(c => c.DataOraAggiornamento).ToList());

            if (statoPrecedente == null)
                return null;

            switch (Stato)
            {
                case "In Uscita": return checkCoerenza(CoerenzeStati.InUscita, statoPrecedente.Stato);
                case "In Viaggio": return checkCoerenza(CoerenzeStati.InViaggio, statoPrecedente.Stato);
                case "Sul Posto": return checkCoerenza(CoerenzeStati.SulPosto, statoPrecedente.Stato);
                case "In Rientro": return checkCoerenza(CoerenzeStati.InRientro, statoPrecedente.Stato);
                case "Rientrato": return checkCoerenza(CoerenzeStati.Rientrato, statoPrecedente.Stato);
                case "In Sede": return checkCoerenza(CoerenzeStati.InSede, statoPrecedente.Stato);
            }

            throw new Exception("Errore controllo sequenza stati");
        }

        /// <summary>
        /// Il metodo verifica la coerenza tra due stati e genera un messaggio di errore ad hoc.
        /// </summary>
        /// <param name="coerenzeStatoAttuale">Costante CoerenzaStati</param>
        /// <returns>Messaggio ad HOC di errore</returns>
        private string checkCoerenza(List<string> coerenzeStatoAttuale, string statoPrecedente)
        {
            if (!coerenzeStatoAttuale.Contains(statoPrecedente))
                return $"Lo stato {Stato} non può seguire lo stato {statoPrecedente}";
            else
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
        public static readonly List<string> InSede = new List<string> { Costanti.MezzoRientrato };
        public static readonly List<string> InUscita = new List<string> { Costanti.MezzoInSede };
        public static readonly List<string> InViaggio = new List<string> { Costanti.MezzoInUscita };
        public static readonly List<string> SulPosto = new List<string> { Costanti.MezzoInViaggio };
        public static readonly List<string> InRientro = new List<string> { Costanti.MezzoSulPosto };
        public static readonly List<string> Rientrato = new List<string> { Costanti.MezzoInRientro };
    }
}
