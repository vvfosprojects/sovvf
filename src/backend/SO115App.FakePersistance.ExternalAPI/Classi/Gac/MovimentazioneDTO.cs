using System;

namespace SO115App.ExternalAPI.Fake.Classi.Gac
{
    /// <summary>
    ///   L'oggetto MovimentazioneDTO è l'oggetto che viene passato al servizio GAC per aggiornare
    ///   la movimentazione di un mezzo. Contiene informazioni quali lo stato del mezzo e l'id della
    ///   richiesta a cui il mezzo è associato.
    /// </summary>
    public class MovimentazioneDTO
    {
        /// <summary>
        ///   Id della richiesta a cui è stato associato il mezzo
        /// </summary>
        public string IdRichiesta { get; set; }

        /// <summary>
        ///   identifica lo stato del mezzo
        /// </summary>
        public string StatoOperativo { get; set; }

        /// <summary>
        ///   indica la data in cui è stata associato il mezzo e il suo stato alla richiesta
        /// </summary>
        public DateTime? DataMovimentazione { get; set; }
    }
}
