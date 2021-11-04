namespace SO115App.Models.Classi.Emergenza
{
    public class TipologiaEmergenza
    {
        public string Id { get; set; }
        public string[] emergenza { get; set; }
        public MobilitazioniEmergenza moduli { get; set; }
    }

    public class MobilitazioniEmergenza
    {
        public string[] mob_Immediata { get; set; }
        public string[] mob_Pot_Int { get; set; }
        public string[] mob_Consolidamento { get; set; }
    }
}
