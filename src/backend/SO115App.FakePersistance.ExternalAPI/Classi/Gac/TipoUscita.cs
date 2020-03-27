using Newtonsoft.Json;

namespace SO115App.ExternalAPI.Fake.Classi.Gac
{
    /// <summary>
    ///   Modello per il tipo di uscito da inviare al servizio GacWeb al compimento della
    ///   movimentazione di un mezzo
    /// </summary>
    public class TipoUscita
    {
        /// <summary>
        ///   il codice della tipologia dell'intervento
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   la descrizione della tipologia
        /// </summary>
        public string Descrizione { get; set; }
    }
}
