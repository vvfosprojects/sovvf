using Modello.Classi.Soccorso.Squadre;

namespace Modello.Servizi.GestioneSoccorso
{
    public interface IGetDisponibilitaSquadraByTicket
    {
        DisponibilitaSquadra Get(string ticket);
    }
}
