using SO115App.Models.Classi.Concorrenza;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza
{
    public interface IDeleteAllBlocks
    {
        public void DeleteAll(string IdOperatore);
    }
}
