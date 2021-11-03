namespace SO115App.Models.Classi.Emergenza
{
    public class TipologiaEmergenza
    {
        public string Id { get; set; }
        public string[] Emergenza { get; set; }
        public Interventi[] Interventi { get; set; }
    }

    public class Interventi
    {
        public string[] Mob_Immediata { get; set; }
        public string[] Mob_Pot_Int { get; set; }
        public string[] Mob_Consolidamento { get; set; }
    }
}
