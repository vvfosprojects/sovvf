﻿using AutoMapper;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Soccorso;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CustomMapper
{
    public class MapperRichiestaAssistenzaSuSintesi : IMapperRichiestaSuSintesi
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
                var mapConfing = new MapperConfiguration(cfg => cfg.CreateMap<RichiestaAssistenza, SintesiRichiesta>()
                  .ForMember(x => x.CodiceSchedaNue, y => y.MapFrom(z => z.CodNue))
                  .ForMember(x => x.CodiceRichiesta, y => y.MapFrom(z => z.CodRichiesta))
                  .ForMember(x => x.ZoneEmergenza, y => y.MapFrom(z => z.CodZoneEmergenza))
                  .ForMember(x => x.Eventi, y => y.MapFrom(z => z.ListaEventi.ToEventiSintesi()))
                  .ForMember(x => x.Tipologie, y => y.MapFrom(_ => _getTipologieByCodice.Get(richiesta.Tipologie)))
                  .ForMember(x => x.Operatore, y => y.MapFrom(_ => _getUtenteById.GetUtenteByCodice(richiesta.CodOperatore)))
                  .ForMember(x => x.ListaUtentiInLavorazione, y => y.MapFrom(_ => MapUtenteAttivita(richiesta, "L").ToHashSet()))
                  .ForMember(x => x.ListaUtentiPresaInCarico, y => y.MapFrom(_ => MapUtenteAttivita(richiesta, "P").ToHashSet()))
                  .ForMember(x => x.DettaglioTipologia, y => y.MapFrom(z => z.DettaglioTipologia)));

                _mapper = mapConfing.CreateMapper();

                return _mapper.Map<SintesiRichiesta>(richiesta);
            }
            catch (Exception)
            {
                throw new Exception("Errore mapping richiesta");
            }
        }

        private List<AttivitaUtente> MapUtenteAttivita(RichiestaAssistenza richiesta, string Tipo)
        {
            List<AttivitaUtente> ListaAttivita = new List<AttivitaUtente>();
            if (Tipo.Equals("P"))
            {
                foreach (var evento in richiesta.Eventi)
                {
                    if (!(evento is Telefonata) && !(evento is AssegnazionePriorita))
                    {
                        var utente = _getUtenteById.GetUtenteByCodice(evento.CodiceFonte);

                        if (ListaAttivita.Select(a => a.IdUtente).Contains(utente.Id))
                            continue;

                        AttivitaUtente attivita = new AttivitaUtente()
                        {
                            Nominativo = utente.Nome + " " + utente.Cognome,
                            DataInizioAttivita = evento.Istante,
                            IdUtente = evento.CodiceFonte
                        };

                        if (evento is AnnullamentoPresaInCarico)
                        {
                            var attivitaToDelete = ListaAttivita.Where(x => x.Nominativo.Equals(attivita.Nominativo)).ToList();
                            if (attivitaToDelete.Count > 0)
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

            return ListaAttivita.Distinct().ToList();
        }
    }
}
