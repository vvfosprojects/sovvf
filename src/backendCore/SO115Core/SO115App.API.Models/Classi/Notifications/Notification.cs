namespace SO115App.API.Models.Classi.Notifications
{
    public class Notification
    {
        public string user { get; set; }

		public string message { get; set; }

		public string room { get; set; }

        public string[] listRoomToReceve { get; set; }

        public string group { get; set; }

        public string oraInvio { get; set; }

        public int id { get; set; }
    }
}