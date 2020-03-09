using System;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Classi.DTOFake
{
    /// <summary> La classe che mappa i dati in arrivo dal file fake ListaSqaudre </summary> </summary>
    public class SquadraFake
    {
        public string CodiceSquadra { get; set; }
        public string NomeSquadra { get; set; }
        public string Sede { get; set; }
        public string Stato { get; set; }
        public List<string> ListaCodiciFiscaliComponentiSquadra { get; set; }
    }
}
