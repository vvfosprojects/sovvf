//-----------------------------------------------------------------------
// <copyright file="Costanti.cs" company="CNVVF">
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

namespace SO115App.ExternalAPI.Client
{
    public static class Messages
    {
        public const string ServizioNonRaggiungibile = "Servizio non raggiungibile. Consultare il log e contattare il supporto tecnico.";

        public const string AutorizzazioneNegata = "Il servizio ha negato l'autorizzazione ad eseguire l'operazione richiesta. Consultare il log e contattare il supporto tecnico.";
        public const string DatiMancanti = "Il servizio segnala dati mancanti inviati da SO115. Consultare il log e contattare il supporto tecnico.";
               
        public const string ErroreInternoAlServer = "Il servizio ha segnalato un errore interno. Consultare il log e contattare il supporto tecnico.";
        public const string NonTuttiIDatiInviatiSonoStatiProcessati = "Il servizio non è riuscito a processare tutti i dati che sono stati inviati. Consultare il log e contattare il supporto tecnico.";
               
        public const string OggettoNonValido = "E' stato inviato un oggetto al servizio diverso da quello atteso. Consultare il log e contattare il supporto tecnico.";
    }
}
