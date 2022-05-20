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

        public const string UtenteNonAutorizzato = "1* Utente non autorizzato";
        public const string DatiMancanti = "1* Dati Mancanti";
        public const string MezzoPrenotato = "1*  Il mezzo risulta già prenotato. Non è possibile confermare l'operazione";
        public const string SquadraPrenotata = "1* La squadra risulta già prenotata. Non è possibile confermare l'operazione";
        public const string InterventoBloccato = "1* L'intervento risulta attualmente in lavorazione da un altro operatore. Non è possibile effettuare operazioni.";
        public const string CompetenzeNonPresenti = "1* Non risultano inserite le competenze. Non è possibile inserire l'intervento";

        #endregion CondivisaAuthorization

        #region CondivisaValidator

        public const string RuoloUtentePresente = "1* Ruolo già presente nella sede selezionata. Oppure in una sede gerarchicamente superiore";
        public const string RichiestaEsistente = "1* Risulta già presente una richiesta nelle vicinanze di quella che si sta inserendo. Si vuole procedere ugualmente con l'inserimento?";

        public const string PartenzaGiaPresente = "1* Risulta già una partenza con il mezzo selezionato. Comporre una nuova partenza.";
        public const string CoordinateErrate = "1* Le coordinate inserite non risultano corrette. Si prega di reinserirle.";

        public const string PresenteNomeNonCognome = "1* E' presente il nome del richiedente ma non il suo cognome";
        public const string NominativoNonPresente = "1* Il nominativo del richiedente non è presente";

        public const string SelezionataPersonaFisica =
            "1* Se è presente un nominativo per una persona fisica non può essere presente una ragione sociale";

        public const string IdOperatoreNonValido = "1* Id Operatore non valido";
        public const string IdRichiestaNonValida = "1* Codice Richiesta non valido";
        public const string MezzoNonPresente = "1* Il mezzo non è presente";
        public const string StatoNonValido = "1* Lo stato della richiesta non è valido";

        public const string AggiuntoUnEventoPrecedenteAlPiuRecente =
            "1* Impossibile aggiungere un evento ad una richiesta che ne ha già uno più recente.";

        #endregion CondivisaValidator

        #region StatiRichiesta

        public const string Chiamata = "Chiamata";
        public const string RichiestaAssegnata = "Assegnata";
        public const string RichiestaPresidiata = "Presidiata";
        public const string RichiestaChiusa = "Chiusa";
        public const string RichiestaSospesa = "Sospesa";
        public const string RichiestaRiaperta = "Riaperta";
        public const string RichiestaModificata = "Modificata";
        public const string ErroreRichiestaChiusa = "1* L'operazione richiesta non più essere eseguita. L'intervento risulta chiuso. Riaprirlo per poter operare. ";

        public const string EmergenzaCreazione = "Creata Emergenza";
        public const string EmergenzaModifica = "Modificata Emergenza";
        public const string EmergenzaAnnulla = "Emergenza annullata";
        public const string EmergenzaPresaInCarico = "Emergenza presa in carico";
        public const string EmergenzaInserimentoModuliColonnaMobiliImmediata = "Inseriti Moduli di Colonna Mobile (Immediata)";
        public const string EmergenzaInserimentoModuliColonnaMobiliPotInt = "Inseriti Moduli di Colonna Mobile (Pot/Int)";
        public const string EmergenzaInserimentoModuliColonnaMobiliConsolidamento = "Inseriti Moduli di Colonna Mobile (Consolidamento)";
        public const string EmergenzaAllerta = "Allerta CON per emergenza";
        public const string LogBook = "Log book";

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
        public const string MezzoErroreCambioStatoRichiestaChiusa = "1* Lo stato del mezzo non può essere cambiato in una richiesta chiusa.";
        public const string MezzoErroreGiaOccupato = "1* Il mezzo risulta già occupato. Selezionarne un altro.";

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
        public const string AnnullamentoStatoPartenza = "AnnullamentoStatoPartenza";
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

        public const string POSFileNonPresente = "1* Il file non risulta allegato alla richiesta";
        public const string POSDescrizioneNonPresente = "1* Non risulta essere presente la descrizione";
        public const string POSTipologiaNonPresente = "1* Associare una tipologia alla POS";

        #endregion POS

        #region FAKE

        public const string ListaMezzi = "Fake/ListaMezzi.json";
        public const string ListaSquadre = "Fake/ListaSquadre.json";
        public const string ListaPreAccoppiati = "Fake/ListaPreAccoppiati.json";

        #endregion FAKE
    }
}
