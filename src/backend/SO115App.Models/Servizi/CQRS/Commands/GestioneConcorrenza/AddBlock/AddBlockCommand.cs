﻿using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Concorrenza;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.AddBlock
{
    /// <summary>
    ///   Filtra solo i mezzi appartenenti all'unità operativa indicata.
    /// </summary>
    /// <remarks>Eventualmente si può filtrare per cercare solo i dati di un singolo Box</remarks>
    public class AddBlockCommand
    {
        public List<Concorrenza> concorrenza { get; set; }
        public Utente utente { get; set; }

        public string CodComando { get; set; }
    }
}
