//-----------------------------------------------------------------------
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

        public const string UtenteNonAutorizzato = "Utente non autorizzato";
        public const string DatiMancanti = "Dati Mancanti";

        #endregion CondivisaAuthorization

        #region CondivisaValidator

        public const string RuoloUtentePresente = "Ruolo già presente nella sede selezionata. Oppure in una sede gerarchicamente superiore";
        public const string RichiestaEsistente = "Risulta già presente una richiesta nelle vicinanze di quella che si sta inserendo. Si vuole procedere ugualmente con l'inserimento?";

        public const string PartenzaGiaPresente = "Risulta già una partenza con il mezzo selezionato. Comporre una nuova partenza.";
        public const string CoordinateErrate = "Le coordinate inserite non risultano corrette. Si prega di reinserirle.";

        public const string PresenteNomeNonCognome = "E' presente il nome del richiedente ma non il suo cognome";
        public const string NominativoNonPresente = "Il nominativo del richiedente non è presente";

        public const string SelezionataPersonaFisica =
            "Se è presente un nominativo per una persona fisica non può essere presente una ragione sociale";

        public const string IdOperatoreNonValido = "Id Operatore non valido";
        public const string IdRichiestaNonValida = "Codice Richiesta non valido";
        public const string MezzoNonPresente = "Il mezzo non è presente";
        public const string StatoNonValido = "Lo stato della richiesta non è valido";

        public const string AggiuntoUnEventoPrecedenteAlPiuRecente =
            "Impossibile aggiungere un evento ad una richiesta che ne ha già uno più recente.";

        #endregion CondivisaValidator

        #region StatiRichiesta

        public const string Chiamata = "Chiamata";
        public const string RichiestaAssegnata = "Assegnata";
        public const string RichiestaPresidiata = "Presidiata";
        public const string RichiestaChiusa = "Chiusa";
        public const string RichiestaSospesa = "Sospesa";
        public const string RichiestaRiaperta = "Riaperta";
        public const string RichiestaModificata = "Modificata";
        public const string ErroreRichiestaChiusa = "L'operazione richiesta non più essere eseguita. L'intervento risulta chiuso. Riaprirlo per poter operare. ";

        public const string EmergenzaCreazione = "Creata Emergenza";
        public const string EmergenzaModifica = "Modificata Emergenza";
        public const string EmergenzaAnnulla = "Emergenza annullata";
        public const string EmergenzaPresaInCarico = "Emergenza presa in carico";
        public const string EmergenzaInserimentoModuliColonnaMobili = "Inseriti Moduli di Colonna Mobile";


        #endregion StatiRichiesta

        #region StatiMezzi

        public const string MezzoSulPosto = "Sul Posto";
        public const string MezzoInRientro = "In Rientro";
        public const string MezzoInSede = "In Sede";
        public const string MezzoRientrato = "Rientrato";
        public const string MezzoInViaggio = "In Viaggio";
        public const string MezzoInUscita = "In Uscita";
        public const string MezzoOccupato = "Occupato";
        public const string MezzoIstituto = "Istituto";
        public const string PosizioneRadioSenzaMezzo = "PosizioneRadioSenzaMezzo";
        public const string MezzoFuoriServizio = "Fuori Servizio";
        public const string MezzoStatoSconosciuto = "Stato Sconosciuto";
        public const string MezzoNonDisponibile = "NON DISPONIBILE";
        public const string MezzoDisponibile = "DISPONIBILE";
        public const string MezzoOperativoPreaccoppiato = "Operativo Preaccoppiato";
        public const string MezzoAssegnatoPreaccoppiato = "Assegnato Preaccoppiato";
        public const string MezzoErroreCambioStatoRichiestaChiusa = "Lo stato del mezzo non può essere cambiato in una richiesta chiusa.";
        public const string MezzoErroreGiaOccupato = "Il mezzo risulta già occupato. Selezionarne un altro.";

        #endregion StatiMezzi

        #region Eventi

        public const string EventoGenerico = "EventoGenerico";
        public const string Telefonata = "Telefonata";
        public const string InizioPresaInCarico = "InizioPresaInCarico";
        public const string RiaperturaRichiesta = "RiaperturaRichiesta";
        public const string ChiusuraRichiesta = "ChiusuraRichiesta";
        public const string ComposizionePartenza = "ComposizionePartenza";
        public const string Composizione = "Composizione";
        public const string ChiusuraPartenza = "ChiusuraPartenza";
        public const string ArrivoSulPosto = "ArrivoSulPosto";
        public const string UscitaPartenza = "UscitaPartenza";
        public const string AssegnataRichiesta = "Assegnata";
        public const string EventoRichiestaPresidiata = "RichiestaPresidiata";
        public const string EventoRichiestaSospesa = "RichiestaSospesa";
        public const string AssegnataPriorita = "AssegnataPriorita";
        public const string MarcaRilevante = "MarcaRilevante";
        public const string EventoMezzoInRientro = "MezzoInRientro";
        public const string EventoMezzoRientrato = "MezzoRientrato";

        public const string RevocaPerAltraMotivazione = "RevocaPerAltraMotivazione";
        public const string RevocaPerFuoriServizio = "RevocaPerFuoriServizio";
        public const string RevocaPerInterventoNonPiuNecessario = "RevocaPerInterventoNonPiuNecessario";
        public const string RevocaPerRiassegnazione = "RevocaPerRiassegnazione";
        public const string RevocaPerSostituzioneMezzo = "RevocaPerSostituzioneMezzo";
        public const string SostituzionePartenza = "SostituzionePartenza";
        public const string AnnullamentoPresaInCarico = "AnnullamentoPresaInCarico";

        public const string FonogrammaDaInviare = "FonogrammaDaInviare";
        public const string FonogrammaInviato = "FonogrammaInviato";

        public const string AllertaAltreSedi = "AllertaAltreSedi";

        public const string TrasferimentoChiamata = "TrasferimentoChiamata";

        public const string RichiestaSoccorsoAereo = "RichiestaSoccorsoAereo";
        public const string AnnullamentoRichiestaSoccorsoAereo = "AnnullamentoRichiestaSoccorsoAereo";
        public const string InserimentoEnteInterenuto = "InserimentoEnteInterenuto";
        public const string STATRI_InivioRichiesta = "STATRI Invio richiesta";

        #endregion Eventi

        #region Ruoli Utenti

        public const string GestoreChiamate = "Gestore Chiamate";
        public const string GestoreRichieste = "Gestore Richieste";
        public const string Amministratore = "Amministratore";

        #endregion Ruoli Utenti

        #region POS

        public const string POSFileNonPresente = "Il file non risulta allegato alla richiesta";
        public const string POSDescrizioneNonPresente = "Non risulta essere presente la descrizione";
        public const string POSTipologiaNonPresente = "Associare una tipologia alla POS";

        #endregion POS

        #region FAKE

        public const string ListaMezzi = "Fake/ListaMezzi.json";
        public const string ListaSquadre = "Fake/ListaSquadre.json";
        public const string ListaPreAccoppiati = "Fake/ListaPreAccoppiati.json";

        #endregion FAKE
    }
}
