using Newtonsoft.Json;

namespace SO115App.Models.Classi.ServiziEsterni.Gac
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
        public string codice { get; set; }

        /// <summary>
        ///   la descrizione della tipologia
        /// </summary>
        public string descrizione { get; set; }
    }
}
