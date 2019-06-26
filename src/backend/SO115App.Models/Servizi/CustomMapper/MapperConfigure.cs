using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperConfigure
    {
        public MapperConfiguration Configure()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfiles>();
            });
            return config;
        }
    }
}
