using AutoMapper;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.CustomMapper.Profili
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<RichiestaAssistenza, SintesiRichiesta>().ReverseMap();
            CreateMap<SintesiRichiesta, Intervento>().ReverseMap();
        }
    }
}
