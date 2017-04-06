namespace Modello.Classi.Soccorso
{
    public class MezzoCoinvolto
    {
        public enum StatoMezzo
        {
            /// <summary>
            /// </summary>
            InViaggio,

            SulPosto,
            InRientro,
            RientratoInSede
        }

        public string CodiceMezzo { get; set; }

        public StatoMezzo StatoDelMezzo { get; set; }
    }
}
