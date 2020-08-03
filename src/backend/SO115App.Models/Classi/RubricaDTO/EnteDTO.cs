using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using System.Collections.Generic;

namespace SO115App.Models.Classi.RubricaDTO
{
    /// <summary>
    ///   DTO di uscita verso il FrontEnd
    /// </summary>
    public class EnteDTO
    {
        public string Id { get; set; }

        /// <summary>
        ///   Codice dell'Ente intervenuto
        /// </summary>
        public int Codice { get; set; }

        /// <summary>
        ///   Descrizione dell'Ente intervenuto ( Es. ACEA )
        /// </summary>
        public string Descrizione { get; set; }

        public string CodSede { get; set; }
        public bool Ricorsivo { get; set; }
        public CategoriaEnte Categoria { get; set; }
        public string Indirizzo { get; set; }
        public string Cap { get; set; }
        public string CodComune { get; set; }
        public string SiglaProvincia { get; set; }
        public string Zona { get; set; }
        public string NoteEnte { get; set; }
        public string Email { get; set; }
        public List<EnteTelefoni> Telefoni { get; set; }
    }
}
