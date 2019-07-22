using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Utility
{
    public class Costanti
    {
        #region CondivisaAuthorization
        public string UtenteNonAutorizzato = "Utente non autorizzato";
        #endregion

        #region CondivisaValidator
        public string PresenteNomeNonCognome = "E' presente il nome del richiedente ma non il suo cognome";
        public string SelezionataPersonaFisica =
            "Se è presente un nominativo per una persona fisica non può essere presente una ragione sociale";
        public string IdRichiestaNonValida = "Id Richiesta non valido";
        public string MezzoNonPresente = "Il mezzo non è presente";
        #endregion

        #region StatiRichiesta
        public string RichiestaAssegnata = "Assegnata";
        public string RichiestaPresidiata = "Presidiata";
        public string RichiestaChiusa = "Chiusa";
        #endregion
        
        #region StatiMezzi
        public string MezzoSulPosto = "Sul Posto";
        public string MezzoInRientro = "In Rientro";
        public string MezzoInSede = "In Sede";
        public string MezzoRientrato = "Rientrato";
        public string MezzoInViaggio = "In Viaggio";
        #endregion

        #region Eventi
        public string EventoGenerico = "Evento Generico";
        public string Telefonata = "Telefonata";
        public string InizioPresaInCarico = "InizioPresaInCarico";
        public string RiaperturaRichiesta = "RiaperturaRichiesta";
        public string ChiusuraRichiesta = "ChiusuraRichiesta";
        public string ComposizionePartenza = "ComposizionePartenza";
        public string ChiusuraPartenza = "ChiusuraPartenza";
        public string ArrivoSulPosto = "ArrivoSulPosto";
        #endregion






    }
}
