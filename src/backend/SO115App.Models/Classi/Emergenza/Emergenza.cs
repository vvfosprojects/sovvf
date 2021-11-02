using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Emergenza
{
    public class Emergenza
    {
        private List<Evento> _eventi;

        public Emergenza(string codEmergenza, Localita localita,
                         string codComandoRichiedente,
                         TipologieEmergenza tipologia)
        {
            CodEmergenza = codEmergenza;
            Localita = localita;
            CodComandoRichiedente = codComandoRichiedente;
            Tipologia = tipologia;
            _eventi = new List<Evento>();
        }

        public string Id { get; set; }
        public string CodEmergenza { get; set; }
        public string Descrizione { get; set; }
        public Localita Localita { get; set; }
        public string CodComandoRichiedente { get; set; }
        public TipologieEmergenza Tipologia { get; set; }
        public PresaInCarico PresaInCarico { get; set; }

        public List<Evento> Eventi
        {
            get
            {
                return this._eventi;
            }
        }

        public void AddEvento(Evento evento)
        {
            this._eventi.Add(evento);
        }
    }

    public enum TipologieEmergenza
    {
        Terremoto,
        Alluvione
    }

    public enum PresaInCarico
    {
        Con,
        DirezioneRegionale
    }
}
