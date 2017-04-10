namespace Modello.Classi.Soccorso.StatiMezzo
{
    /// <summary>
    ///   Stati in cui un mezzo partecipante ad una richiesta può trovarsi
    /// </summary>
    public interface IStatoMezzo
    {
        bool Disponibile { get; }
    }
}
