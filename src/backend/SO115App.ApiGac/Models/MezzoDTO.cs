using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiGac.Models
{
    public class MezzoDTO
    {
        /// <summary>
        ///   Codice del mezzo
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Codice del radio trasmittente
        /// </summary>
        public string IdRadio { get; set; }

        /// <summary>
        ///   Codice della sim per il sistema di tracking
        /// </summary>
        public string ICCID { get; set; }

        /// <summary>
        ///   Descrizione del mezzo
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Genere del mezzo
        /// </summary>
        public string Genere { get; set; }

        /// <summary>
        ///   Stato del mezzo
        /// </summary>
        public Movimentazione Movimentazione { get; set; }

        /// <summary>
        ///   Appartenenza del mezzo
        /// </summary>
        public int Appartenenza { get; set; }

        /// <summary>
        ///   Indica il distaccamento del mezzo
        /// </summary>
        public Sede Distaccamento { get; set; }

        /// <summary>
        ///   Descrizione dell'appartenenza del mezzo
        /// </summary>
        public string DescrizioneAppartenenza { get; set; }

        /// <summary>
        ///   Descrizione dello stato del mezzo
        /// </summary>
        public string DescrizioneStato { get; set; }

        /// <summary>
        ///   Stato efficenza del mezzo
        /// </summary>
        public int StatoEfficenza { get; set; }

        /// <summary>
        ///   Descrizione dello Stato efficenza del mezzo
        /// </summary>
        public string DescrizioneStatoEfficenza { get; set; }

        /// <summary>
        ///   Indica il livello del carburante del mezzo
        /// </summary>
        public int LivelloCarburante { get; set; }

        /// <summary>
        ///   descrive il livello del carburante del mezzo
        /// </summary>
        public string DescrizioneLivelloCarburante { get; set; }

        /// <summary>
        ///   Indica il livello dell'estinguente del mezzo
        /// </summary>
        public int LivelloEstinguente { get; set; }

        /// <summary>
        ///   descrive il livello dell'estinguente del mezzo
        /// </summary>
        public string DescrizioneLivelloEstinguente { get; set; }
    }
}
