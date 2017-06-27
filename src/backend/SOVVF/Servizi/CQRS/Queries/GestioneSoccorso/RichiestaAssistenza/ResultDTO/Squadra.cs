namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.RichiestaAssistenza.ResultDTO
{
    /// <summary>
    ///   Modella la squadra
    /// </summary>
    public class Squadra
    {
        public string Nome { get; set; }
        public Componente[] Componenti { get; set; }
    }
}
