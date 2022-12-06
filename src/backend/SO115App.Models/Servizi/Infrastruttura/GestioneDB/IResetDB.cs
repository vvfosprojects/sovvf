namespace SO115App.Models.Servizi.Infrastruttura.GestioneDB
{
    public interface IResetDB
    {
        public bool Reset();

        public bool ResetUtenti();

        public bool BonificaCodSedeSchedeContatto();
    }
}
