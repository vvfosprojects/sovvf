﻿using CQRS.Queries;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia
{
    public class DettaglioTipologiaQuery : IQuery<DettaglioTipologiaResult>
    {
        /// <summary>
        ///   Il filtro utilizzato per la ricerca dei dettagli tipologia
        /// </summary>
        public string[] IdSede { get; set; }

        /// <summary>
        ///   L'id dell'operatore che ha fatto la richiesta di visualizzazione dell'elenco dei
        ///   dettagli tipologia
        /// </summary>
        public string IdOperatore { get; set; }

        /// <summary>
        ///   l'oggetto paginazione con i parametri utili per la paginazione
        /// </summary>
        public Paginazione Pagination { get; set; }

        /// <summary>
        ///   Search è un testo libero che l'utente digita per ricercare un determinato record in
        ///   dettaglioTipologia Ricerca Full-Text sul campo DESCRIZIONE della basedati
        /// </summary>
        public FiltriDettaglioTipologia Filters { get; set; }
    }
}
