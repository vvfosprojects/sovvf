namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.QueryDTO
{
    /// <summary>
    ///   Indica un nodo dell'organigramma e la necessità o meno di considerare anche tutti i nodi figli
    /// </summary>
    public class Nodo
    {
        /// <summary>
        ///   E' il codice dell'unità operativa
        /// </summary>
        public string CodiceUnitaOperativa { get; set; }

        /// <summary>
        ///   Indica se va considerato l'intero sottoalbero del nodo
        /// </summary>
        public bool Ricorsivo { get; set; }

        /// <summary>
        ///   Per la classe, un Nodo è uguale ad un altro Nodo se hanno lo stesso codice unità operativa
        /// </summary>
        /// <param name="obj">Oggetto da confrontare</param>
        /// <returns>true se il nodo passato è uguale</returns>
        public override bool Equals(object obj)
        {
            if (!(obj is Nodo))
            {
                return false;
            }

            var n = (Nodo)obj;
            return n.CodiceUnitaOperativa.Equals(this.CodiceUnitaOperativa);
        }

        /// <summary>
        ///   Restituisce l'hascode del codice unità operativa
        /// </summary>
        /// <returns>Hashcode dell'istanza</returns>
        public override int GetHashCode()
        {
            return this.CodiceUnitaOperativa.GetHashCode();
        }
    }
}
