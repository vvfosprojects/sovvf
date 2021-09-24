using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi.Partenze;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneInterventi
{
    public class CheckCongruitaPartenze : ICheckCongruitaPartenze
    {
        private readonly DbContext _dbContext;
        public CheckCongruitaPartenze(DbContext dbContext) => _dbContext = dbContext;
        
        public bool CheckCongruenza(CambioStatoMezzo cambioStatoMezzo)
        {
            var lstRichiesteMezzo = _dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Where(r => r.TestoStatoRichiesta != "C")).ToList();

            var lstMovimentiPartenza = lstRichiesteMezzo
                .SelectMany(r => r.ListaEventi.OfType<AbstractPartenza>()
                .Where(p =>
                {
                    return p.CodiceMezzo.Equals(cambioStatoMezzo.CodMezzo) && !(p is RichiestaSoccorsoAereo);
                })
                .GroupBy(p => p.CodicePartenza));

            foreach (var movimentiPartenza in lstMovimentiPartenza)
            {
                var min = movimentiPartenza.Select(p => p.Istante).Min();
                var max = movimentiPartenza.Select(p => p.Istante).Max();

                if (cambioStatoMezzo.Istante >= min && cambioStatoMezzo.Istante <= max)
                    throw new Exception($"Il mezzo {cambioStatoMezzo.CodMezzo} risulta occupato alle ore {cambioStatoMezzo.Istante.ToLongTimeString()}.");
            }

            return true;
        }
    }
}
