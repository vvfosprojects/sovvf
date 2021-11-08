using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ServiziEsterni.Statri
{
    public class PersonaSO115
    {
        public virtual string CodiceFiscale { get; set; }
        public virtual string Cognome { get; set; }
        public virtual string Nome { get; set; }
        public virtual int CodiceQualifica { get; set; }
        public virtual Boolean CapoSquadra { get; set; }
        public virtual Boolean Autista { get; set; }
    }
}
