namespace Modello.Classi.Soccorso.Squadre
{
    public class SquadraSoccorsoOrdinario : Squadra
    {
        public enum TurnoEnum { A, B, C, D }

        public string CodiceUnitaOperativa { get; set; }

        public int OrdinePartenza { get; set; }

        public TurnoEnum Turno { get; set; }
    }
}
