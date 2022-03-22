using System;

namespace SO115App.Models.Classi.ServiziEsterni.Rubrica
{
    public class DettaglioDipententeResult
    {
        public DatiDipendente dati { get; set; }
    }

    public class DatiDipendente
    {
        public string idDipendente { get; set; }

        public string telefonoFisso { get; set; }
        public string telCellulare { get; set; }
        public string fax { get; set; }
        public DateTime? oraIngresso { get; set; }
        public string codFiscale { get; set; }
        public string codTurno { get; set; }
    }
}
