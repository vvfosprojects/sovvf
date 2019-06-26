using AutoMapper;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperSintesiSuIntervento
    {
        private readonly IMapper _mapper;

        public MapperSintesiSuIntervento(IMapper mapper)
        {
            this._mapper = mapper;
        }

        public Intervento Map(SintesiRichieste richiesta)
        {
            return _mapper.Map<Intervento>(richiesta);
        }
    }
}
