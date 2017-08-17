//-----------------------------------------------------------------------
// <copyright file="Mezzo.cs" company="CNVVF">
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
namespace Modello.Classi.Soccorso.SintesiRichiestaAssistenza
{
    /// <summary>
    ///   Modella il mezzo
    /// </summary>
    public class Mezzo
    {
        /// <summary>
        ///   Stato del mezzo
        /// </summary>
        public enum Stato
        {
            /// <summary>
            ///   Il mezzo è in sede
            /// </summary>
            InSede = 0,

            /// <summary>
            ///   Il mezzo è in viaggio verso il luogo del sinistro
            /// </summary>
            InViaggio,

            /// <summary>
            ///   Il mezzo è sul posto
            /// </summary>
            SulPosto,

            /// <summary>
            ///   Il mezzo è in rientro
            /// </summary>
            InRientro,

            /// <summary>
            ///   Il mezzo è impegnato per motivi di istituto
            /// </summary>
            Istituto
        }

        /// <summary>
        ///   Stato di efficienza del mezzo
        /// </summary>
        public enum StatoEfficienza
        {
            /// <summary>
            ///   Il mezzo è fuori uso
            /// </summary>
            FuoriUso = 0,

            /// <summary>
            ///   Lo stato è mediocre
            /// </summary>
            Mediocre,

            /// <summary>
            ///   Lo stato è buono
            /// </summary>
            Buono,

            /// <summary>
            ///   Lo stato è ottimo
            /// </summary>
            Ottimo
        }

        /// <summary>
        ///   Indicatore sul livello dei rifornimenti
        /// </summary>
        public enum Livello
        {
            /// <summary>
            ///   Il livello non è stato rilevato (per es. per indisponibilità di un apposito sensore)
            /// </summary>
            NonRilevato = 0,

            /// <summary>
            ///   Materiale (combustibile, ossigeno, estinguente) Esaurito
            /// </summary>
            Vuoto,

            /// <summary>
            ///   Livello basso
            /// </summary>
            Basso,

            /// <summary>
            ///   Livello medio
            /// </summary>
            Medio,

            /// <summary>
            ///   Livello alto
            /// </summary>
            Alto
        }

        /// <summary>
        ///   Appartenenza del mezzo
        /// </summary>
        public enum Appartenenza
        {
            /// <summary>
            ///   Mezzo proprio (dal punto di vista dell'utente che visualizza l'informazione
            /// </summary>
            Proprio = 0,

            /// <summary>
            ///   Mezzo di altra sede (dal punto di vista dell'utente che visualizza l'informazione
            /// </summary>
            AltraSede
        }

        /// <summary>
        ///   Codice del mezzo
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Descrizione del mezzo (come appare in GUI)
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Genere. Per es. APS, ABP, AS, CA, ecc.
        /// </summary>
        public string Genere { get; set; }

        /// <summary>
        ///   Codice dello stato del mezzo. Per es. inSede, inViaggio, sulPosto, inRientro, istituto,
        ///   ecc. Utile a definire il colore del segnale di stato.
        /// </summary>
        public Stato StatoMezzo { get; set; }

        /// <summary>
        ///   Testo del segnale di stato.
        /// </summary>
        public string DescrizioneStato { get; set; }

        /// <summary>
        ///   Codice dello stato di efficienza del mezzo. Utile a definire il colore della
        ///   segnalazione delolo stato di efficienza.
        /// </summary>
        public StatoEfficienza StatoEfficienzaMezzo { get; set; }

        /// <summary>
        ///   Testo dello stato di efficienza
        /// </summary>
        public string DescrizioneStatoEfficienza { get; set; }

        /// <summary>
        ///   Codice del livello di carburante. Utile a definire il colore della segnalazione sul
        ///   livello di carburante.
        /// </summary>
        public Livello LivelloCarburante { get; set; }

        /// <summary>
        ///   Testo del livello di carburante.
        /// </summary>
        public string DescrizioneLivelloCarburante { get; set; }

        /// <summary>
        ///   Codice del livello di estinguente. Utile a definire il colore della segnalazione del
        ///   livello di estinguente.
        /// </summary>
        public Livello LivelloEstinguente { get; set; }

        /// <summary>
        ///   Testo della segnalazione sul livello di estinguente
        /// </summary>
        public string DescrizioneLivelloEstinguente { get; set; }

        /// <summary>
        ///   Codice dello stato di appartenenza del mezzo. Utile a definire il colore della
        ///   segnalazione sullo stato di appartenenza.
        /// </summary>
        public Appartenenza AppartenenzaMezzo { get; set; }

        /// <summary>
        ///   Testo della segnalazione sullo stato di appartenenza.
        /// </summary>
        public string DescrizioneAppartenenzaMezzo { get; set; }

        /// <summary>
        ///   Elenco dei componenti presenti sul mezzo
        /// </summary>
        public Componente[] PersoneSulMezzo { get; set; }

        /// <summary>
        ///   Elenco delle notifiche legate al mezzo
        /// </summary>
        public string[] NotificheMezzo { get; set; }
    }
}
