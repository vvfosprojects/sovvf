using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Modello.Servizi.Infrastruttura.Autenticazione;
using RestInterface.Models;

namespace RestInterface.Controllers
{
    public class InfoAutenticazioneController : ApiController
    {
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;

        public InfoAutenticazioneController(IGetOperatoreAutenticato getOperatoreAutenticato)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
        }

        public InfoUtenteAutenticato Get()
        {
            //preleva username dell'operatore autenticato
            var username = getOperatoreAutenticato.Get();

            //una volta avuta la username, usiamo altro servizio per recuperare i dati anagrafici per username
            //var nominativo = servizio2.Get(username);

            return new InfoUtenteAutenticato()
            {
                Username = username
            };
        }
    }
}
