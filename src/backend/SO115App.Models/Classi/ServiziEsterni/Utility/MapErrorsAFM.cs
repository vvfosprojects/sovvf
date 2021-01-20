using SO115App.Models.Classi.ServiziEsterni.AFM;
using System;

namespace SO115App.Models.Classi.ServiziEsterni.Utility
{
    public static class MapErrorsAFM
    {
        public static string Map(Errore errore)
        {
            switch (errore.code)
            {
                case "000": return "Errore imprevisto non gestito";
                case "001": return "Tentativo di aggiornare o recuperare informazioni con un requestKey sconosciuto";
                case "002": return "Tentativo di chiamare un metodo delle API non passando un parametro obbligatorio";
                case "003": return "Tentativo di chiamare un metodo delle API passando nessun parametro";
                case "004": return "Non ci sono velivoli a disposizione per la richiesta di soccorso ricevuta";
                case "005": return "Non esiste un request type con il codice passato";
            }

            throw new Exception("Errore AFM non gestito da SO115: mappare l'errore e riprovare");
        }
    }
}
