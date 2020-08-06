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

        private static List<EnteIntervenuto> FiltraByRicorsività(List<PinNodo> listaPin, List<EnteIntervenuto> lstEnti)
        {
            if (lstEnti.Count > 0)
                return lstEnti.Where(c =>
                {
                    //LOGICA/CONDIZIONI RICORSIVITA'
                    var padre = listaPin.Find(x => x.Codice == c.CodSede.Substring(0, 2) + ".1000");
                    var figli = listaPin.Where(x => x.Codice.Contains(c.CodSede.Substring(0, 2)) && x != padre).ToList();

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

        public List<EnteDTO> Get(string[] CodSede, string TextSearch)
        {
            var text = TextSearch?.ToLower();

            var listaPin = GetGerarchia(CodSede);

            var lstCodiciPin = listaPin.Select(c => c.Codice).ToList();
            var lstEnti = _dbContext.RubricaCollection.Find(c => lstCodiciPin.Contains(c.CodSede) 
                && (c.Descrizione.ToLower().Contains(text ?? "") 
                    //|| c.Telefoni.Any(c => c.Numero.ToLower().Contains(text ?? ""))
                    || c.Email.ToLower().Contains(text ?? "") 
                    || c.Indirizzo.ToLower().Contains(text ?? ""))).ToList();

            //GESTIONE RICORSIVITA'
            var result = FiltraByRicorsività(listaPin, lstEnti);

            //RECUPERO LE CATEGORIE
            var lstCodiciCategorie = result.Select(c => c.CodCategoria.ToString()).Distinct().ToArray();
            var lstCategorie = _getCategorieEnte.Get(lstCodiciCategorie);

            //MAPPING E ORDINAMENTO
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
            }).OrderByDescending(c => c.Descrizione).ToList();
        }

        public List<EnteDTO> GetBylstCodici(int[] lstCodici)
        {
            var lstEnti = _dbContext.RubricaCollection.Find(c => lstCodici.Contains(c.Codice)).ToList();

            var listaPin = GetGerarchia(lstEnti.Select(c => c.CodSede).Distinct().ToArray());

            //GESTIONE RICORSIVITA'
            var result = FiltraByRicorsività(listaPin, lstEnti);

            //RECUPERO LE CATEGORIE
            var lstCodiciCategorie = result.Select(c => c.CodCategoria.ToString()).Distinct().ToArray();
            var lstCategorie = _getCategorieEnte.Get(lstCodiciCategorie);

            //MAPPING E ORDINAMENTO
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
            }).OrderByDescending(c => c.Descrizione).ToList();
        }

        /// <summary>
        /// Il metodo pesca DIRETTAMENTE l'oggetto sul db senza considerazioni
        /// </summary>
        public EnteDTO Get(string Id)
        {
            var ente = _dbContext.RubricaCollection.Find(c => c.Id == Id).FirstOrDefault();

            var categoria = _getCategorieEnte.Get(new string[] { ente.CodCategoria.ToString() });

            //MAPPING
            return new EnteDTO()
            {
                Id = ente.Id,
                Codice = ente.Codice,
                Cap = ente.Cap,
                Categoria = categoria.FirstOrDefault(),
                CodComune = ente.CodComune,
                CodSede = ente.CodSede,
                Descrizione = ente.Descrizione,
                Email = ente.Email,
                Indirizzo = ente.Indirizzo,
                NoteEnte = ente.NoteEnte,
                Ricorsivo = ente.Ricorsivo,
                SiglaProvincia = ente.SiglaProvincia,
                Telefoni = ente.Telefoni,
                Zona = ente.Zona
            };
        }

        /// <summary>
        /// Il metodo pesca DIRETTAMENTE l'oggetto sul db senza considerazioni
        /// </summary>
        public int CountBylstCodiciSede(string[] CodSede)
        {
            var result = _dbContext.RubricaCollection.Find(c => CodSede.Contains(c.CodSede)).ToList();

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
            }).Count();
        }
    }
}
