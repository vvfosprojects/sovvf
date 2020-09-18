using CQRS.Commands.Validators;
using CQRS.Validation;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaValidation : ICommandValidator<ModificaPartenzaCommand>
    {
        IGetRichiestaById _getRichiesta;
        public ModificaPartenzaValidation(IGetRichiestaById getRichiesta) => _getRichiesta = getRichiesta;

        public IEnumerable<ValidationResult> Validate(ModificaPartenzaCommand command)
        {
            command.Richiesta = _getRichiesta.GetByCodice(command.ModificaPartenza.CodRichiesta);

            if (command.Richiesta == null)
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);
            else if (command.Richiesta.Partenze.Count == 0 && command.ModificaPartenza.Annullamento)
                yield return new ValidationResult("La richiesta non ha partenze da annullare");
            else if (command.Richiesta.Partenze.All(c => c.Partenza.PartenzaAnnullata.Equals(true)))
                yield return new ValidationResult("La richiesta non ha partenze da annullare");

            if (command.ModificaPartenza.CodRichiesta == null || command.ModificaPartenza.CodRichiesta == "")
                yield return new ValidationResult(Costanti.IdRichiestaNonValida);

            if (command.ModificaPartenza.Mezzo == null || command.ModificaPartenza.Mezzo == default || command.ModificaPartenza.Mezzo.Codice == null || command.ModificaPartenza.Mezzo.Codice == "")
                yield return new ValidationResult("Nessun mezzo selezionato");

            if (command.ModificaPartenza.Squadre == null ||
                command.ModificaPartenza.Squadre.Count == 0 ||
                command.ModificaPartenza.Squadre.Any(c => c == null || c == default))
                yield return new ValidationResult("Nessuna squadra selezionata");

            if (command.ModificaPartenza.CodMezzoDaAnnullare == null || command.ModificaPartenza.CodMezzoDaAnnullare == "")
                yield return new ValidationResult("Nessun codice mezzo selezionato");

            if (command.ModificaPartenza.CodSquadreDaAnnullare == null ||
                command.ModificaPartenza.CodSquadreDaAnnullare.Count() == 0 ||
                command.ModificaPartenza.CodSquadreDaAnnullare.Any(c => c == null || c == ""))
                yield return new ValidationResult("Codici squadre errati");

            if (command.ModificaPartenza.Squadre.Count != command.ModificaPartenza.Squadre.Distinct().Count())
                yield return new ValidationResult("Hai selezionato più volte la stessa squadra");

            if (command.Richiesta.Sospesa)
                yield return new ValidationResult("Non puoi modificare una richiesta sospesa");

            if (command.Richiesta.Chiusa)
                yield return new ValidationResult("Non puoi modificare una richiesta chiusa");


            //SE HO STATI NUOVI
            if (command.ModificaPartenza.SequenzaStati != null)
            {
                if (command.ModificaPartenza.SequenzaStati.Any(s => s.Stato == null || s.Stato == "" || s.DataOraAggiornamento == null || s.DataOraAggiornamento == default))
                    yield return new ValidationResult("Cambi stato errati");

                if (command.ModificaPartenza.SequenzaStati.Any(s => s.DataOraAggiornamento > DateTime.Now))
                    yield return new ValidationResult("Non puoi aggiungere un evento non ancora accaduto");

                //QUI VERIFICO LA COERENZA TRA GLI STATI CONSIDERANDO L'ATTUALE STATO DELLA PARTENZA DA MODIFICARE
                var seqEventi = command.ModificaPartenza.SequenzaStati;
                var partenzaDaModificare = command.Richiesta.Partenze.FirstOrDefault(p => command.ModificaPartenza.CodMezzoDaAnnullare.Equals(p.Partenza.Mezzo.Descrizione));
                seqEventi.Add(new CambioStato()
                {
                    Stato = partenzaDaModificare.Partenza.Mezzo.Stato,
                    DataOraAggiornamento = partenzaDaModificare.Istante
                });
                foreach (var stato in seqEventi)
                {
                    string messaggioCoerenza = stato.VerificaCoerenza(command.ModificaPartenza.SequenzaStati);

                    if (messaggioCoerenza != null)
                        yield return new ValidationResult(messaggioCoerenza);
                }
            }


            //SE DEVO ANNULLARE LA PARTENZA DA MODIFICARE
            if (command.ModificaPartenza.Annullamento)
            {
                if (command.ModificaPartenza.DataAnnullamento == null || command.ModificaPartenza.DataAnnullamento == default)
                    yield return new ValidationResult("Nessuna data annullamento selezionata");

                if (command.ModificaPartenza.DataAnnullamento > command.ModificaPartenza.SequenzaStati.Min(c => c.DataOraAggiornamento))
                    yield return new ValidationResult("La data annullamento non può essere più recente di un cambio stato");

                var ultimoEvento = command.Richiesta.ListaEventi.Max(c => c.Istante);
                var x = command.ModificaPartenza.DataAnnullamento.Value;
                var dataAnnullamento = new DateTime(x.Year, x.Month, x.Day, x.Hour, x.Minute, x.Second);
                if (dataAnnullamento < ultimoEvento)
                    yield return new ValidationResult("La data annullamento non può essere minore di un evento già accaduto");
            }
        }
    }
}
