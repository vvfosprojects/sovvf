using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneRubrica.Enti
{
    public class GetRubrica : IGetRubrica
    {
        private readonly DbContext _dbContext;
        private readonly IGetEnteCategorie _getCategorieEnte;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GetRubrica(DbContext dbContext, IGetEnteCategorie getCategorieEnte, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _dbContext = dbContext;
            _getCategorieEnte = getCategorieEnte;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        public List<EnteDTO> Get(string[] CodSede, string TextSearch)
        {
            var listaPin = new List<PinNodo>();
            var sediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            //var distaccamento = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(query.IdSede.First());

            foreach (var sede in CodSede)
            {
                listaPin.Add(new PinNodo(sede, true));
                foreach (var figlio in sediAlberate.GetSottoAlbero(listaPin))
                {
                    PinNodo fgl = new PinNodo(figlio.Codice, true);
                    listaPin.Add(fgl);
                }
            }

            List<EnteIntervenuto> result = _dbContext.RubricaCollection.Find(x => listaPin.Any(e => e.Codice.Contains(x.CodSede))).ToList();

            var lstCodiciCategorie = result.Select(c => c.CodCategoria.ToString()).Distinct().ToArray();

            var lstCategorie = _getCategorieEnte.Get(lstCodiciCategorie);

            return result.Select(c => new EnteDTO()
            {
                Id = c.Id,
                Codice = c.Codice,
                Cap = c.Cap,
                Categoria = lstCategorie.Find(z => c.CodCategoria.ToString() == z.Codice),
                CodComune = c.CodComune,
                CodSede = c.CodSede,
                Descrizione = c.Descrizione,
                Email = c.Email,
                Indirizzo = c.Indirizzo,
                NoteEnte = c.NoteEnte,
                Ricorsivo = c.Ricorsivo,
                SiglaProvincia = c.SiglaProvincia,
                Telefoni = c.Telefoni,
                Zona = c.Zona
            }).ToList();
        }

        public List<EnteDTO> GetBylstCodici(int[] lstCodici)
        {
            var listaPin = new List<PinNodo>();
            var sediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            //var distaccamento = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(query.IdSede.First());

            //foreach (var ruolo in command.Ruoli)
            //{
            //listaPin.Add(new PinNodo(ruolo.CodSede, ruolo.Ricorsivo));
            //foreach (var figli in sediAlberate.GetSottoAlbero(listaPin))
            //{
            //    if (figli.Codice.Equals(ruolo.CodSede))
            //    {
            //        ruolo.DescSede = figli.Nome;
            //    }
            //}
            //}

            List<EnteIntervenuto> result = _dbContext.RubricaCollection.Find(c => lstCodici.Contains(c.Codice)).ToList();

            var lstCodiciCategorie = result.Select(c => c.CodCategoria.ToString()).Distinct().ToArray();

            var lstCategorie = _getCategorieEnte.Get(lstCodiciCategorie);

            return result.Select(c => new EnteDTO()
            {
                Id = c.Id,
                Codice = c.Codice,
                Cap = c.Cap,
                Categoria = lstCategorie.Find(z => c.CodCategoria.ToString() == z.Codice),
                CodComune = c.CodComune,
                CodSede = c.CodSede,
                Descrizione = c.Descrizione,
                Email = c.Email,
                Indirizzo = c.Indirizzo,
                NoteEnte = c.NoteEnte,
                Ricorsivo = c.Ricorsivo,
                SiglaProvincia = c.SiglaProvincia,
                Telefoni = c.Telefoni,
                Zona = c.Zona
            }).ToList();
        }
    }
}
