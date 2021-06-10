using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Classi.Composizione
{
    public class ComposizioneSquadra
    {
        //public string Id { get; set; }
        public SquadraComposizione Squadra { get; set; }
        public List<MezzoPreaccoppiato> MezziPreaccoppiati { get; set; }
        public DateTime IstanteScadenzaSelezione { get; set; }

        //public string IdOperatore { get; set; }
        //public List<ComposizioneMezziAssociatiSquadre> ListaMezzi { get; set; }
    }

    public class SquadraComposizione
    {

        public string Id { get; set; }

        public bool ColonnaMobile { get; set; }

        public bool DiEmergenza { get; set; }

        public string Codice { get; set; }
        public string Nome { get; set; }
        public string Stato { get; set; }
        public List<Componente> Componenti { get; set; }
        public string Distaccamento { get; set; }
        //public DateTime? IstanteTermineImpegno { get; set; }

        //public List<string> ListaCodiciFiscaliComponentiSquadra { get; set; }

        public decimal IndiceOrdinamento { get; set; }

        public string Turno { get; set; }
        public DateTime DataInServizio { get; set; }
    }

    public class MezzoPreaccoppiato
    {
        public string Codice { get; set; }
        public string Tipo { get; set; }
        public string Stato { get; set; }
    }
}
