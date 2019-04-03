using SO115App.API.Models.AOP.Validation;
using SO115App.API.Models.Classi.Soccorso.Risorse;
using SO115App.API.Models.Servizi;
using SO115App.API.Models.Servizi.CQRS.Commands;
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaMezzo.CommandDTO;
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaSquadra.CommandDTO;
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra.CommandDTO;
using SO115App.API.Models.Servizi.CQRS.Queries;
using SO115App.API.Models.Servizi.Infrastruttura.Anagrafiche;
using SO115App.API.Models.Servizi.Infrastruttura.Autenticazione;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.CompetenzeTerritoriali;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.Organigramma.Implementazioni;
using SO115App.API.SOVVF.FakeImplementations;
using SO115App.API.SOVVF.FakeImplementations.Modello.Autenticazione;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse;
using SO115App.API.SOVVF.FakeImplementations.Modello.Infrastruttura.Anagrafiche;
using SO115App.API.SOVVF.FakeImplementations.Modello.Infrastruttura.CompetenzeTerritoriali;
using SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste;

using SimpleInjector;
using SimpleInjector.Integration.AspNetCore.Mvc;

using System;
using SO115App.API.Models.AOP.Authorization;
using System.Security.Principal;
using System.Collections.Generic;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Utenti.Autenticazione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.QueryDTO;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.ResultDTO;

namespace SO115App.API.CompositionRoot
{
    public static class Configurator
    {
        public static void Configure(Container c)
        {
            
//COMMAND REGISTRATION

            c.Register(
                typeof(ICommandHandler<>),
                AppDomain.CurrentDomain.GetAssemblies());

            c.RegisterDecorator(
                typeof(ICommandHandler<>),
                typeof(ValidatingCommandHandlerDecorator<>));

            c.RegisterDecorator(
                typeof(ICommandHandler<>),
                typeof(AuthorizationCommandHandlerDecorator<>));           


            c.Register(
                typeof(IQueryHandler<,>), 
                AppDomain.CurrentDomain.GetAssemblies());


           c.Register(
                typeof(IQueryValidator<,>), 
                AppDomain.CurrentDomain.GetAssemblies());


//QUERY REGISTRATION

//Registrazione componenti "Sintesi Richiesta"
            c.Register(
                typeof(ISintesiRichiestaAssistenzaQueryHandler<,>), 
                AppDomain.CurrentDomain.GetAssemblies());

            c.RegisterDecorator(
                typeof(ISintesiRichiestaAssistenzaQueryHandler<,>),
                typeof(SintesiRichiesteAssistenzaAuthorizationQueryHandlerDecorator<,>));           

            c.RegisterDecorator(
                typeof(ISintesiRichiestaAssistenzaQueryHandler<,>),
                typeof(SintesiRichiesteAssitenzaValidatingQueryHandlerDecorator<,>));           




            c.Register(typeof(IAuthOperatore),typeof(AuthOperatore));

            var assembliesP = new[] { typeof(IPrincipal).Assembly };
            c.Collection.Register(typeof(IPrincipal), assembliesP);

            c.Collection.Register(
                typeof(ICommandValidator<>),
                typeof(SelezionaSquadraCommand).Assembly);
            

            c.Register<IGetUnitaOperativaPerCodice, GetUnitaOperativaPerCodice>();


            //TEST AND FAKE
            //************************************************************************************************************************                                
            //c.Register<IGeneratoreRichieste,GeneratoreRichieste>();
            c.RegisterInstance<IGeneratoreRichieste>(new GeneratoreRichieste());      
            c.Register<IGetOperatoreAutenticato, GetOperatoreAutenticato>();
            c.Register<IGetUnitaOperativaRadice, GetUnitaOperativaRadice_OrganigrammaCONRidottoCablato>();
            c.Register<IGetUnitaOperativeVisibiliPerSoccorso, GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio>();
            c.Register<IGetSituazioneMezzi, GetSituazioneMezzi_RandomFake>();
            c.Register<IGetTipoInterventoByCodice, GetTipoInterventoByCodice_Fake>();
            c.Register<ITestAndSetSelezioneDisponibilitaSquadra, TestAndSetSelezioneDisponibilitaSquadra_Fake>();
            c.Register<ITestAndSetSelezioneDisponibilitaMezzo, TestAndSetSelezioneDisponibilitaMezzo_Fake>();
            c.Register<ITestAndSetDeselezioneDisponibilitaSquadra, TestAndSetDeselezioneDisponibilitaSquadra_DoNothing>();
            c.Register<ITestAndSetDeselezioneDisponibilitaMezzo, TestAndSetDeselezioneDisponibilitaMezzo_DoNothing>();
            c.Register<ISaveRichiestaAssistenza, SaveRichiestaDiAssistenza_Fake>();
            c.Register<IGetRichiestaAssistenzaById, GetRichiestaAssistenzaById_Fake>();
            c.Register<ICercaRichiesteAssistenza, CercaRichiesteAssistenza_Empty>();
            c.Register<IGetNumeroMezziSoccorsoOraInServizio, GetNumeroMezziSoccorsoOraInServizio_Fake>();
            c.Register<IGetNumeroSquadreSoccorsoOraInServizio, GetNumeroSquadreSoccorsoOraInServizio_Fake>();
            c.Register<IGetCompetenzeByPunto, GetCompetenzeByPunto_Fake_Hardcoded>();
            //************************************************************************************************************************


        }
    }
}