using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Autenticazione
{
    /// <summary>
    ///   Modella un utente del sistema.
    /// </summary>
    public class Utente
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="username">La username associata all'utente</param>
        /// <remarks>L'utenza viene create per default con il flag attivo impostato a true</remarks>
        public Utente(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                throw new ArgumentException("Cannot be null or whitespace", nameof(username));
            }

            this.Username = username;
            this.Attivo = true;
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="username">La username associata all'utente</param>
        /// <param name="validoFinoA">La data di fine validità dell'utenza</param>
        /// <remarks>La data di inizio validità è il big bang</remarks>
        public Utente(string username, DateTime validoFinoA) : this(username)
        {
            if (validoFinoA == DateTime.MinValue)
            {
                throw new ArgumentOutOfRangeException(nameof(validoFinoA));
            }

            this.ValidoFinoA = validoFinoA;
        }

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// ///
        /// <param name="username">La username associata all'utente</param>
        /// <param name="validoDa">La data di inizio validità dell'utenza</param>
        /// <param name="validoFinoA">La data di fine validità dell'utenza</param>
        public Utente(string username, DateTime validoDa, DateTime validoFinoA) : this(username, validoFinoA)
        {
            if (validoDa == DateTime.MinValue)
            {
                throw new ArgumentOutOfRangeException(nameof(validoDa));
            }

            this.ValidoDa = validoDa;
        }

        public string Username { get; private set; }
        public DateTime? ValidoDa { get; set; }
        public DateTime? ValidoFinoA { get; set; }
        public bool Attivo { get; set; }
    }
}
