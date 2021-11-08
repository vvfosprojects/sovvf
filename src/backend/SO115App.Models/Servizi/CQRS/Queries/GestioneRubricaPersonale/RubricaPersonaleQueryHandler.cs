using CQRS.Queries;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Qualifiche;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Concurrent;
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
        private readonly IGetPercorsoByIdQualifica _getPercorsoByIdQualifica;
        private readonly IGetDettaglioQualificaByIdDipendenteByDate _getDettaglioQualifica;

        public RubricaPersonaleQueryHandler(IGetPersonaleByCF getPersonaleByCF,
            IGetSedeAssociazioniByCodSede getAssociazioniByCodSede,
            IGetIdDipendentiByCodUnitaOrg getIdDipendentiByCodUnitaOrg,
            IGetDettaglioDipendenteById getDettaglioDipendenteById,
            IGetPercorsoByIdQualifica getPercorsoByIdQualifica,
            IGetDettaglioQualificaByIdDipendenteByDate getDettaglioQualifica)
        {
            _getPersonaleByCF = getPersonaleByCF;
            _getAssociazioniByCodSede = getAssociazioniByCodSede;
            _getIdDipendentiByCodUnitaOrg = getIdDipendentiByCodUnitaOrg;
            _getDettaglioDipendenteById = getDettaglioDipendenteById;
            _getPercorsoByIdQualifica = getPercorsoByIdQualifica;
            _getDettaglioQualifica = getDettaglioQualifica;
        }

        public RubricaPersonaleResult Handle(RubricaPersonaleQuery query)
        {
            //OTTENGO I DATI DAI SERVIZI ESTERNI IN PARALLELO
            var lstDettaglio = new ConcurrentQueue<DettaglioDipententeResult>();
            var lstQualifiche = new ConcurrentQueue<DettaglioQualificaResult>();

            Parallel.ForEach(query.IdSede, sede =>
            {
                var lstIdDipendenti = _getAssociazioniByCodSede.GetCodUnitaOrganizzativaByCodSede(sede)
                    .ContinueWith(CodUnita => _getIdDipendentiByCodUnitaOrg.Get(CodUnita.Result)).Result;
                
                Parallel.ForEach(lstIdDipendenti.Result, idDipendente =>
                {
                    lstDettaglio.Enqueue(_getDettaglioDipendenteById.GetTelefonoDipendenteByIdDipendente(idDipendente).Result);
                    lstQualifiche.Enqueue(_getDettaglioQualifica.GetByIdDipendenteByDate(idDipendente, DateTime.Now.ToString("yyyyMMdd")).Result);
                });
            });

            var lstCodiciFiscali = lstDettaglio.Where(d => d?.dati?.codFiscale != null).Select(d => d.dati.codFiscale.ToUpper()).ToArray();

            var lstPersonale = _getPersonaleByCF.Get(lstCodiciFiscali, query.IdSede).Result;

            var result = new ConcurrentQueue<PersonaleRubrica>();

            Parallel.ForEach(lstPersonale, personale =>
            {
                var dettaglioDipendente = lstDettaglio.FirstOrDefault(d => d?.dati?.codFiscale.ToUpper().Equals(personale.codiceFiscale.ToUpper()) ?? false)?.dati;
                var codQualifica = lstQualifiche.FirstOrDefault(q => q.dati.FirstOrDefault()?.idDipendente == dettaglioDipendente?.IdDipentente)?.dati?.FirstOrDefault()?.codQualifica;
                var codComparto = codQualifica != null ? _getPercorsoByIdQualifica.Get(codQualifica).Result?.dati?.CodComparto : null;

                var rubricaPersonale = new PersonaleRubrica()
                {
                    Nominativo = $"{personale.cognome} {personale.nome}",
                    Qualifica = personale.qualifica?.nome,
                    Sede = personale.sede?.descrizione,
                    Specializzazione = string.Concat(personale.specializzazioni?.Select(s => s?.descrizione + ", ")).TrimEnd(',', ' '),
                    Turno = dettaglioDipendente?.codTurno ?? personale.turno,
                    Telefono1 = dettaglioDipendente?.telCellulare,
                    Telefono2 = dettaglioDipendente?.telefonoFisso,
                    Telefono3 = dettaglioDipendente?.fax,
                    Stato = dettaglioDipendente?.oraIngresso == null ? StatoPersonaleRubrica.NonInServizio : StatoPersonaleRubrica.InServizio,
                    Tipo = codComparto == 2 ? TipoPersonaleRubrica.SoloOperativi : TipoPersonaleRubrica.AltroPersonale ?? TipoPersonaleRubrica.AltroPersonale
                };

                result.Enqueue(rubricaPersonale);
            });

            //FILTRI
            var filteredResult = result
                .Where(p =>
                {
                    if (query.Filters?.Search != null) return
                        p.Nominativo.ToLower().Contains(query.Filters.Search.ToLower()) ||
                        p.Qualifica.ToLower().Contains(query.Filters.Search.ToLower()) ||
                        (p.Sede?.ToLower().Contains(query.Filters.Search.ToLower()) ?? false) ||
                        (p.Specializzazione?.ToLower().Contains(query.Filters.Search.ToLower()) ?? false) ||
                        (p.Telefono1?.Contains(query.Filters.Search) ?? false) ||
                        (p.Telefono2?.Contains(query.Filters.Search) ?? false) ||
                        (p.Telefono3?.Contains(query.Filters.Search) ?? false) ||
                        (p.Turno?.ToLower().Contains(query.Filters.Search.ToLower()) ?? false);

                    else return true;
                })
                .Where(p => query.Filters?.Stato?.Equals(p.Stato) ?? true)
                .Where(p => query.Filters?.Tipo?.Equals(p.Tipo) ?? true)
                .OrderBy(p => p.Nominativo);

            //PAGINAZIONE
            return new RubricaPersonaleResult()
            {
                DataArray = filteredResult
                    .Skip(query.Pagination.PageSize * (query.Pagination.Page - 1))
                    .Take(query.Pagination.PageSize).ToList(),

                Pagination = new Classi.Condivise.Paginazione()
                {
                    Page = query.Pagination.Page,
                    PageSize = query.Pagination.PageSize,
                    TotalItems = filteredResult.Count()
                }
            };
        }
    }
}
