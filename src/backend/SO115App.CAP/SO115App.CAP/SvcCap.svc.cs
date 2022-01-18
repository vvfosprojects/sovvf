using System;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.Threading.Tasks;

namespace SO115App.CAP
{
    // NOTA: è possibile utilizzare il comando "Rinomina" del menu "Refactoring" per modificare il nome di classe "SvcCap" nel codice, nel file svc e nel file di configurazione contemporaneamente.
    // NOTA: per avviare il client di prova WCF per testare il servizio, selezionare SvcCap.svc o SvcCap.svc.cs in Esplora soluzioni e avviare il debug.
    public class SvcCap : CapWrapper
    {
        [return: MessageParameter(Name = "resultMessage")]
        public esito acceptFeedMessage(string feedData, string inputMessage)
        {
            throw new NotImplementedException();
        }

        [return: MessageParameter(Name = "resultMessage")]
        public Task<esito> acceptFeedMessageAsync(string feedData, string inputMessage)
        {
            throw new NotImplementedException();
        }

        [return: MessageParameter(Name = "resultMessage")]
        public esito acceptMessage(string inputMessage)
        {
            throw new NotImplementedException();
        }

        [return: MessageParameter(Name = "resultMessage")]
        public Task<esito> acceptMessageAsync(string inputMessage)
        {
            throw new NotImplementedException();
        }

        [return: MessageParameter(Name = "resultMessage")]
        public esito acceptSatMessage(string inputMessage)
        {
            throw new NotImplementedException();
        }

        [return: MessageParameter(Name = "resultMessage")]
        public Task<esito> acceptSatMessageAsync(string inputMessage)
        {
            throw new NotImplementedException();
        }

        [return: MessageParameter(Name = "resultMessage")]
        public esito receiveMessage(string token, string inputMessage)
        {
            throw new NotImplementedException();
        }

        [return: MessageParameter(Name = "resultMessage")]
        public Task<esito> receiveMessageAsync(string token, string inputMessage)
        {
            throw new NotImplementedException();
        }

        [return: MessageParameter(Name = "welcomeMessage")]
        public esito welcome()
        {
            throw new NotImplementedException();
        }

        [return: MessageParameter(Name = "welcomeMessage")]
        public Task<esito> welcomeAsync()
        {
            throw new NotImplementedException();
        }
    }
}
