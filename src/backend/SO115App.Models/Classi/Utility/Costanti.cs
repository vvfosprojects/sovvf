using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Utility
{
    public static class Costanti
    {
        #region CondivisaAuthorization

        public static string UtenteNonAutorizzato = "Utente non autorizzato";

        #endregion CondivisaAuthorization

        #region CondivisaValidator

        public static string PresenteNomeNonCognome = "E' presente il nome del richiedente ma non il suo cognome";

        public static string SelezionataPersonaFisica =
            "Se è presente un nominativo per una persona fisica non può essere presente una ragione sociale";

        public static string IdOperatoreNonValido = "Id Operatore non valido";
        public static string IdRichiestaNonValida = "Id Richiesta non valido";
        public static string MezzoNonPresente = "Il mezzo non è presente";
        public static string StatoNonValido = "Lo stato della richiesta non è valido";

        public static string AggiuntoUnEventoPrecedenteAlPiuRecente =
            "Impossibile aggiungere un evento ad una richiesta che ne ha già uno più recente.";

        #endregion CondivisaValidator

        #region StatiRichiesta

        public static string Chiamata = "Chiamata";
        public static string RichiestaAssegnata = "Assegnata";
        public static string RichiestaPresidiata = "Presidiata";
        public static string RichiestaChiusa = "Chiusa";
        public static string RichiestaSospesa = "Sospesa";
        public static string RichiestaRiaperta = "Riaperta";

        #endregion StatiRichiesta

        #region StatiMezzi

        public static string MezzoSulPosto = "Sul Posto";
        public static string MezzoInRientro = "In Rientro";
        public static string MezzoInSede = "In Sede";
        public static string MezzoRientrato = "Rientrato";
        public static string MezzoInViaggio = "In Viaggio";

        #endregion StatiMezzi

        #region Eventi

        public static string EventoGenerico = "Evento Generico";
        public static string Telefonata = "Telefonata";
        public static string InizioPresaInCarico = "InizioPresaInCarico";
        public static string RiaperturaRichiesta = "RiaperturaRichiesta";
        public static string ChiusuraRichiesta = "ChiusuraRichiesta";
        public static string ComposizionePartenza = "ComposizionePartenza";
        public static string ComposizionePartenze = "ComposizionePartenze";
        public static string ChiusuraPartenza = "ChiusuraPartenza";
        public static string ArrivoSulPosto = "ArrivoSulPosto";
        public static string PartenzaRientrata = "PartenzaRientrata";
        public static string PartenzaInRientro = "PartenzaInRientro";
        public static string AssegnataRichiesta = "AssegnataRichiesta";
        public static string EventoRichiestaPresidiata = "RichiestaPresidiata";
        public static string EventoRichiestaSospesa = "RichiestaSospesa";
        public static string AssegnataPriorita = "AssegnataPriorita";

        #endregion Eventi

        #region Turni

        public static string A = "A";
        public static string B = "C";
        public static string D = "D";

        #endregion Turni
    }
}
