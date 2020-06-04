using AutoMapper;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperRichiestaAssistenzaSuSintesi
    {
        private IMapper _mapper;
        private readonly IGetTipologieByCodice _getTipologieByCodice;
        private readonly IGetUtenteById _getUtenteById;

        public MapperRichiestaAssistenzaSuSintesi(IMapper mapper, IGetTipologieByCodice getTipologieByCodice, IGetUtenteById getUtenteById)
        {
            _mapper = mapper;
            _getTipologieByCodice = getTipologieByCodice;
            _getUtenteById = getUtenteById;
        }

        public SintesiRichiesta Map(RichiestaAssistenza richiesta)
        {
            try
            {
                var mapConfing = new MapperConfiguration(
                    cfg => cfg.CreateMap<RichiestaAssistenza, SintesiRichiesta>()
                        .ForMember(x => x.CodiceSchedaNue, y => y.MapFrom(z => z.CodNue))
                        .ForMember(x => x.CodiceRichiesta, y => y.MapFrom(z => z.CodRichiesta))
                        .ForMember(x => x.ZoneEmergenza, y => y.MapFrom(z => z.CodZoneEmergenza))
                        .ForMember(x => x.ListaEntiIntervenuti, y => y.MapFrom(z => z.CodEntiIntervenuti))
                        .ForMember(x => x.Tipologie, y => y.MapFrom(_ => _getTipologieByCodice.Get(richiesta.Tipologie)))
                        .ForMember(x => x.Operatore, y => y.MapFrom(_ => _getUtenteById.GetUtenteByCodice(richiesta.CodOperatore)))
                        //.ForMember(x => x.TurnoInserimentoChiamata, y => y.Ignore())
                        .ForMember(x => x.ListaUtentiInLavorazione, y => y.MapFrom(_ => MapUtenteAttivita(richiesta, "L").ToHashSet()))
                        .ForMember(x => x.ListaUtentiPresaInCarico, y => y.MapFrom(_ => MapUtenteAttivita(richiesta, "P").ToHashSet()))
                        );
                _mapper = mapConfing.CreateMapper();
                return _mapper.Map<SintesiRichiesta>(richiesta);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private List<AttivitaUtente> MapUtenteAttivita(RichiestaAssistenza richiesta, string Tipo)
        {
            List<AttivitaUtente> ListaAttivita = new List<AttivitaUtente>();
            if (Tipo.Equals("P"))
            {
                foreach (var evento in richiesta.Eventi)
                {
                    if (evento! is Telefonata)
                    {
                        var utente = _getUtenteById.GetUtenteByCodice(evento.CodiceFonte);

                        AttivitaUtente attivita = new AttivitaUtente()
                        {
                            Nominativo = utente.Nome + " " + utente.Cognome,
                            DataInizioAttivita = evento.Istante,
                            IdUtente = evento.CodiceFonte
                        };

                        if (evento is AnnullamentoPresaInCarico)
                        {
                            var attivitaToDelete = ListaAttivita.Where(x => x.Nominativo.Equals(attivita.Nominativo)).ToList();
                            ListaAttivita.Remove(attivitaToDelete[0]);
                        }
                        else if (ListaAttivita.Where(x => x.Nominativo.Equals(attivita.Nominativo) && x.DataInizioAttivita <= attivita.DataInizioAttivita).ToList().Count > 0)
                        {
                            var attivitaToDelete = ListaAttivita.Where(x => x.Nominativo.Equals(attivita.Nominativo) && x.DataInizioAttivita <= attivita.DataInizioAttivita).ToList();
                            ListaAttivita.Remove(attivitaToDelete[0]);
                            ListaAttivita.Add(attivita);
                        }
                        else
                        {
                            ListaAttivita.Add(attivita);
                        }
                    }
                }
            }
            else
            {
                foreach (var lavorazione in richiesta.UtInLavorazione)
                {
                    AttivitaUtente attivita = new AttivitaUtente()
                    {
                        Nominativo = lavorazione.Replace(".", " ")
                    };
                    ListaAttivita.Add(attivita);
                };
            }

            return ListaAttivita;
        }
    }
}
