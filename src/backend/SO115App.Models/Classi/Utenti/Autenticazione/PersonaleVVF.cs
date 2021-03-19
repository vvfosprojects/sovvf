using System.Collections.Generic;

namespace SO115App.Models.Classi.Utenti.Autenticazione
{
    /// <summary>
    ///   classe che mappa il personale in arrivo da oracle o dai servizi esterni
    /// </summary>
    public class PersonaleVVF
    {
        public string codiceFiscale { get; set; }
        public string nome { get; set; }
        public string cognome { get; set; }
        public string accountDipvvf { get; set; }
        public string emailVigilfuoco { get; set; }
        public QualificaPersonale qualifica { get; set; }
        public DistaccamentoPersonale sede { get; set; }
        public List<Specializzazione> specializzazioni { get; set; }
        public string turno { get; set; }
    }

    public class QualificaPersonale
    {
        public string nome { get; set; }
        public GruppoPersonale gruppo { get; set; }
        public string codice { get; set; }
        public string descrizione { get; set; }
    }

    public class DistaccamentoPersonale
    {
        public string id { get; set; }
        public string codDistaccamento { get; set; }
        public string codice { get; set; }
        public string descrizione { get; set; }
    }

    public class GruppoPersonale
    {
        public string codice { get; set; }
        public string descrizione { get; set; }
    }

    public class Specializzazione
    {
        public string codice { get; set; }
        public string descrizione { get; set; }
    }
}
