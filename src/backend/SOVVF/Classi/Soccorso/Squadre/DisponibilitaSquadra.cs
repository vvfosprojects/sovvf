//-----------------------------------------------------------------------
// <copyright file="DisponibilitaSquadra.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using System;
using System.Collections.Generic;
using Modello.Classi.Soccorso.Risorse;

namespace Modello.Classi.Soccorso.Squadre
{
    /// <summary>
    ///   Identifica con un Ticket una squadra disponibile per il soccorso. L'istanza di questa
    ///   classe viene creata quando la squadra si rende effettivamente disponibile.
    /// </summary>
    /// <remarks>
    ///   L'insieme delle squadre correntemente disponibili possono essere utilizzate in fase di
    ///   composizione della partenza nell'evasione di una segnalazione.
    /// </remarks>
    public abstract class DisponibilitaSquadra
    {
        /// <summary>
        ///   Costruttore della squadra. Inizializza il ticket.
        /// </summary>
        public DisponibilitaSquadra()
        {
            this.Ticket = Guid.NewGuid().ToString();
            this.ComposizionePrevista = new HashSet<Componente>();
            this.ComposizioneDisponibile = new HashSet<Componente>();
        }

        /// <summary>
        ///   Identificativo assegnato alla squadra al momento della sua definizione.
        /// </summary>
        public string Ticket { get; set; }

        /// <summary>
        ///   E' il codice parlante della squadra che la identifica all'interno dell'Unità Organizzativa.
        /// </summary>
        public string Sigla { get; set; }

        /// <summary>
        ///   Unità operativa responsabile della gestione operativa della squadra
        /// </summary>
        public string CodiceUnitaOperativaResponsabile { get; set; }

        /// <summary>
        ///   E' l'istante in cui è previsto che la squadra prenda servizio.
        /// </summary>
        public DateTime IstantePrevistoInizioServizio { get; set; }

        /// <summary>
        ///   E' l'istante in cui è previsto che la squadra termini il servizio.
        /// </summary>
        public DateTime IstantePrevistoFineServizio { get; set; }

        /// <summary>
        ///   E' l'istante in cui è effettivamente inizia il servizio della squadra. Per default sarà
        ///   uguale a quello previsto. Può essere utile nel caso un Turno venga chiamato in servizio
        ///   prima dell'orario previsto di inizio turno.
        /// </summary>
        public DateTime IstanteEffettivoInizioServizio { get; set; }

        /// <summary>
        ///   E' l'istante in cui è effettivamente terminato il servizio della squadra. E' null se la
        ///   squadra è correntemente in servizio.
        /// </summary>
        public DateTime? IstanteEffettivoFineServizio { get; set; }

        /// <summary>
        ///   E' l'insieme dei componenti che è previsto che siano in squadra. Per es. per le squadre
        ///   di soccorso ordinario la previsione proveniente dalla Composizione servizi del personale.
        /// </summary>
        public ISet<Componente> ComposizionePrevista { get; set; }

        /// <summary>
        ///   E' l'insieme dei componenti attualmente disponibili nella squadra.
        /// </summary>
        public ISet<Componente> ComposizioneDisponibile { get; set; }

        /// <summary>
        ///   Indica l'eventuale stato di selezione della squadra. Una squadra selezionata è
        ///   disponibile per la Composizione Partenza solo all'operatore che ha effettuato la
        ///   selezione. Risolve la contesa della risorsa <see cref="DisponibilitaSquadra" /> con la
        ///   semantica Test and Set.
        /// </summary>
        public SelezioneRisorsa Selezionata { get; private set; }
    }
}
