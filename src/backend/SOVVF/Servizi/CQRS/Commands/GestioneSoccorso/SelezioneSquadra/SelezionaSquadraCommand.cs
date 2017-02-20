using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra
{
    internal class SelezionaSquadraCommand
    {
        private readonly string ticket;

        private SelezionaSquadraCommand(string ticket)
        {
            this.ticket = ticket;
        }

        private void Execute()
        {
        }
    }
}
