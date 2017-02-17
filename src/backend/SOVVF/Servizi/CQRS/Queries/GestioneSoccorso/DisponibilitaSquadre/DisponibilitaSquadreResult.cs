using System;
using Modello.Classi.Soccorso.Eventi.Partenze;
using System.Collections.Generic;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre
{
    /// <summary>
    ///   DTO che restituisce l'elenco delle squadre disponibili.
    /// </summary>
    public class DisponibilitaSquadreResult
    {
        public IEnumerable<SquadraDisponibile> Squadre { get; set; }
    }

    /// <summary>
    ///   Modella la squadra disponibile
    /// </summary>
    public class SquadraDisponibile
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
        public IEnumerable<Membro> Membri { get; set; }

        /// <summary>
        ///   Indica se la squadra è stata selezionata (se è vuoto indica che la squadra non è selezionata)
        /// </summary>
        public SelezioneSquadra SelezionataDa { get; set; }
    }

    /// <summary>
    ///   Modella il membro della squadra disponibile
    /// </summary>
    public class Membro
    {
        /// <summary>
        ///   Codice fiscale del membro
        /// </summary>
        public string CodiceFiscale { get; set; }

        /// <summary>
        ///   Nome del membro
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        ///   Cognome del membro
        /// </summary>
        public string Cognome { get; set; }

        /// <summary>
        ///   Nickname del membro (sarà valorizzato solo in caso di omonimia)
        /// </summary>
        public string Nickname { get; set; }

        /// <summary>
        ///   Qualifica del membro
        /// </summary>
        public string Qualifica { get; set; }

        /// <summary>
        ///   Ruoli che il membro ricopre nella squadra
        /// </summary>
        public ISet<ComponentePartenza.Ruolo> Ruoli { get; set; }

        /// <summary>
        ///   Unità operativa di appartenenza del membro
        /// </summary>
        public string DescrizioneUnitaOperativaDiAppartenenza { get; set; }
    }

    /// <summary>
    ///   Modella la selezione della squadra del DTO
    /// </summary>
    public class SelezioneSquadra
    {
        /// <summary>
        ///   Istante di selezione della squadra.
        /// </summary>
        public DateTime IstanteSelezione { get; private set; }

        /// <summary>
        ///   Operatore che ha effettuato la selezione.
        /// </summary>
        public string Operatore { get; private set; }
    }
}
