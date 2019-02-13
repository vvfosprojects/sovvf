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

using SimpleInjector;
using SimpleInjector.Integration.AspNetCore.Mvc;
using SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GenerazioneRichieste;

namespace SO115App.API.CompositionRoot
{
    public static class Configurator
    {
        public static void Configure(Container c)
        {
            
            c.Register(
                typeof(ICommandHandler<>),
                typeof(ICommandHandler<>).Assembly);

            c.Register(
                typeof(IQueryHandler<,>), 
                typeof(IQueryHandler<,>).Assembly);

            c.Collection.Register(
                typeof(ICommandValidator<>),
                typeof(SelezionaSquadraCommand).Assembly);

            c.RegisterDecorator(
                typeof(ICommandHandler<>),
                typeof(ValidatingCommandHandlerDecorator<>));

            //c.RegisterDecorator(
            //    typeof(IQueryHandler<,>),
            //    typeof(ValidatingQueryHandlerDecorator<,>));
            
            c.Register<IGetUnitaOperativaPerCodice, GetUnitaOperativaPerCodice>();

            //IActionGeneric è l'interfaccia che implementa tutte le funzioni comuni a tutte le Azioni che
            // verranno utilizzate nell'applicazione
            c.Register(
                typeof(IActionGeneric<>), 
                typeof(IActionGeneric<>).Assembly);


            //TEST AND FAKE
            //************************************************************************************************************************
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