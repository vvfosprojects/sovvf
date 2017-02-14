using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Risorse;
using Modello.Servizi.Infrastruttura.Autenticazione;

namespace Modello.Servizi.GestioneSoccorso
{
    /// <summary>
    ///   Scatena la selezione di una squadra per l'assegnazione ad una
    ///   <see cref="ComposizionePartenza" />. La selezione sottrae la risorsa squadra dall'uso da
    ///   parte di tutte le altre postazioni concorrenti.
    /// </summary>
    public class SelezioneSquadra
    {
        private readonly IGetDisponibilitaSquadraByTicket getDisponibilitaSquadraByTicket;
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;
        private readonly ITestAndSetSelezioneDisponibilitaSquadra testAndSetSelezioneDisponibilitaSquadra;

        public SelezioneSquadra(
            IGetDisponibilitaSquadraByTicket getDisponibilitaSquadraByTicket,
            IGetOperatoreAutenticato getOperatoreAutenticato,
            ITestAndSetSelezioneDisponibilitaSquadra testAndSetSelezioneDisponibilitaSquadra)
        {
            this.getDisponibilitaSquadraByTicket = getDisponibilitaSquadraByTicket;
            this.getOperatoreAutenticato = getOperatoreAutenticato;
            this.testAndSetSelezioneDisponibilitaSquadra = testAndSetSelezioneDisponibilitaSquadra;
        }

        /// <summary>
        ///   Seleziona la squadra.
        /// </summary>
        /// <param name="ticket">Ticket della squadra selezionata.</param>
        /// <returns>La <see cref="SelezioneRisorsa" /> corrente.</returns>
        /// <remarks>
        ///   Per controllare che la selezione sia andata a buon fine, sul client verrà controllato
        ///   che l'operatore della SelezioneRisorsa sia se stesso
        /// </remarks>
        public SelezioneRisorsa Seleziona(string ticket)
        {
            //carica la squadra disponibile da DisponibilitaSquadra
            var disponibilitaSquadra = getDisponibilitaSquadraByTicket.Get(ticket);

            //set SelezioneRisorsa della squadra selezionata
            disponibilitaSquadra.Seleziona(this.getOperatoreAutenticato.Get());

            //Test And Set SelezioneRisorsa su DisponibilitaSquadra
            //ritorna il valore corrente di SelezioneRisorsa
            var selezioneRisorsa = testAndSetSelezioneDisponibilitaSquadra.Esegui(disponibilitaSquadra);
            //notifica selezione avvenuta

            return selezioneRisorsa;
        }
    }
}
