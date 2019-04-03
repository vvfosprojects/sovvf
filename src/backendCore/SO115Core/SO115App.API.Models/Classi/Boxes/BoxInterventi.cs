namespace SO115App.API.Models.Classi.Boxes
{
    public class BoxInterventi
    {
        public int Chiamate { get; set; }

        public int Assegnati { get; set; }

        public int Presidiati { get; set; }

        public int Sospesi { get; set; }

        public int Totale { get; set; }
        
        public int TotTurnoCorrente { get; set; }

        public int TotTurnoPrecedente { get; set; }

        public string NomeTurnoCorrente { get; set; }

        public string NomeTurnoPrecedente { get; set; }

        public int AnnoCorrente { get; set; }

        public int TotAnnoCorrente { get; set; }
    }
}