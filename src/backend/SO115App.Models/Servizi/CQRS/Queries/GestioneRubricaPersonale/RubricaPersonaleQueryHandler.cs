using CQRS.Queries;
using Newtonsoft.Json;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneRubricaPersonale
{
    public class RubricaPersonaleQueryHandler : IQueryHandler<RubricaPersonaleQuery, RubricaPersonaleResult>
    {
        private readonly IGetPersonaleByCF _getPersonaleByCF;
        private readonly IGetSedeAssociazioniByCodSede _getAssociazioniByCodSede;
        private readonly IGetIdDipendentiByCodUnitaOrg _getIdDipendentiByCodUnitaOrg;
        private readonly IGetDettaglioDipendenteById _getDettaglioDipendenteById;

        public RubricaPersonaleQueryHandler(IGetPersonaleByCF getPersonaleByCF,
            IGetSedeAssociazioniByCodSede getAssociazioniByCodSede,
            IGetIdDipendentiByCodUnitaOrg getIdDipendentiByCodUnitaOrg,
            IGetDettaglioDipendenteById getDettaglioDipendenteById)
        {
            _getPersonaleByCF = getPersonaleByCF;
            _getAssociazioniByCodSede = getAssociazioniByCodSede;
            _getIdDipendentiByCodUnitaOrg = getIdDipendentiByCodUnitaOrg;
            _getDettaglioDipendenteById = getDettaglioDipendenteById;
        }

        public RubricaPersonaleResult Handle(RubricaPersonaleQuery query)
        {

            //string json;
            //using (var r = new StreamReader(Costanti.ListaSquadre)) json = r.ReadToEnd();

            //var listaSquadreJson = JsonConvert.DeserializeObject<IEnumerable<SquadraFake>>(json);

            //var lstcodicifiscali = listaSquadreJson
            //    .Where(c => query.IdSede.Any(s => c.Sede.Contains(s.Substring(0, 2))))
            //    .SelectMany(c => c.ComponentiSquadra)
            //    .Select(c => c.CodiceFiscale)
            //    .Distinct()
            //    .ToArray();


            var lstDettaglio = new ConcurrentQueue<DettaglioDipententeResult>();

            Parallel.ForEach(query.IdSede, sede =>
            {
                var lstIdDipendenti = _getAssociazioniByCodSede.GetCodUnitaOrganizzativaByCodSede(sede)
                .ContinueWith(CodUnita => _getIdDipendentiByCodUnitaOrg.Get(CodUnita.Result)).Result;

                Parallel.ForEach(lstIdDipendenti.Result, idDipendente =>
                    lstDettaglio.Enqueue(_getDettaglioDipendenteById.GetTelefonoDipendenteByIdDipendente(idDipendente).Result));
            });

            var lstPersonale = _getPersonaleByCF.Get(lstDettaglio.Select(d => d?.dati?.codFiscale).ToArray(), query.IdSede);

            var result = new ConcurrentQueue<PersonaleRubrica>();

            Parallel.ForEach(lstPersonale.Result, personale =>
            {
                var dettaglio = lstDettaglio.FirstOrDefault(d => d.dati.codFiscale == personale.codiceFiscale)?.dati;

                var rubricaPersonale = new PersonaleRubrica()
                {
                    Nominativo = $"{personale.cognome} {personale.nome}",
                    Qualifica = personale.qualifica?.descrizione,
                    Sede = personale.sede?.id,
                    Specializzazione = string.Concat(personale.specializzazioni?.Select(s => s?.descrizione + ", ")).TrimEnd(',', ' '),
                    Turno = personale.turno,
                    Telefono1 = dettaglio?.telCellulare,
                    Telefono2 = dettaglio?.telefonoFisso,
                    Telefono3 = dettaglio?.fax,
                    Stato = dettaglio?.oraIngresso == null ? "Non in servizio" : "In Servizio",
                };

                result.Enqueue(rubricaPersonale);
            });

            //FILTRI
             

            //PAGINAZIONE
            return new RubricaPersonaleResult()
            {
                DataArray = result.OrderBy(p => p.Nominativo)
                    .Skip(query.Pagination.PageSize * (query.Pagination.Page - 1))
                    .Take(query.Pagination.PageSize).ToList(),

                Pagination = new Classi.Condivise.Paginazione()
                {
                    Page = query.Pagination.Page,
                    PageSize = query.Pagination.PageSize,
                    TotalItems = result.Count
                }
            };
        }
    }
}
