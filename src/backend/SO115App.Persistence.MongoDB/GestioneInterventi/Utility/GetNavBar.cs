using Persistence.MongoDB;
using SO115App.API.Models.Classi.NavBar;
using SO115App.Models.Servizi.Infrastruttura.NavBar;

namespace SO115App.Persistence.MongoDB.GestioneInterventi.Utility
{
    class GetNavBar : IGetNavbar
    {
        private readonly DbContext _dBContext;

        public GetNavBar(DbContext dBContext)
        {
            _dBContext = dBContext;
        }

        public Navbar Get()
        {
            //TO DO DA CAPIRE SE VA IMPLEMENTATA

            return null;
        }
    }
}
