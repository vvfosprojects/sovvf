using System.Collections.Generic;
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre.ResultDTO
{
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
}
