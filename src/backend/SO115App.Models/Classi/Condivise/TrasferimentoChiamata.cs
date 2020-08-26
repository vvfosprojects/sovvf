using SO115App.API.Models.Classi.Autenticazione;
using System;

namespace SO115App.Models.Classi.Condivise
{
    public class TrasferimentoChiamata
    {
        public string Id { get; set; }

        public string CodRichiesta { get; set; }
        public string CodSedeDa { get; set; }
        public string[] CodSedeA { get; set; }
        public DateTime Data { get; set; }
        public string IdOperatore { get; set; }
    }

    public class TrasferimentoChiamataFull
    {
        public string Id { get; set; }

        public string CodRichiesta { get; set; }
        public string SedeDa { get; set; }
        public string[] SedeA { get; set; }
        public DateTime Data { get; set; }
        public Utente Operatore { get; set; }
    }
}
