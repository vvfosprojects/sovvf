using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneRubrica.Enti
{
    public class GetRubrica : IGetRubrica
    {
        private readonly DbContext _dbContext;
        private readonly IGetSottoSediByCodSede _getSottoSedi;
        private readonly GetGerarchiaToSend _getRicorsivita;
        private readonly IGetEnteCategorie _getCategorieEnte;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetSedi _getSedi;

        public GetRubrica(DbContext dbContext, IGetEnteCategorie getCategorieEnte, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative, IGetSedi getSedi, IGetSottoSediByCodSede getSottoSedi)
        {
            _dbContext = dbContext;
            _getCategorieEnte = getCategorieEnte;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getSedi = getSedi;
            _getSottoSedi = getSottoSedi;
            _getRicorsivita = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
        }

        private static List<EnteIntervenuto> FiltraByRicorsività(List<PinNodo> listaPin, List<EnteIntervenuto> lstEnti, string codSede = null)
        {
            if (lstEnti.Count <= 0 || codSede == "00")
                return lstEnti;

            return lstEnti.Where(e =>
            {
                bool ricorsivo = e.Ricorsivo && listaPin.Select(p => p.Codice).Contains(e.CodSede);
                bool proprietario = codSede != null && e.CodSede.Equals(codSede);

                return ricorsivo || proprietario;
            }).ToList();
        }

        private List<PinNodo> GetGerarchia(string[] CodSede)
        {
            var listaPin = _getSottoSedi.Get(CodSede).Select(p => new PinNodo(p, true)).ToList();

            if (CodSede[0].Contains("."))
            {
                int numeroDist = int.Parse(CodSede[0].Split('.')[1]);
                string provincia = CodSede[0].Split('.')[0].ToString();

                if (numeroDist > 1000)
                {// DISTACCAMENTO - RM.1002
                    listaPin = listaPin;
                }
                else
                {// COMANDO - RM.1000
                    listaPin = listaPin.Where(p => p.Codice.Contains(provincia)).ToList();
                }
            }
            else if (CodSede[0] != "00")
            {// DIREZIONE REGIONALE - 10
                listaPin = listaPin.Where(p => p.Codice.Contains(".")).ToList();
                listaPin.Add(new PinNodo(CodSede[0], true));
                listaPin.Add(new PinNodo("00", true));
            }
            else
            {// CON - 00
                listaPin = null;
                listaPin.Add(new PinNodo(CodSede[0], true));
            }

            return listaPin;
        }

        public List<EnteDTO> Get(string[] CodSede, string TextSearch)
        {
            var listaPin = GetGerarchia(CodSede);

            var lstCodiciPin = listaPin.Select(c => c.Codice).ToList();
            var lstEnti = _dbContext.RubricaCollection.Find(Builders<EnteIntervenuto>.Filter.In(p => p.CodSede, lstCodiciPin)).ToList();

            //GESTIONE RICORSIVITA'
            var lstEntiFiltrati = FiltraByRicorsività(listaPin, lstEnti, CodSede[0]);

            //RECUPERO LE CATEGORIE
            var lstCodiciCategorie = lstEntiFiltrati.Select(c => c.CodCategoria.ToString()).Distinct().ToArray();
            var lstCategorie = _getCategorieEnte.Get(lstCodiciCategorie);

            //FILTRO RICERCA
            var text = TextSearch?.ToLower() ?? "";
            var result = lstEntiFiltrati.Where(c => c.Descrizione.ToLower().Contains(text)).ToList();

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
