using AutoMapper;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperRichiestaAssistenzaSuSintesi
    {
        private IMapper _mapper;

        public MapperRichiestaAssistenzaSuSintesi(IMapper mapper)
        {
            _mapper = mapper;
        }

        public SintesiRichiesta Map(RichiestaAssistenza richiesta)
        {
            try
            {
                var mapConfing = new MapperConfiguration(
                    cfg => cfg.CreateMap<RichiestaAssistenza, SintesiRichiesta>()
                        .ForMember(x => x.CodiceSchedaNue, y => y.MapFrom(z => z.CodNue))
                        
                        .ForMember(x => x.ListaEntiIntervenuti, y => y.MapFrom(z => z.CodEntiIntervenuti))
                        .ForMember(x => x.Tipologie, y => y.Ignore())
                        .ForMember(x => x.Operatore, y => y.Ignore())
                        .ForMember(x => x.TurnoInserimentoChiamata, y => y.Ignore())
                        .ForMember(x => x.ListaUtentiInLavorazione, y => y.Ignore())
                        .ForMember(x => x.ListaUtentiPresaInCarico, y => y.Ignore())
                        );
                _mapper = mapConfing.CreateMapper();
                return _mapper.Map<SintesiRichiesta>(richiesta);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
