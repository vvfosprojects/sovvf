using AutoMapper;
using SimpleInjector;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<RichiestaAssistenza, SintesiRichiesta>().ReverseMap();
            CreateMap<SintesiRichiesta, Intervento>().ReverseMap();
            CreateMap<SintesiRichieste, Intervento>().ReverseMap();
        }
    }
}
