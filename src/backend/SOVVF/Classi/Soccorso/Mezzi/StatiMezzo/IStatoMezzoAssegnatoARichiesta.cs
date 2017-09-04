namespace Modello.Classi.Soccorso.Mezzi.StatiMezzo
{
    /// <summary>
    ///   Modella uno stato in cui il mezzo è assegnato ad una <see cref="RichiestaAssistenza" />.
    /// </summary>
    public interface IStatoMezzoAssegnatoARichiesta : IStatoMezzo
    {
        /// <summary>
        ///   Il codice della <see cref="RichiestaAssistenza" /> a cui il mezzo è assegnato.
        /// </summary>
        string CodiceRichiesta { get; }
    }
}
