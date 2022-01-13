using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SO115App.Persistence.MongoDB.GestioneInterventi
{
    public class GetSintesiByRicercaFullText : IRicercaFullText
    {
        private readonly DbContext _dbContext;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoUC;
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;

        public GetSintesiByRicercaFullText(DbContext dbContext,
                                           IGetSottoSediByCodSede getSottoSediByCodSede,
                                           IGetDistaccamentoByCodiceSedeUC getDistaccamentoUC,
                                           IMapperRichiestaSuSintesi mapperSintesi)
        {
            _dbContext = dbContext;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _getDistaccamentoUC = getDistaccamentoUC;
            _mapperSintesi = mapperSintesi;
        }

        public List<SintesiRichiesta> GetListaSintesi(string[] CodSede, string TextToSearch)
        {
            var listaCodiciSediInteressate = _getSottoSediByCodSede.Get(CodSede);

            var filtroSediCompetenti = Builders<RichiestaAssistenza>.Filter
                .In(richiesta => richiesta.CodSOCompetente, listaCodiciSediInteressate);

            var filtroFullText = Builders<RichiestaAssistenza>.Filter.Text(TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("codice", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("codRichiesta", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("codSOCompetente", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("descrizione", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("indirizzo", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("nominativo", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("telefono", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("notePubbliche", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("notePrivate", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("noteNue", TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex("tags", TextToSearch);

            var indexWildcardTextSearch = new CreateIndexModel<RichiestaAssistenza>(Builders<RichiestaAssistenza>.IndexKeys.Text("$**"));

            List<CreateIndexModel<RichiestaAssistenza>> indexes = new List<CreateIndexModel<RichiestaAssistenza>>();
            indexes.Add(indexWildcardTextSearch);

            _dbContext.RichiestaAssistenzaCollection.Indexes.CreateMany(indexes);
            var listaRichieste = _dbContext.RichiestaAssistenzaCollection.Find(filtroFullText).ToList();

            var listaSistesiRichieste = listaRichieste.Where(richiesta => listaCodiciSediInteressate.Any(s => richiesta.CodUOCompetenza.Any(c => c.Contains(s)))).Select(richiesta =>
             {
                 var rubrica = new List<EnteDTO>();
                 var sintesi = new SintesiRichiesta();
                 sintesi = _mapperSintesi.Map(richiesta);
                 sintesi.Competenze = MapCompetenze(richiesta.CodUOCompetenza);
                 sintesi.SediAllertate = richiesta.CodSOAllertate != null ? MapCompetenze(richiesta.CodSOAllertate.ToArray()) : null;
                 return sintesi;
             });

            return listaSistesiRichieste
                    .Distinct()
                    .OrderByDescending(c => c.Stato.Equals(Costanti.Chiamata) && c.Partenze.Count == 0)
                    .ThenByDescending(c => c.Stato.Equals(Costanti.Chiamata) && c.Partenze.Count > 0)
                    .ThenByDescending(c => c.Stato.Equals(Costanti.RichiestaAssegnata))
                    .ThenByDescending(c => c.Stato.Equals(Costanti.RichiestaPresidiata))
                    .ThenByDescending(c => c.Stato.Equals(Costanti.RichiestaChiusa))
                    .ThenByDescending(x => x.PrioritaRichiesta)
                    .ThenByDescending(x => x.IstanteRicezioneRichiesta)
                    .ToList();
        }

        private List<Sede> MapCompetenze(string[] codUOCompetenza)
        {
            var listaSedi = new List<Sede>();
            int i = 1;
            foreach (var codCompetenza in codUOCompetenza)
            {
                if (i <= 3)
                {
                    var Distaccamento = _getDistaccamentoUC.Get(codCompetenza).Result;
                    Sede sede = Distaccamento == null ? null : new Sede(codCompetenza, Distaccamento.DescDistaccamento, Distaccamento.Indirizzo, Distaccamento.Coordinate);

                    if (sede != null)
                        listaSedi.Add(sede);
                }

                i++;
            }

            return listaSedi;
        }
    }
}
