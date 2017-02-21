using System;
using System.Collections.Generic;
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre.DTO
{
    /// <summary>
    ///   Modella la squadra disponibile
    /// </summary>
    public class SquadraDisponibileDTO
    {
        /// <summary>
        ///   E' il ticket della squadra
        /// </summary>
        public string Ticket { get; set; }

        /// <summary>
        ///   E' la sigla parlante della squadra
        /// </summary>
        public string Sigla { get; set; }

        /// <summary>
        ///   E' il tooltip che verrà mostrato sul client (es: data inizio e fine servizio prevista
        ///   ed effettiva)
        /// </summary>
        public string Tooltip { get; set; }

        /// <summary>
        ///   Descrizione Unità Operativa Responsabile della squadra
        /// </summary>
        public string DescrizioneUnitaOperativaResponsabile { get; set; }

        /// <summary>
        ///   Elenco dei membri che compongono la squadra
        /// </summary>
        public IEnumerable<MembroDTO> Membri { get; set; }

        /// <summary>
        ///   Indica se la squadra è stata selezionata (se è vuoto indica che la squadra non è selezionata)
        /// </summary>
        public SelezioneSquadra SelezionataDa { get; set; }
    }
}
