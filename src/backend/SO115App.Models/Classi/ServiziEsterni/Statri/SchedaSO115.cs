using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ServiziEsterni.Statri
{
    public class SchedaSO115
    {
        public virtual int Scheda { get; set; }
        public virtual int AnnoIntervento { get; set; }
        public virtual int Progressivo { get; set; }
        public virtual string SiglaComando { get; set; }
        public virtual DateTime DataIntervento { get; set; }
        public virtual int CodiceSedeServizio { get; set; }
        public virtual int? SchedaAltroComando { get; set; }
        public virtual string ProvinciaIntervento { get; set; }
        public virtual int? CodiceComune { get; set; }
        public virtual DateTime Chiamata { get; set; }
        public virtual DateTime? UscitaDallaSede { get; set; }
        public virtual DateTime? ArrivoSulLuogo { get; set; }
        public virtual DateTime? PartenzaDalLuogo { get; set; }
        public virtual DateTime? RientroInSede { get; set; }
        public virtual int CodiceTipologia { get; set; }
        public virtual string CodiceCalamita { get; set; }
        public virtual string ViaPiazza { get; set; }
        public virtual string NumeroCivico { get; set; }
        public virtual int Boschi { get; set; }
        public virtual int Pascoli { get; set; }
        public virtual int Altro { get; set; }
        public virtual string RichiedenteIntervento { get; set; }
        public virtual string Telefono { get; set; }
        public virtual bool InterventoPiuSquadre { get; set; }
        public virtual bool PoliziaDiStato { get; set; }
        public virtual bool Carabinieri { get; set; }
        public virtual bool GuardiaForestale { get; set; }
        public virtual bool GuardiaDiFinanza { get; set; }
        public virtual bool FFAA { get; set; }
        public virtual bool VolontariCivili { get; set; }
        public virtual bool VigiliUrbani { get; set; }
        public virtual bool USL { get; set; }
        public virtual int APS { get; set; }
        public virtual int ABP { get; set; }
        public virtual int AS1 { get; set; }
        public virtual int AG { get; set; }
        public virtual int AFPOL { get; set; }
        public virtual int AL { get; set; }
        public virtual int AF { get; set; }
        public virtual int ACTSCH { get; set; }
        public virtual int CA { get; set; }
        public virtual int CAESK { get; set; }
        public virtual int AV { get; set; }
        public virtual int ATRID { get; set; }
        public virtual int MBP { get; set; }
        public virtual int MS { get; set; }
        public virtual int ELI { get; set; }
        public virtual bool MezzoNonCodificato { get; set; }
        public virtual int AFNUC { get; set; }
        public virtual int CANUC { get; set; }
        public virtual int BA { get; set; }
        public virtual int BP { get; set; }
        public virtual int AIS { get; set; }
        public virtual int ARI { get; set; }
        public virtual string CFFUNZSERV { get; set; }
        public virtual string ProvAltroComando { get; set; }
        public virtual string NumProtocolloFono { get; set; }
        public virtual DateTime? DataProtocollo { get; set; }
        public virtual string Note_Intervento { get; set; }
        public virtual string Note_Operatore { get; set; }
        public virtual double? Latitudine { get; set; }
        public virtual double? Longitudine { get; set; }
        public virtual bool RilevanteStArCu { get; set; }
        public virtual IList<AutomezzoSO115> AutomezziSO115 { get; set; }
        public virtual IList<PersonaSO115> PersoneSO115 { get; set; }
    }
}
