﻿using AutoMapper;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Classi.Soccorso;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
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
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetPOS _getPOS;

        public MapperRichiestaAssistenzaSuSintesi(IMapper mapper, IGetTipologieByCodice getTipologieByCodice, IGetUtenteById getUtenteById,
                                                  IGetStatoMezzi getStatoMezzi, IGetPOS getPOS)
        {
            _mapper = mapper;
            _getTipologieByCodice = getTipologieByCodice;
            _getUtenteById = getUtenteById;
            _getStatoMezzi = getStatoMezzi;
            _getPOS = getPOS;
        }

        public SintesiRichiesta Map(RichiestaAssistenza richiesta)
        {
            try
            {
                var mapConfing = new MapperConfiguration(cfg => cfg.CreateMap<RichiestaAssistenza, SintesiRichiesta>()
                  .ForMember(x => x.CodiceSchedaNue, y => y.MapFrom(z => z.CodNue))
                  .ForMember(x => x.CodiceRichiesta, y => y.MapFrom(z => z.CodRichiesta))
                  .ForMember(x => x.ZoneEmergenza, y => y.MapFrom(z => z.CodZoneEmergenza))
                  .ForMember(x => x.Eventi, y => y.MapFrom(z => z.ListaEventi.ToEventiSintesi(_getStatoMezzi)))
                  .ForMember(x => x.Tipologie, y => y.MapFrom(_ => _getTipologieByCodice.Get(richiesta.Tipologie.Select(c => c.Codice).ToList())))
                  .ForMember(x => x.Operatore, y => y.MapFrom(_ => MapUtenteSuOperatore(_getUtenteById.GetUtenteByCodice(richiesta.CodOperatore))))
                  .ForMember(x => x.ListaUtentiInLavorazione, y => y.MapFrom(_ => MapUtenteAttivita(richiesta, "L").ToHashSet()))
                  .ForMember(x => x.ListaUtentiPresaInCarico, y => y.MapFrom(_ => MapUtenteAttivita(richiesta, "P").ToHashSet()))
                  .ForMember(x => x.TestoStatoRichiesta, y => y.MapFrom(z => z.TestoStatoRichiesta))
                  .ForMember(x => x.Chiusa, y => y.MapFrom(z => z.Chiusa))
                  .ForMember(x => x.Presidiata, y => y.MapFrom(z => z.Presidiata))
                  .ForMember(x => x.Aperta, y => y.MapFrom(z => z.Aperta))
                  .ForMember(x => x.Sospesa, y => y.MapFrom(z => z.Sospesa))
                  .ForMember(x => x.CodUOCompetenza, y => y.MapFrom(z => z.CodUOCompetenza))
                  .ForMember(x => x.Competenze, y => y.MapFrom(z => z.Competenze))
                  .ForMember(x => x.DettaglioTipologia, y => MapDettaglioTipologia(richiesta.DettaglioTipologia, richiesta.CodSOCompetente))
                  .ForMember(x => x.trnInsChiamata, y => y.MapFrom(z => z.TrnInsChiamata)));

                _mapper = mapConfing.CreateMapper();

                var result = _mapper.Map<SintesiRichiesta>(richiesta);

                return result;
            }
            catch (Exception e)
            {
                throw new Exception("Errore mapping richiesta");
            }
        }

        private Operatore MapUtenteSuOperatore(API.Models.Classi.Autenticazione.Utente utente)
        {
            return new Operatore(utente.CodiceFiscale, utente.Nome, utente.Cognome)
            {
                Id = utente.Id
            };
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
                //foreach (var lavorazione in richiesta.UtInLavorazione)
                //{
                //    AttivitaUtente attivita = new AttivitaUtente()
                //    {
                //        Nominativo = lavorazione.Replace(".", " ")
                //    };
                //    ListaAttivita.Add(attivita);
                //};
            }

            return ListaAttivita.Distinct().ToList();
        }

        private TipologiaDettaglio MapDettaglioTipologia(TipologiaDettaglio dettaglio, string codSede)
        {
            if (dettaglio != null)
            {
                var filtroPos = new FiltriPOS()
                {
                    idDettaglioTipologia = dettaglio.CodiceDettaglioTipologia,
                    idTipologia = dettaglio.CodiceTipologia
                };

                var filtro = new GetElencoPOSQuery()
                {
                    CodiceSede = codSede.Split('.')[0] + ".1000",
                    Filters = filtroPos
                };

                var pos = _getPOS.GetPosByCodTipologiaCodDettaglio(filtro);

                if (pos != null)
                    dettaglio.Pos = pos;

                return dettaglio;
            }
            else
                return null;
        }
    }
}
