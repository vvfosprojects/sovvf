﻿//-----------------------------------------------------------------------
// <copyright file="Costanti.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
namespace SO115App.Models.Classi.Utility
{
    public static class Costanti
    {
        #region CondivisaAuthorization

        public static string UtenteNonAutorizzato = "Utente non autorizzato";

        #endregion CondivisaAuthorization

        #region CondivisaValidator

        public static string RuoloUtentePresente = "Ruolo già presente nella sede selezionata. Oppure in una sede gerarchicamente superiore";
        public static string RichiestaEsistente = "Risulta già presente una richiesta nelle vicinanze di quella che si sta inserendo. Si vuole procedere ugualmente con l'inserimento?";

        public static string PartenzaGiaPresente = "Risulta già una partenza con il mezzo selezionato. Comporre una nuova partenza.";
        public static string CoordinateErrate = "Le coordinate inserite non risultano corrette. Si prega di reinserirle.";

        public static string PresenteNomeNonCognome = "E' presente il nome del richiedente ma non il suo cognome";
        public static string NominativoNonPresente = "Il nominativo del richiedente non è presente";

        public static string SelezionataPersonaFisica =
            "Se è presente un nominativo per una persona fisica non può essere presente una ragione sociale";

        public static string IdOperatoreNonValido = "Id Operatore non valido";
        public static string IdRichiestaNonValida = "Codice Richiesta non valido";
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
        public static string MezzoIstituto = "Istituto";
        public static string PosizioneRadioSenzaMezzo = "PosizioneRadioSenzaMezzo";
        public static string MezzoFuoriServizio = "Fuori Servizio";
        public static string MezzoStatoSconosciuto = "Stato Sconosciuto";
        public static string MezzoNonDisponibile = "NON DISPONIBILE";
        public static string MezzoDisponibile = "DISPONIBILE";
        public static string MezzoOperativoPreaccoppiato = "Operativo Preaccoppiato";
        public static string MezzoAssegnatoPreaccoppiato = "Assegnato Preaccoppiato";
        public static string MezzoErroreCambioStatoRichiestaChiusa = "Lo stato del mezzo non può essere cambiato in una richiesta chiusa.";
        public static string MezzoErroreGiaOccupato = "Il mezzo risulta già occupato. Selezionarne un altro.";

        #endregion StatiMezzi

        #region Eventi

        public static string EventoGenerico = "EventoGenerico";
        public static string Telefonata = "Telefonata";
        public static string InizioPresaInCarico = "InizioPresaInCarico";
        public static string RiaperturaRichiesta = "RiaperturaRichiesta";
        public static string ChiusuraRichiesta = "ChiusuraRichiesta";
        public static string ComposizionePartenza = "ComposizionePartenza";
        public static string Composizione = "Composizione";
        public static string ChiusuraPartenza = "ChiusuraPartenza";
        public static string ArrivoSulPosto = "ArrivoSulPosto";
        public static string AssegnataRichiesta = "AssegnataRichiesta";
        public static string EventoRichiestaPresidiata = "RichiestaPresidiata";
        public static string EventoRichiestaSospesa = "RichiestaSospesa";
        public static string AssegnataPriorita = "AssegnataPriorita";
        public static string MarcaRilevante = "MarcaRilevante";
        public static string EventoMezzoInRientro = "MezzoInRientro";
        public static string EventoMezzoRientrato = "MezzoRientrato";

        public static string RevocaPerAltraMotivazione = "RevocaPerAltraMotivazione";
        public static string RevocaPerFuoriServizio = "RevocaPerFuoriServizio";
        public static string RevocaPerInterventoNonPiuNecessario = "RevocaPerInterventoNonPiuNecessario";
        public static string RevocaPerRiassegnazione = "RevocaPerRiassegnazione";
        public static string AnnullamentoPresaInCarico = "AnnullamentoPresaInCarico";

        #endregion Eventi

        #region Ruoli Utenti

        public static string GestoreChiamate = "Gestore Chiamate";
        public static string GestoreRichieste = "Gestore Richieste";
        public static string Amministratore = "Amministratore";

        #endregion Ruoli Utenti

        #region FAKE

        public static string ListaMezzi = "Fake/ListaMezzi.json";
        public static string ListaSquadre = "Fake/ListaSquadre.json";
        public static string ListaPreAccoppiati = "Fake/ListaPreAccoppiati.json";

        #endregion FAKE
    }
}
