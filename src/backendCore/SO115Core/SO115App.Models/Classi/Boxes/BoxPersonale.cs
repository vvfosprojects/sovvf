using System.Collections.Generic;

namespace SO115App.API.Models.Classi.Boxes
{
    public class BoxPersonale
    {
        public int PersonaleTotale { get; set; }

        public List<BoxFunzionariSo> Funzionari { get; set; }

        public int SquadreServizio { get; set; }

        public int SquadreAssegnate { get; set; }
    }

    public class BoxFunzionariSo
    {
        public string CodiceFiscale { get; set; }

        public string Qualifica { get; set; }

        public string Descrizione { get; set; }

        public bool FunGuardia { get; set; }

        public bool TecnicoGuardia1 { get; set; }

        public bool TecnicoGuardia2 { get; set; }

        public bool CapoTurno { get; set; }
    }
}