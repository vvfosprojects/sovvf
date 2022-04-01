using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using System.Linq;

namespace SO115App.Persistence.MongoDB.GestioneConcorrenza
{
    public class IsActionFree : IIsActionFree
    {
        private readonly DbContext _dbContext;

        public IsActionFree(DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public bool Check(TipoOperazione action, string idUtente, string[] codSede, string codOggettoBloccato)
        {
            var filtroSediCompetenti = Builders<Concorrenza>.Filter.In(c => c.CodComando, codSede.Select(uo => uo));

            var listaAzioniBloccateSede = _dbContext.ConcorrenzaCollection.Find(filtroSediCompetenti).ToList();

            bool ret = false;
            switch (action)
            {
                case TipoOperazione.ChiusuraChiamata:
                    var chiamata = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                    && !r.IdOperatore.Equals(idUtente)
                                    && (r.Type.Equals(TipoOperazione.ChiusuraChiamata)
                                    || r.Type.Equals(TipoOperazione.ChiusuraIntervento)
                                    || r.Type.Equals(TipoOperazione.Modifica)
                                    || r.Type.Equals(TipoOperazione.Trasferimento)
                                    || r.Type.Equals(TipoOperazione.InvioPartenza)
                                    || r.Type.Equals(TipoOperazione.Allerta)
                                    || r.Type.Equals(TipoOperazione.CambioStatoPartenza)
                                    || r.Type.Equals(TipoOperazione.GestisciPartenza)
                                    || r.Type.Equals(TipoOperazione.Sganciamento)));

                    if (chiamata == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.ChiusuraIntervento:
                    var intervento = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                    && !r.IdOperatore.Equals(idUtente)
                                    && (r.Type.Equals(TipoOperazione.ChiusuraChiamata)
                                    || r.Type.Equals(TipoOperazione.ChiusuraIntervento)
                                    || r.Type.Equals(TipoOperazione.Modifica)
                                    || r.Type.Equals(TipoOperazione.Trasferimento)
                                    || r.Type.Equals(TipoOperazione.InvioPartenza)
                                    || r.Type.Equals(TipoOperazione.Allerta)
                                    || r.Type.Equals(TipoOperazione.CambioStatoPartenza)
                                    || r.Type.Equals(TipoOperazione.GestisciPartenza)
                                    || r.Type.Equals(TipoOperazione.Sganciamento)));

                    if (intervento == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.Allerta:
                    var allerta = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato) && !r.IdOperatore.Equals(idUtente) 
                                &&   ( r.Type.Equals(TipoOperazione.ChiusuraChiamata)
                                    || r.Type.Equals(TipoOperazione.ChiusuraIntervento)
                                    || r.Type.Equals(TipoOperazione.Trasferimento)
                                    || r.Type.Equals(TipoOperazione.Allerta)));

                    if (allerta == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.Trasferimento:
                    var trasferimento = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                    && !r.IdOperatore.Equals(idUtente)
                                    && (r.Type.Equals(TipoOperazione.ChiusuraChiamata)
                                    || r.Type.Equals(TipoOperazione.ChiusuraIntervento)
                                    || r.Type.Equals(TipoOperazione.Modifica)
                                    || r.Type.Equals(TipoOperazione.Trasferimento)
                                    || r.Type.Equals(TipoOperazione.InvioPartenza)
                                    || r.Type.Equals(TipoOperazione.Allerta)
                                    || r.Type.Equals(TipoOperazione.Sganciamento)));

                    if (trasferimento == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.Sganciamento:
                    var sganciamento = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                    && !r.IdOperatore.Equals(idUtente)
                                    && (r.Type.Equals(TipoOperazione.ChiusuraChiamata)
                                    || r.Type.Equals(TipoOperazione.ChiusuraIntervento)
                                    || r.Type.Equals(TipoOperazione.Trasferimento)
                                    || r.Type.Equals(TipoOperazione.Sganciamento)));

                    if (sganciamento == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.GestisciPartenza:
                    var gestPartenza = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                    && !r.IdOperatore.Equals(idUtente)
                                    && (r.Type.Equals(TipoOperazione.GestisciPartenza)
                                    || r.Type.Equals(TipoOperazione.CambioStatoPartenza)));

                    if (gestPartenza == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.CambioStatoPartenza:
                    var cambioStatoPartenza = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                    && !r.IdOperatore.Equals(idUtente)
                                    && (r.Type.Equals(TipoOperazione.GestisciPartenza)
                                    || r.Type.Equals(TipoOperazione.CambioStatoPartenza)));

                    if (cambioStatoPartenza == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.Modifica:
                    var modifica = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                    && !r.IdOperatore.Equals(idUtente)
                                    && (r.Type.Equals(TipoOperazione.Modifica)
                                    || r.Type.Equals(TipoOperazione.ChiusuraIntervento)
                                    || r.Type.Equals(TipoOperazione.ChiusuraChiamata)));

                    if (modifica == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.InvioPartenza:
                    var invio = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                    && !r.IdOperatore.Equals(idUtente)
                                    && (r.Type.Equals(TipoOperazione.Trasferimento)
                                    || r.Type.Equals(TipoOperazione.InvioPartenza)
                                    || r.Type.Equals(TipoOperazione.ChiusuraIntervento)
                                    || r.Type.Equals(TipoOperazione.ChiusuraChiamata)));

                    if (invio == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.Mezzo:
                    var mezzo = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato) && !r.IdOperatore.Equals(idUtente));

                    if (mezzo == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.Squadra:
                    var squadra = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato) && !r.IdOperatore.Equals(idUtente));

                    if (squadra == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.RegistrazioneSchedaContatto:
                    var schedacontatto = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato) && !r.IdOperatore.Equals(idUtente));

                    if (schedacontatto == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.ModificaPos:
                    var modificaPos = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                                                   && !r.IdOperatore.Equals(idUtente)
                                                                   && (r.Type.Equals(TipoOperazione.ModificaPos)
                                                                   || r.Type.Equals(TipoOperazione.EliminaPos)));

                    if (modificaPos == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.EliminaPos:
                    var eliminaPos = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                                                   && !r.IdOperatore.Equals(idUtente)
                                                                   && (r.Type.Equals(TipoOperazione.ModificaPos)
                                                                   || r.Type.Equals(TipoOperazione.EliminaPos)));

                    if (eliminaPos == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.ModificaPianiDiscendenti:
                    var modPianiDiscendenti = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                                                   && !r.IdOperatore.Equals(idUtente)
                                                                   && (r.Type.Equals(TipoOperazione.ModificaPianiDiscendenti)
                                                                   || r.Type.Equals(TipoOperazione.EliminaPianiDiscendenti)));

                    if (modPianiDiscendenti == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.EliminaPianiDiscendenti:
                    var eliminaPianiDiscendenti = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                                                   && !r.IdOperatore.Equals(idUtente)
                                                                   && (r.Type.Equals(TipoOperazione.ModificaPianiDiscendenti)
                                                                   || r.Type.Equals(TipoOperazione.EliminaPianiDiscendenti)));

                    if (eliminaPianiDiscendenti == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.ModificaDettaglioTipologia:
                    var modificaDetTipologia = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                                                   && !r.IdOperatore.Equals(idUtente)
                                                                   && (r.Type.Equals(TipoOperazione.ModificaDettaglioTipologia)
                                                                   || r.Type.Equals(TipoOperazione.EliminaDettaglioTipologia)));

                    if (modificaDetTipologia == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.EliminaDettaglioTipologia:
                    var eliminaDetTipologia = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                                                   && !r.IdOperatore.Equals(idUtente)
                                                                   && (r.Type.Equals(TipoOperazione.ModificaDettaglioTipologia)
                                                                   || r.Type.Equals(TipoOperazione.EliminaDettaglioTipologia)));

                    if (eliminaDetTipologia == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.ModificaTriage:
                    var modificaTriage = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                                                   && !r.IdOperatore.Equals(idUtente)
                                                                   && (r.Type.Equals(TipoOperazione.ModificaTriage)
                                                                   || r.Type.Equals(TipoOperazione.EliminaTriage)));

                    if (modificaTriage == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.EliminaTriage:
                    var eliminaTriage = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                                                   && !r.IdOperatore.Equals(idUtente)
                                                                   && (r.Type.Equals(TipoOperazione.ModificaTriage)
                                                                   || r.Type.Equals(TipoOperazione.EliminaTriage)));

                    if (eliminaTriage == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                case TipoOperazione.AggiungiRuoloUtente:
                    var aggiungiRuoloUtente = listaAzioniBloccateSede.Find(r => r.Value.Equals(codOggettoBloccato)
                                                                   && !r.IdOperatore.Equals(idUtente)
                                                                   && (r.Type.Equals(TipoOperazione.ModificaRuoloUtente)
                                                                   || r.Type.Equals(TipoOperazione.EliminaRuoloUtente)
                                                                   || r.Type.Equals(TipoOperazione.EliminaUtente)));

                    if (aggiungiRuoloUtente == null)
                        ret = true;
                    else
                        ret = false;
                    break;

                default:
                    ret = true;
                    break;
            }

            return ret;
        }
    }
}
