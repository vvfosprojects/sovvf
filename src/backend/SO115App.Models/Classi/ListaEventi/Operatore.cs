using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ListaEventi
{
    public class Operatore
    {
        public string Id { get; set; }
        public string Nome { get; set; }
        public string Cognome { get; set; }
        public string CodiceFiscale { get; set; }
        public Sede Sede { get; set; }
        public string Username { get; set; }
        public object Password { get; set; }
        public object Ruoli { get; set; }
        public object Token { get; set; }
        public object ValidoDa { get; set; }
        public object ValidoFinoA { get; set; }
        public bool Attivo { get; set; }
        public object Qualifica { get; set; }
    }
}
