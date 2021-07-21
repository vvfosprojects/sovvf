using CsvHelper;
using CsvHelper.Configuration;
using SO115App.Persistence.File.PDFManagement.TemplateModelForms;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;

namespace SO115App.Persistence.File.CSVManagement
{
    internal sealed class CSVTemplateManager<TemplateModelForm> : ICSVTemplateManager<TemplateModelForm> where TemplateModelForm : class
    {
        private MemoryStream memoryStream; 
        private StreamWriter streamWriter; 
        private CsvWriter csvWriter;

        public CSVTemplateManager() 
        {
            memoryStream = new MemoryStream();
            streamWriter = new StreamWriter(memoryStream);
            csvWriter = new CsvWriter(streamWriter, new CsvConfiguration(CultureInfo.InvariantCulture));

            csvWriter.Context.Configuration.Delimiter = ";";
        }

        public MemoryStream GenerateAndDownload(TemplateModelForm template, string fileName, string requestFolder)
        {
            switch (template)
            {
                case DettaglioChiamataModelForm model: generaDettaglioChiamataCSV(model); break;

                case DettaglioInterventoModelForm model: generaDettaglioInterventoCSV(model); break;

                case RiepilogoInterventiModelForm model: generaRiepilogoInterventoCSV(model); break;

                default: throw new NotImplementedException("Template non gestito");
            }

            csvWriter.Flush();
            
            return memoryStream;
        }

        //TODO SISTEMARE MAPPING, provare a leggere un file con header

        private void generaDettaglioChiamataCSV(DettaglioChiamataModelForm model)
        {
            csvWriter.Context.AutoMap<DettaglioChiamataMap>();

            csvWriter.WriteRecords(new List<DettaglioChiamataModelForm>() { model });
        }

        private void generaDettaglioInterventoCSV(DettaglioInterventoModelForm model)
        {
            //csvWriter.Context.RegisterClassMap(model.GetType());
            csvWriter.WriteRecords(new List<DettaglioInterventoModelForm>() { model });
        }

        private void generaRiepilogoInterventoCSV(RiepilogoInterventiModelForm model)
        {
            //csvWriter.Context.RegisterClassMap<RiepilogoInterventiMap>();
            csvWriter.WriteRecords(model.lstRiepiloghi);
        }
    }

    internal class DettaglioChiamataMap : ClassMap<DettaglioChiamataModelForm>
    {
        public DettaglioChiamataMap()
        {
            Map(f => f.Chiamata.Civ_Km).Index(0);
            Map(f => f.Chiamata.Comune).Index(1);
            Map(f => f.Chiamata.DataOraChiamata).Index(2);
            Map(f => f.Chiamata.Dettaglio).Index(3);
            Map(f => f.Chiamata.Interno).Index(4);
            Map(f => f.Chiamata.NoteChiamata).Index(5);
            Map(f => f.Chiamata.NumeroChiamata).Index(6);
            Map(f => f.Chiamata.Operatore).Index(7);
            Map(f => f.Chiamata.Palazzo).Index(8);
            Map(f => f.Chiamata.Piano).Index(9);
            Map(f => f.Chiamata.Prov).Index(10);
            Map(f => f.Chiamata.Richiedente).Index(11);
            Map(f => f.Chiamata.RichiedenteTelefono).Index(12);
            Map(f => f.Chiamata.Scala).Index(13);
            Map(f => f.Chiamata.Tipologia).Index(14);
            Map(f => f.Chiamata.TitoloDistaccamento).Index(15);
        }
    }

    internal class RiepilogoInterventiMap : ClassMap<RiepilogoInterventiModelForm>
    {
        public RiepilogoInterventiMap()
        {
            //Map(f => f.lstRiepiloghi.);
        }
    }
}
