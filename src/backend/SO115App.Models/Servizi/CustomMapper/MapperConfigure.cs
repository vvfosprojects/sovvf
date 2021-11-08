using AutoMapper;

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
