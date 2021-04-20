using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.MongoDTO;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.Utility
{
    public static class MappingAlberaturaDistaccamenti
    {
        public static HashSet<UnitaOperativa> Map(this UnitaOperativa lstSedi)
        {
            var orderedLstSedi = lstSedi.Figli.Select(s =>
            {
                s.Figli = s.Figli.Select(ss =>
                {
                    ss.Figli = ss.Figli.OrderBy(sss => sss.Nome).ToHashSet();

                    return ss;
                }).OrderBy(ss => ss.Nome).ToHashSet();

                return s;
            }).OrderBy(s => s.Nome).ToHashSet();

            return orderedLstSedi;
        }
    }
}
