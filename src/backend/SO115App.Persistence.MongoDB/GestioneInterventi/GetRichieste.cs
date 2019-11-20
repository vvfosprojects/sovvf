using AutoMapper;
using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System.Collections.Generic;

namespace SO115App.Persistence.MongoDB
{
    public class GetRichiesta : IGetRichiestaById, IGetListaSintesi
    {
        private readonly DbContext _dbContext;
        private readonly IMapper _mapper;

        public GetRichiesta(DbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public RichiestaAssistenza Get(string idRichiestaAssistenza)
        {
            return _dbContext.RichiestaAssistenzaCollection
                .Find(s => s.Codice == idRichiestaAssistenza)
                .Single();
        }

        public List<SintesiRichiesta> GetListaSintesiRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            var ListaRichiesteAssistenza = _dbContext.RichiestaAssistenzaCollection.Find(Builders<RichiestaAssistenza>.Filter.Empty).ToList();

            MapperRichiestaAssistenzaSuSintesi mapSintesi = new MapperRichiestaAssistenzaSuSintesi(_mapper);

            var ListaSistesiRichieste = new List<SintesiRichiesta>();

            foreach (RichiestaAssistenza richiesta in ListaRichiesteAssistenza)
            {
                SintesiRichiesta sintesi = new SintesiRichiesta();

                sintesi = mapSintesi.Map(richiesta);

                ListaSistesiRichieste.Add(sintesi);
            }

            return ListaSistesiRichieste;
        }
    }
}
