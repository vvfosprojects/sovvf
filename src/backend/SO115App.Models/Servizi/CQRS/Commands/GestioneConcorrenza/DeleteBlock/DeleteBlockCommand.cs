﻿using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Concorrenza;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.DeleteBlock
{
    /// <summary>
    ///   Filtra solo i mezzi appartenenti all'unità operativa indicata.
    /// </summary>
    /// <remarks>Eventualmente si può filtrare per cercare solo i dati di un singolo Box</remarks>
    public class DeleteBlockCommand
    {
        public string IdConcorrenza { get; set; }
        public string CodiceSede { get; set; }
        public Utente utente { get; set; }
    }
}