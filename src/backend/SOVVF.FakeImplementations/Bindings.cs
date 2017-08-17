//-----------------------------------------------------------------------
// <copyright file="Bindings.cs" company="CNVVF">
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
using SimpleInjector;
using SimpleInjector.Packaging;

namespace SOVVF.FakeImplementations
{
    /// <summary>
    ///   Bindings delle implementazioni fake
    /// </summary>
    public class Bindings : IPackage
    {
        /// <summary>
        ///   Contiene le regole di bindings
        /// </summary>
        /// <param name="container">Il container sul quale le registrazioni hanno effetto</param>
        public void RegisterServices(Container container)
        {
            container.Register<global::Modello.Servizi.Infrastruttura.Autenticazione.IGetOperatoreAutenticato, Modello.Autenticazione.GetOperatoreAutenticato>();

            container.Register<global::Modello.Servizi.Infrastruttura.Organigramma.IGetUnitaOperativaRadice, Modello.Organigramma.GetUnitaOperativaRadice_OrganigrammaCONRidottoCablato>();

            container.Register<global::Modello.Servizi.Infrastruttura.Organigramma.IGetUnitaOperativeVisibiliPerSoccorso, Modello.Organigramma.GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio>();

            container.Register<global::Modello.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetSituazioneMezzi, Modello.GestioneSoccorso.Mezzi.GetSituazioneMezzi_RandomFake>();

            container.Register<global::Modello.Servizi.Infrastruttura.Anagrafiche.IGetTipoInterventoByCodice, Modello.Infrastruttura.Anagrafiche.GetTipoInterventoByCodice_Fake>();

            container.Register<global::Modello.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra.CommandDTO.ITestAndSetSelezioneDisponibilitaSquadra, Modello.GestioneSoccorso.Risorse.TestAndSetSelezioneDisponibilitaSquadra_Fake>();

            container.Register<global::Modello.Classi.Soccorso.Risorse.ITestAndSetSelezioneDisponibilitaMezzo, Modello.GestioneSoccorso.Risorse.TestAndSetSelezioneDisponibilitaMezzo_Fake>();

            container.Register<global::Modello.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaSquadra.CommandDTO.ITestAndSetDeselezioneDisponibilitaSquadra, Modello.GestioneSoccorso.Risorse.TestAndSetDeselezioneDisponibilitaSquadra_DoNothing>();

            container.Register<global::Modello.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaMezzo.CommandDTO.ITestAndSetDeselezioneDisponibilitaMezzo, Modello.GestioneSoccorso.Risorse.TestAndSetDeselezioneDisponibilitaMezzo_DoNothing>();

            container.Register<global::Modello.Servizi.Infrastruttura.GestioneSoccorso.ISaveRichiestaAssistenza, Modello.GestioneSoccorso.SaveRichiestaDiAssistenza_Fake>();

            container.Register<global::Modello.Servizi.Infrastruttura.GestioneSoccorso.IGetRichiestaAssistenzaById, Modello.GestioneSoccorso.GetRichiestaAssistenzaById_Fake>();

            container.Register<global::Modello.Servizi.Infrastruttura.GestioneSoccorso.IGetRichiesteAssistenzaInCorso, Modello.GestioneSoccorso.GetRichiesteAssistenzaInCorso_Empty>();

            container.Register<global::Modello.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetNumeroMezziSoccorsoOraInServizio, Modello.GestioneSoccorso.Mezzi.GetNumeroMezziSoccorsoOraInServizio_Fake>();

            container.Register<global::Modello.Servizi.Infrastruttura.GestioneSoccorso.IGetNumeroSquadreSoccorsoOraInServizio, Modello.GestioneSoccorso.Mezzi.GetNumeroSquadreSoccorsoOraInServizio_Fake>();
        }
    }
}
