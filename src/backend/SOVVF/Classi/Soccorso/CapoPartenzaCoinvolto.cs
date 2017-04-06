namespace Modello.Classi.Soccorso
{
    public class CapoPartenzaCoinvolto
    {
        public enum StatoCapoPartenza
        {
            /// <summary>
            /// </summary>
            InViaggio,

            SulPosto,
            InRientro,
            RientratoInSede
        }

        public string CodiceFiscale { get; set; }

        public StatoCapoPartenza StatoDelCapoPartenza { get; set; }
    }
}
