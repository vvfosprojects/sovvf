using CQRS.Queries;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Qualifiche;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
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
        private readonly IGetPersonaleVVF _getPersonaleVVF;

        public RubricaPersonaleQueryHandler(IGetPersonaleByCF getPersonaleByCF,
            IGetSedeAssociazioniByCodSede getAssociazioniByCodSede,
            IGetIdDipendentiByCodUnitaOrg getIdDipendentiByCodUnitaOrg,
            IGetDettaglioDipendenteById getDettaglioDipendenteById,
            IGetPercorsoByIdQualifica getPercorsoByIdQualifica,
            IGetDettaglioQualificaByIdDipendenteByDate getDettaglioQualifica,
            IGetPersonaleVVF getPersonaleVVF)
        {
            _getPersonaleByCF = getPersonaleByCF;
            _getAssociazioniByCodSede = getAssociazioniByCodSede;
            _getIdDipendentiByCodUnitaOrg = getIdDipendentiByCodUnitaOrg;
            _getDettaglioDipendenteById = getDettaglioDipendenteById;
            _getPercorsoByIdQualifica = getPercorsoByIdQualifica;
            _getDettaglioQualifica = getDettaglioQualifica;
            _getPersonaleVVF = getPersonaleVVF;
        }

        public RubricaPersonaleResult Handle(RubricaPersonaleQuery query)
        {
            var lstPersonale = _getPersonaleVVF.GetByCodiceSede(query.IdSede);
            var lstAnagraficaPersonaleVVF = _getPersonaleVVF.GetAnagraficaPersonale(query.IdSede);

            var result = new ConcurrentQueue<PersonaleRubrica>();
            Parallel.ForEach(lstPersonale, personale =>
            {
                var contatti = lstAnagraficaPersonaleVVF.Find(p => p.codiceFiscale.Equals(personale.codiceFiscale)).contatti;

                var rubricaPersonale = new PersonaleRubrica()
                {
                    Nominativo = $"{personale.cognome} {personale.nome}",
                    Qualifica = personale.qualifica?.nome,
                    Sede = personale.sede?.descrizione,
                    Specializzazione = string.Concat(personale.specializzazioni?.Select(s => s?.descrizione + ", ")).TrimEnd(',', ' '),
                    Turno = personale.turno,
                    Telefono1 = contatti.Count() > 0 ? contatti[0] : "",
                    Telefono2 = contatti.Count() > 1 ? contatti[1] : "",
                    Telefono3 = contatti.Count() > 0 ? contatti[0] : "",
                    Stato = null, //dettaglioDipendente?.oraIngresso == null ? StatoPersonaleRubrica.NonInServizio : StatoPersonaleRubrica.InServizio,
                    Tipo = personale.tipoPersonale.codice == "2" ? TipoPersonaleRubrica.SoloOperativi : TipoPersonaleRubrica.AltroPersonale ?? TipoPersonaleRubrica.AltroPersonale
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
                DataArray = filteredResult.Skip(query.Pagination.PageSize * (query.Pagination.Page - 1))
                    .Take(query.Pagination.PageSize).ToList(),

                Pagination = new Classi.Condivise.Paginazione()
                {
                    Page = query.Pagination.Page,
                    PageSize = query.Pagination.PageSize,
                    TotalItems = lstPersonale.Count()
                }
            };
        }
    }
}
