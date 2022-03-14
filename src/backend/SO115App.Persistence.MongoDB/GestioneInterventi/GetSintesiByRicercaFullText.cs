using MongoDB.Bson;
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
using System.Text.RegularExpressions;

namespace SO115App.Persistence.MongoDB.GestioneInterventi
{
    public class GetSintesiByRicercaFullText : IRicercaFullText
    {
        private readonly DbContext _dbContext;
        private readonly IGetSottoSediByCodSede _getSottoSediByCodSede;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoUC;
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;
        private readonly IGetSedi _getSedi;

        public GetSintesiByRicercaFullText(DbContext dbContext,
                                           IGetSottoSediByCodSede getSottoSediByCodSede,
                                           IGetDistaccamentoByCodiceSedeUC getDistaccamentoUC,
                                           IMapperRichiestaSuSintesi mapperSintesi,
                                           IGetSedi getSedi)
        {
            _dbContext = dbContext;
            _getSottoSediByCodSede = getSottoSediByCodSede;
            _getDistaccamentoUC = getDistaccamentoUC;
            _mapperSintesi = mapperSintesi;
            _getSedi = getSedi;
        }

        public List<SintesiRichiesta> GetListaSintesi(string[] CodSede, string TextToSearch)
        {
            var listaCodiciSediInteressate = _getSottoSediByCodSede.Get(CodSede);

            var filtroSediCompetenti = Builders<RichiestaAssistenza>.Filter
                .In(richiesta => richiesta.CodSOCompetente, listaCodiciSediInteressate);

            var filtroFullText = Builders<RichiestaAssistenza>.Filter.Text(TextToSearch);
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(c => c.Codice.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(c => c.CodRichiesta.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(c => c.CodSOCompetente.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(d => d.Descrizione.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(i => i.Localita.Indirizzo.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(n => n.Richiedente.Nominativo.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(t => t.Richiedente.Telefono.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(n => n.NotePubbliche.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(n => n.NotePrivate.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(n => n.NoteNue.ToLower(), TextToSearch.ToLower());
            filtroFullText |= Builders<RichiestaAssistenza>.Filter.Regex(t => t.Tags, TextToSearch.ToLower());

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
                 sintesi.Competenze = richiesta.CodUOCompetenza.MapCompetenze(_getSedi);
                 sintesi.SediAllertate = richiesta.CodSOAllertate != null ? richiesta.CodSOAllertate.ToArray().MapCompetenze(_getSedi) : null;
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
    }
}
