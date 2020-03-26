using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.API.DataFake.Classi
{
    public class ListaSquadre
    {
        public string CodiceSquadra { get; set; }
        public string NomeSquadra { get; set; }
        public string Sede { get; set; }
        public string Stato { get; set; }

        // public List<string> ListaCodiciFiscaliComponentiSquadra { get; set; }
        public List<ComponenteSquadra> ComponentiSquadra { get; set; }
    }
}
