using System.Collections.Generic;

namespace SO115App.Models.Classi.ServiziEsterni.IdentityManagement
{
    public class PersonaFisica
    {
        public List<Dati> Dati { get; set; }
    }

    public class Dati
    {
        public string Cognome { get; set; }
        public string Nome { get; set; }
        public string DtNascita { get; set; }
        public string Sesso { get; set; }
        public string CodProvincia { get; set; }
        public string CodComune { get; set; }
        public string DtCertificazione { get; set; }
        public string DtMancataCertificazione { get; set; }
        public string DtIns { get; set; }
        public string User { get; set; }
        public string CodFiscale { get; set; }
    }
}
