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
            var listaPin = GetGerarchia(CodSede);

            var lstCodiciPin = listaPin.Select(c => c.Codice).ToList();
            var lstEnti = _dbContext.RubricaCollection
                .Find(c => lstCodiciPin.Contains(c.CodSede) && c.Descrizione.Contains(TextSearch ?? "")).ToList();

            //GESTIONE RICORSIVITA'
            var result = FiltraByRicorsività(listaPin, lstEnti);

            //RECUPERO LE CATEGORIE
            var lstCodiciCategorie = result.Select(c => c.CodCategoria.ToString()).Distinct().ToArray();
            var lstCategorie = _getCategorieEnte.Get(lstCodiciCategorie);

            //MAPPING
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
            var lstEnti = _dbContext.RubricaCollection.Find(c => lstCodici.Contains(c.Codice)).ToList();

            var listaPin = GetGerarchia(lstEnti.Select(c => c.CodSede).ToArray());

            //GESTIONE RICORSIVITA'
            var result = FiltraByRicorsività(listaPin, lstEnti);

            //RECUPERO LE CATEGORIE
            var lstCodiciCategorie = result.Select(c => c.CodCategoria.ToString()).Distinct().ToArray();
            var lstCategorie = _getCategorieEnte.Get(lstCodiciCategorie);

            //MAPPING
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

        private static List<EnteIntervenuto> FiltraByRicorsività(List<PinNodo> listaPin, List<EnteIntervenuto> lstEnti)
        {
            if (lstEnti.Count > 0)
                return lstEnti.Where(c =>
                {
                    //LOGICA/CONDIZIONI RICORSIVITA'
                    var padre = listaPin.Find(x => x.Codice == c.SiglaProvincia + ".1000");
                    var figli = listaPin.Where(x => x.Codice.Contains(c.SiglaProvincia) && x != padre).ToList();

                    return (padre.Ricorsivo && c.Ricorsivo) || figli.Any(x => x.Ricorsivo);
                }).ToList();
            else
                return lstEnti;
        }

        private List<PinNodo> GetGerarchia(string[] CodSede)
        {
            var listaPin = new List<PinNodo>();
            var sediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            foreach (var sede in CodSede)
            {
                listaPin.Add(new PinNodo(sede, true));
                foreach (var figlio in sediAlberate.GetSottoAlbero(listaPin))
                {
                    PinNodo fgl = new PinNodo(figlio.Codice, true);
                    listaPin.Add(fgl);
                }
            }

            return listaPin;
        }
    }
}
