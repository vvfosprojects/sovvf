// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

using Modello.Classi.Soccorso.Mezzi;
using Modello.Classi.Soccorso.Risorse;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneMezzo.CommandDTO
{
    /// <summary>
    ///   Servizio di selezione sulla <see cref="DisponibilitaMezzo" />. L'operazione effettuata da
    ///   questo servizio è atomica (test and set). Il servizio effettua l'operazione solo se il
    ///   Mezzo non risulta già selezionato (risoluzione della contesa).
    /// </summary>
    /// <remarks>
    ///   Quando una <see cref="DisponibilitaMezzo" /> viene selezionata diventa non disponibile per
    ///   la selezione da parte di altri operatori.
    /// </remarks>
    public interface ITestAndSetSelezioneDisponibilitaMezzo
    {
        /// <summary>
        ///   Seleziona una <see cref="DisponibilitaMezzo" /> non già selezionata, con semantica atomica.
        /// </summary>
        /// <param name="operatore">Operatore che richiede la selezione.</param>
        /// <param name="codiceMezzo">Codice del Mezzo selezionato.</param>
        /// <returns>
        ///   In caso di successo del test and set, la <see cref="SelezioneRisorsa" /> restituita è
        ///   quella relativa alla prenotazione risorsa appena fatta. In caso di fallimento (risorsa
        ///   già selezionata) viene restituita la selezione corrente.
        /// </returns>
        SelezioneRisorsa Esegui(string operatore, string codiceMezzo);
    }
}
