using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Emergenza
{
    public class Emergenza
    {
        private List<Evento> _eventi;

        public IEnumerable<Evento> ListaEventi { get { return _eventi.ToArray(); } }

        public Emergenza()
        {
            this._eventi = new List<Evento>();
        }

        public string Id { get; set; }
        public string CodEmergenza { get; set; }
        public string Descrizione { get; set; }
        public Localita Localita { get; set; }
        public string CodComandoRichiedente { get; set; }
        public TipologiaEmergenza Tipologia { get; set; }
        public string CodSedePresaInCarico { get; set; }
        public bool Annullata { get; set; }
        public List<ModuliColonnaMobile> ListaModuli { get; set; }
        public void AddEvento(Evento evento)
        {
            this._eventi.Add(evento);
        }
    }
}
