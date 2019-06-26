using AutoMapper;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace SO115App.Models.Servizi.CustomMapper
{
    internal class MapperRichiestaAssistenzaSuSintesi
    {
        private readonly IMapper _mapper;

        public MapperRichiestaAssistenzaSuSintesi(IMapper mapper)
        {
            this._mapper = mapper;
        }

        public SintesiRichiesta Map(RichiestaAssistenza richiesta)
        {
            return _mapper.Map<SintesiRichiesta>(richiesta);
        }
    }
}
