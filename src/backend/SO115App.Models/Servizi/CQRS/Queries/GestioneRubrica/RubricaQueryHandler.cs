using CQRS.Queries;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica
{
    public class RubricaQueryHandler : IQueryHandler<RubricaQuery, RubricaResult>
    {
        private readonly IGetRubrica _getRurbica;
        private readonly IGetEnteCategorie _getCategorieEnte;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetListaDistaccamentiByCodiceSede _getListaDistaccamentiByCodiceSede;
        public RubricaQueryHandler(IGetRubrica getRurbica, IGetEnteCategorie getCategorieEnte, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative, IGetListaDistaccamentiByCodiceSede getListaDistaccamentiByCodiceSede)
        {
            _getRurbica = getRurbica;
            _getCategorieEnte = getCategorieEnte;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getListaDistaccamentiByCodiceSede = getListaDistaccamentiByCodiceSede;
        }

        public RubricaResult Handle(RubricaQuery query)
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




            var result = _getRurbica.Get(query.IdSede, true); //TODO MANCA LOGICA RICORSIVITA'

            var lstCodiciCategorie = result.Select(c => c.CodCategoria.ToString()).Distinct().ToArray();

            var lstCategorie = _getCategorieEnte.Get(lstCodiciCategorie);

            //MAPPING
            return new RubricaResult()
            {
                Rubrica = result.Select(c => new EnteDTO()
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
                }).ToList()
            };
        }
    }
}
