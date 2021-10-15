using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.ESRI
{
    public class MappingESRIMessage : IMappingESRIMessage
    {
        private readonly IGetRubrica _getRurbica;

        public MappingESRIMessage(IGetRubrica getRurbica)
        {
            _getRurbica = getRurbica;
        }

        public ESRI_RichiestaMessage Map(SintesiRichiesta richiesta)
        {
            var rubrica = new List<EnteDTO>();
            if (richiesta.listaEnti != null)
            {
                rubrica = _getRurbica.GetBylstCodici(richiesta.listaEnti.ToArray());
            }

            if (richiesta.Esri_Param == null)
            {
                var infoESRI = new ESRI_RichiestaMessage()
                {
                    geometry = new geometry()
                    {
                        x = richiesta.Localita.Coordinate.Longitudine,
                        y = richiesta.Localita.Coordinate.Latitudine
                    },
                    attributes = new attributes()
                    {
                        chiamataurgente = richiesta.ChiamataUrgente == true ? 1 : 0,
                        codicerichiesta = richiesta.CodiceRichiesta != null ? richiesta.CodiceRichiesta : richiesta.Codice,
                        esercitazione = richiesta.Esercitazione == true ? 1 : 0,
                        indirizzo = richiesta.Localita.Indirizzo,
                        interno = richiesta.Localita.Interno,
                        istantericezionerichiesta = richiesta.IstanteRicezioneRichiesta,
                        listaenti = rubrica != null ? String.Join(",", rubrica.Select(x => x.Descrizione)) : "",
                        listautentipresaincarico = String.Join(",", richiesta.ListaUtentiPresaInCarico.Select(x => x.Nominativo).ToList()),
                        note = richiesta.NotePubbliche,
                        operatorecodicefiscale = richiesta.Operatore.CodiceFiscale,
                        palazzo = richiesta.Localita.Palazzo,
                        piano = richiesta.Localita.Piano,
                        richiedentenominativo = richiesta.Richiedente.Nominativo,
                        richiedentetelefono = richiesta.Richiedente.Telefono,
                        rilevantegrave = richiesta.RilevanteGrave == true ? 1 : 0,
                        scala = richiesta.Localita.Scala,
                        tipologiacategoria = richiesta.Tipologie[0].Categoria,
                        tipologiacodice = Convert.ToInt32(richiesta.Tipologie[0].Codice),
                        tipologiadettaglio = richiesta.DettaglioTipologia != null ? richiesta.DettaglioTipologia.Descrizione : null,
                        stato = richiesta.Stato
                    }
                };

                return infoESRI;
            }
            else
            {
                var infoESRI = new ESRI_RichiestaMessage()
                {
                    geometry = new geometry()
                    {
                        x = richiesta.Localita.Coordinate.Longitudine,
                        y = richiesta.Localita.Coordinate.Latitudine
                    },
                    attributes = new attributes()
                    {
                        objectid = richiesta.Esri_Param.ObjectId,
                        chiamataurgente = richiesta.ChiamataUrgente == true ? 1 : 0,
                        codicerichiesta = richiesta.CodiceRichiesta != null ? richiesta.CodiceRichiesta : richiesta.Codice,
                        esercitazione = richiesta.Esercitazione == true ? 1 : 0,
                        indirizzo = richiesta.Localita.Indirizzo,
                        interno = richiesta.Localita.Interno,
                        istantericezionerichiesta = richiesta.IstanteRicezioneRichiesta,
                        listaenti = rubrica != null ? String.Join(",", rubrica.Select(x => x.Descrizione)) : "",
                        listautentipresaincarico = String.Join(",", richiesta.ListaUtentiPresaInCarico.Select(x => x.Nominativo).ToList()),
                        note = richiesta.NotePubbliche,
                        operatorecodicefiscale = richiesta.Operatore.CodiceFiscale,
                        palazzo = richiesta.Localita.Palazzo,
                        piano = richiesta.Localita.Piano,
                        richiedentenominativo = richiesta.Richiedente.Nominativo,
                        richiedentetelefono = richiesta.Richiedente.Telefono,
                        rilevantegrave = richiesta.RilevanteGrave == true ? 1 : 0,
                        scala = richiesta.Localita.Scala,
                        tipologiacategoria = richiesta.Tipologie[0].Categoria,
                        tipologiacodice = Convert.ToInt32(richiesta.Tipologie[0].Codice),
                        tipologiadettaglio = richiesta.DettaglioTipologia != null ? richiesta.DettaglioTipologia.Descrizione : null,
                        stato = richiesta.Stato
                    }
                };

                return infoESRI;
            }
        }
    }
}
