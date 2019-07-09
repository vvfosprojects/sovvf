using AutoMapper;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperSintesiSuIntervento
    {
        private readonly IMapper _mapper;

        public MapperSintesiSuIntervento(IMapper mapper)
        {
            this._mapper = mapper;
        }

        public Intervento Map(SintesiRichiesta richiesta)
        {
            return _mapper.Map<Intervento>(richiesta);
        }
    }
}
