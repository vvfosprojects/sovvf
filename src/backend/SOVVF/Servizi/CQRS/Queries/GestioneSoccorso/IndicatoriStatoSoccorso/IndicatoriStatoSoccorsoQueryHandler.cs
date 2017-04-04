using System;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.ResultDTO;
using System.Collections.Generic;
using Modello.Servizi.Infrastruttura.Organigramma;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso
{
    public class IndicatoriStatoSoccorsoQueryHandler : IQueryHandler<IndicatoriStatoSoccorsoQuery, IndicatoriStatoSoccorsoResult>
    {
        private readonly IGetNodiFigliPerCodiceUnitaOperativa getNodiFigliPerCodiceUnitaOperativa;

        public IndicatoriStatoSoccorsoResult Handle(IndicatoriStatoSoccorsoQuery query)
        {
            var listaCodiciUnitaOperative = new HashSet<string>();
            foreach (var nodo in query.NodiOrganigramma)
            {
                if (nodo.Ricorsivo)
                {
                    var nodi = getNodiFigliPerCodiceUnitaOperativa.Get(nodo.CodiceUnitaOperativa);
                    foreach (var singoloNodo in nodi)
                    {
                        listaCodiciUnitaOperative.Add(singoloNodo.Codice);
                    }
                }
                else
                {
                    listaCodiciUnitaOperative.Add(nodo.CodiceUnitaOperativa);
                }
            }
            // estrarre le richieste di assistenza relative alle Unità Operative interessate

            // calcolare i valori degli indicatori.
        }
    }
}
