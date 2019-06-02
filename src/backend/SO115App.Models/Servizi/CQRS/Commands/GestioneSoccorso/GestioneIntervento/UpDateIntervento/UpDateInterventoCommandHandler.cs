using CQRS.Commands;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace DomainModel.CQRS.Commands.UpDateIntervento
{
    public class UpDateInterventoCommandHandler : ICommandHandler<UpDateInterventoCommand>
    {
        private readonly IUpDateRichiestaAssistenza _UpDateRichiestaAssistenza;
        private readonly IGetRichiestaAssistenzaById _getRichiestaById;

        public UpDateInterventoCommandHandler(
            IUpDateRichiestaAssistenza UpDateRichiestaAssistenza,
            IGetRichiestaAssistenzaById GetRichiestaById)
        {
            this._UpDateRichiestaAssistenza = UpDateRichiestaAssistenza;
            this._getRichiestaById = GetRichiestaById;
        }

        public void Handle(UpDateInterventoCommand command)
        {
            RichiestaAssistenza richiesta = _getRichiestaById.Get(command.Chiamata.Codice);

            richiesta.Tipologie = command.Chiamata.Tipologie;
            richiesta.ZoneEmergenza = command.Chiamata.ZoneEmergenza;
            richiesta.Operatore = command.Chiamata.Operatore;
            richiesta.Richiedente = command.Chiamata.Richiedente;
            richiesta.Localita = command.Chiamata.Localita;
            richiesta.Descrizione = command.Chiamata.Descrizione;

            if (command.Chiamata.Etichette != null)
            {
                foreach (var t in command.Chiamata.Etichette)
                {
                    richiesta.Tags.Add(t);
                }
            }

            if (command.Chiamata.Rilevanza)
            {
                new MarcaRilevante(richiesta, command.Chiamata.IstanteRicezioneRichiesta, command.Chiamata.Operatore.Id, "");
            }
            else
            {
                new MarcaNonRilevante(richiesta, command.Chiamata.IstanteRicezioneRichiesta, command.Chiamata.Operatore.Id, "");
            }

            if (command.Chiamata.IstantePresaInCarico != null)
            {
                new InizioPresaInCarico(richiesta, command.Chiamata.IstantePresaInCarico.Value, command.Chiamata.Operatore.Id);
            }

            if (command.Chiamata.Stato == 4)
            {
                new ChiusuraRichiesta("", richiesta, command.Chiamata.IstanteRicezioneRichiesta, command.Chiamata.Operatore.Id);
            }

            if (command.Chiamata.Stato == 0)
            {
                new Telefonata(richiesta, command.Chiamata.Richiedente.Telefono, command.Chiamata.IstanteRicezioneRichiesta, command.Chiamata.Operatore.Id)
                {
                    CognomeChiamante = command.Chiamata.Richiedente.Cognome,
                    NomeChiamante = command.Chiamata.Richiedente.Nome,
                    RagioneSociale = command.Chiamata.Richiedente.RagioneSociale,
                    Motivazione = command.Chiamata.Descrizione,
                    NotePrivate = command.Chiamata.NotePrivate,
                    NotePubbliche = command.Chiamata.NotePubbliche,
                    NumeroTelefono = command.Chiamata.Richiedente.Telefono,
                    Esito = command.Chiamata.Azione.ToString()
                };
            }

            this._UpDateRichiestaAssistenza.Save(richiesta);
        }
    }
}
