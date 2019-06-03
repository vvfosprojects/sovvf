using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.API.Models.Classi.ListaEventi
{
    public class Eventi
    {
        public string Motivazione { get; set; }
        public DateTime Istante { get; set; }
        public string CodiceFonte { get; set; }
        public string CodiceRichiesta { get; set; }
        public string CodiceOrigine { get; set; }
        public string CognomeChiamante { get; set; }
        public string NomeChiamante { get; set; }
        public string NumeroTelefono { get; set; }
        public string RagioneSociale { get; set; }
        public object CodiceSchedaContatto { get; set; }
        public string Codice { get; set; }
        public object NotePubbliche { get; set; }
        public object NotePrivate { get; set; }
        public string Esito { get; set; }
    }
    public class EventiMapper
    {
        public string Id { get; set; }
        public string NomeClasseEvento { get; set; }
        public string IstanteEvento { get; set; }
        public string Targa { get; set; }
        public string Note { get; set; }
        public object HTMLLinkElement { get; set; }
      
    }
}
