using System;

namespace SO115App.API.Models.Classi.Utenti
{
    public class TurnoExtra
    {
        public TurnoExtra(string PrefissoTurno,string DescrizioneTurno,DateTime DataOraInizioTurnoCorrente,DateTime DataOraFineTurnoCorrente)
        {
            
        }

        public string PrefissoTurno { get; set; }
        public string DescrizioneTurno { get; set; }
        public DateTime DataOraInizioTurnoCorrente { get; set; }
        public DateTime DataOraFineTurnoCorrente { get; set; }
    }
}