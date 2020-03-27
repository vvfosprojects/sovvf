using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.API.DataFake.Classi
{
    public class ListaPreaccoppiati
    {
        public string Id { get; set; }
        public string Mezzo { get; set; }
        public string Sede { get; set; }
        public List<string> Squadre { get; set; } 
    }
}
