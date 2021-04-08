using System;

namespace SO115App.Models.Classi.ServiziEsterni.Rubrica
{
    public class DettaglioDipententeResult
    {
        public Dati dati { get; set; }
    }

    public class Dati
    {

        public string telefonoFisso { get; set; }
        public string telCellulare { get; set; }
        public string fax { get; set; }

        public DateTime? oraIngresso { get; set; }
        public string codFiscale { get; set; }

        public string codTurno { get; set; }
        public string idQualifica { get; set; }
    }
}
