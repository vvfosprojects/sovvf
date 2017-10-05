//-----------------------------------------------------------------------
// <copyright file="AbstractStatoMezzo.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Eventi.Eccezioni;
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace Modello.Classi.Soccorso.Mezzi.StatiMezzo
{
    /// <summary>
    ///   La classe base per tutti gli <see cref="IStatoMezzo" />
    /// </summary>
    public abstract class AbstractStatoMezzo : IStatoMezzo, ICanAcceptVisitorStatoMezzo
    {
        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="istanteTransizione">
        ///   L'istante in cui avviene la transizione in questo stato
        /// </param>
        public AbstractStatoMezzo(DateTime istanteTransizione)
        {
            this.IstanteTransizione = istanteTransizione;
        }

        /// <summary>
        ///   Il codice identificativo dello stato
        /// </summary>
        public abstract string Codice { get; }

        /// <summary>
        ///   La descrizione dello stato
        /// </summary>
        public abstract string Descrizione { get; }

        /// <summary>
        ///   Indica se il mezzo è disponibile
        /// </summary>
        public abstract bool Disponibile { get; }

        /// <summary>
        ///   Indica se il mezzo è assegnato ad una richiesta
        /// </summary>
        public abstract bool AssegnatoARichiesta { get; }

        /// <summary>
        ///   Indica l'istante in cui la transizione in questo stato è avvenuta
        /// </summary>
        public virtual DateTime IstanteTransizione { get; private set; }

        /// <summary>
        ///   Calcola la transizione di stato ottenuta in seguito al verificarsi di un evento
        /// </summary>
        /// <param name="evento">L'evento che induce la transizione di stato</param>
        /// <returns>Il nuovo stato raggiunto a seguito della transizione</returns>
        public IStatoMezzo Transisci(IPartenza evento)
        {
            return evento.Visit(this);
        }

        /// <summary>
        ///   Accetta il visitor e scatena l'implementazione di default che consiste nel sollevare
        ///   una <see cref="WorkflowException" />. Gli stati concreti, implementati nelle classi
        ///   derivate, effettuano l'override dei metodi corrispondenti a transizioni di stato
        ///   ammesse, restituendo lo stato corretto a fronte dell'evento (visitor) di ingresso.
        /// </summary>
        /// <param name="arrivoSulPosto">Il visitor accettato</param>
        /// <returns>Niente, poiché solleva un'eccezione</returns>
        public virtual IStatoMezzo AcceptVisitor(ArrivoSulPosto arrivoSulPosto)
        {
            throw new WorkflowException($"Impossibile transire in seguito all'evento {nameof(arrivoSulPosto)}");
        }

        /// <summary>
        ///   Accetta il visitor e scatena l'implementazione di default che consiste nel sollevare
        ///   una <see cref="WorkflowException" />. Gli stati concreti, implementati nelle classi
        ///   derivate, effettuano l'override dei metodi corrispondenti a transizioni di stato
        ///   ammesse, restituendo lo stato corretto a fronte dell'evento (visitor) di ingresso.
        /// </summary>
        /// <param name="vaInFuoriServizio">Il visitor accettato</param>
        /// <returns>Niente, poiché solleva un'eccezione</returns>
        public virtual IStatoMezzo AcceptVisitor(VaInFuoriServizio vaInFuoriServizio)
        {
            throw new WorkflowException($"Impossibile transire in seguito all'evento {nameof(vaInFuoriServizio)}");
        }

        /// <summary>
        ///   Accetta il visitor e scatena l'implementazione di default che consiste nel sollevare
        ///   una <see cref="WorkflowException" />. Gli stati concreti, implementati nelle classi
        ///   derivate, effettuano l'override dei metodi corrispondenti a transizioni di stato
        ///   ammesse, restituendo lo stato corretto a fronte dell'evento (visitor) di ingresso.
        /// </summary>
        /// <param name="uscitaPartenza">Il visitor accettato</param>
        /// <returns>Niente, poiché solleva un'eccezione</returns>
        public virtual IStatoMezzo AcceptVisitor(UscitaPartenza uscitaPartenza)
        {
            throw new WorkflowException($"Impossibile transire in seguito all'evento {nameof(uscitaPartenza)}");
        }

        /// <summary>
        ///   Accetta il visitor e scatena l'implementazione di default che consiste nel sollevare
        ///   una <see cref="WorkflowException" />. Gli stati concreti, implementati nelle classi
        ///   derivate, effettuano l'override dei metodi corrispondenti a transizioni di stato
        ///   ammesse, restituendo lo stato corretto a fronte dell'evento (visitor) di ingresso.
        /// </summary>
        /// <param name="revoca">Il visitor accettato</param>
        /// <returns>Niente, poiché solleva un'eccezione</returns>
        public virtual IStatoMezzo AcceptVisitor(Revoca revoca)
        {
            throw new WorkflowException($"Impossibile transire in seguito all'evento {nameof(revoca)}");
        }

        /// <summary>
        ///   Accetta il visitor e scatena l'implementazione di default che consiste nel sollevare
        ///   una <see cref="WorkflowException" />. Gli stati concreti, implementati nelle classi
        ///   derivate, effettuano l'override dei metodi corrispondenti a transizioni di stato
        ///   ammesse, restituendo lo stato corretto a fronte dell'evento (visitor) di ingresso.
        /// </summary>
        /// <param name="partenzaInRientro">Il visitor accettato</param>
        /// <returns>Niente, poiché solleva un'eccezione</returns>
        public virtual IStatoMezzo AcceptVisitor(PartenzaInRientro partenzaInRientro)
        {
            throw new WorkflowException($"Impossibile transire in seguito all'evento {nameof(partenzaInRientro)}");
        }

        /// <summary>
        ///   Accetta il visitor e scatena l'implementazione di default che consiste nel sollevare
        ///   una <see cref="WorkflowException" />. Gli stati concreti, implementati nelle classi
        ///   derivate, effettuano l'override dei metodi corrispondenti a transizioni di stato
        ///   ammesse, restituendo lo stato corretto a fronte dell'evento (visitor) di ingresso.
        /// </summary>
        /// <param name="partenzaRientrata">Il visitor accettato</param>
        /// <returns>Niente, poiché solleva un'eccezione</returns>
        public virtual IStatoMezzo AcceptVisitor(PartenzaRientrata partenzaRientrata)
        {
            throw new WorkflowException($"Impossibile transire in seguito all'evento {nameof(partenzaRientrata)}");
        }

        /// <summary>
        ///   Accetta il visitor e scatena l'implementazione di default che consiste nel sollevare
        ///   una <see cref="WorkflowException" />. Gli stati concreti, implementati nelle classi
        ///   derivate, effettuano l'override dei metodi corrispondenti a transizioni di stato
        ///   ammesse, restituendo lo stato corretto a fronte dell'evento (visitor) di ingresso.
        /// </summary>
        /// <param name="composizionePartenze">Il visitor accettato</param>
        /// <returns>Niente, poiché solleva un'eccezione</returns>
        public virtual IStatoMezzo AcceptVisitor(ComposizionePartenze composizionePartenze)
        {
            throw new WorkflowException($"Impossibile transire in seguito all'evento {nameof(composizionePartenze)}");
        }
    }
}
