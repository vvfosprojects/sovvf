using AutoMapper;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperRichiestaAssistenzaSuSintesi
    {
        private readonly IMapper _mapper;

        public MapperRichiestaAssistenzaSuSintesi(IMapper mapper)
        {
            _mapper = mapper;
        }

        public SintesiRichiesta Map(RichiestaAssistenza richiesta)
        {
            try
            {
                return _mapper.Map<SintesiRichiesta>(richiesta);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
