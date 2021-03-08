using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze
{
    public interface IGetCompetenzeRichiesta
    {
        CompetenzeRichiesta GetCompetenzeRichiesta(string CodSede, string NomeVia, string Civico, string Citta);
    }
}
