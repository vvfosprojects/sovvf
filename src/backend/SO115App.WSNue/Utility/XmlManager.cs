using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;
using System.Xml.Schema;
using System.IO;
using System.Xml;
using System.Xml.Serialization;
using System.Xml.XPath;

namespace SO115App.WSNue.Utility
{
    public static class XmlManager
    {
        //public static readonly XDeclaration XmlDeclaration = new XDeclaration("1.0", "UTF-8", null);
        //private const string NAMESPACE_CASELLARIO_PSA = "cpsa";

        //public static string XDocumentToString(XDocument xDoc)
        //{
        //    return xDoc.Declaration + xDoc.ToString();
        //}

        //public static XAttribute AttributeOrNullUpper(XName name, string value)
        //{
        //    return string.IsNullOrEmpty(value) ? null : new XAttribute(name, value.ToUpper());
        //}
        //public static XAttribute AttributeOrNull(XName name, string value)
        //{
        //    return string.IsNullOrEmpty(value) ? null : new XAttribute(name, value);
        //}
        //public static XAttribute AttributeOrNull(XName name, DateTime? value)
        //{
        //    return value == null ? null : new XAttribute(name, value);
        //}
        //public static XAttribute AttributeOrNull(XName name, TypePrestazioneDaErogare? value)
        //{
        //    return value == null ? null : new XAttribute(name, value.Value.GetXmlEnumAttributeOrValue());
        //}
        //public static XAttribute AttributeOrNull(XName name, TypeStatoDomandaPrestazione? value)
        //{
        //    return value == null ? null : new XAttribute(name, value.Value.GetXmlEnumAttributeOrValue());
        //}

        //public static void AssignNamespace(XDocument xDoc, XNamespace ns)
        //{
        //    foreach (var item in xDoc.Descendants())
        //    {
        //        item.Name = ns + item.Name.LocalName;
        //    }
        //}

        //public static string SetNamespacePrefix(XmlDocument xdoc, XmlNamespaceManager nsm)
        //{
        //    string pref = null;
        //    if (xdoc.DocumentElement.Prefix == string.Empty)
        //    {
        //        nsm.AddNamespace(NAMESPACE_CASELLARIO_PSA, xdoc.DocumentElement.NamespaceURI);
        //        pref = NAMESPACE_CASELLARIO_PSA + ":";
        //    }
        //    else
        //    {
        //        nsm.AddNamespace(xdoc.DocumentElement.Prefix, xdoc.DocumentElement.NamespaceURI);
        //        pref = xdoc.DocumentElement.Prefix + ":";
        //    }
        //    return pref;
        //}

        public static string FileUri(string schemaUri)
        {
            return "file:///" + schemaUri.Replace(@"\", "/");
        }

        //public static string SchemaValidate(byte[] xmlFile, XmlSchemaSet xSchemaSet)
        //{
        //    string errori = "";

        // XDocument xDoc = XDocument.Load(new MemoryStream(xmlFile));

        // int conta = 0; xDoc.Validate(xSchemaSet, (sender, err) => { errori += "[" + ++conta + "]"
        // + err.Message + "\n"; });

        //    return errori;
        //}

        public static string SchemaValidate(XDocument xDoc, XmlSchemaSet xSchemaSet)
        {
            string errori = "";
            int conta = 0;

            if (!string.IsNullOrWhiteSpace(xDoc.Root.Name.NamespaceName))
            {
                bool contieneRoot = xSchemaSet.Contains(xDoc.Root.Name.NamespaceName);
                if (!contieneRoot)
                {
                    errori += string.Format("[{0}] Il namespace {1} della root è errato.\n", ++conta, xDoc.Root.Name.NamespaceName);
                }
            }

            xDoc.Validate(xSchemaSet, (sender, err) =>
            {
                errori += string.Format("[{0}] {1}\n", ++conta, err.Message);
            });

            return errori;
        }

        public static string ValidateXmlString(string stringaXml, string nomeSchemaXsd, string sNamespace, out XDocument xDoc)
        {
            string errore = "";

            try
            {
                xDoc = XDocument.Parse(stringaXml);
                XmlSchemaSet xSchemaSet = new XmlSchemaSet();
                xSchemaSet.Add(sNamespace, XmlManager.FileUri(nomeSchemaXsd));
                errore = XmlManager.SchemaValidate(xDoc, xSchemaSet);
            }
            catch (Exception ex)
            {
                xDoc = null;
                errore = string.Format("Errore validate - {0}", ex.Message);
            }

            return errore;
        }

        //public static string EstraiStringa(XmlDocument xdoc, string prefix, XmlNamespaceManager nsm, string pattern)
        //{
        //    string xpath = string.Format(pattern, prefix);
        //    XmlNode nodo = xdoc.SelectSingleNode(xpath, nsm);
        //    return nodo == null ? "" : nodo.Value;
        //}

        // La ricerca con namespace di XDocument si fa con "{namespace}elemento" nello string.Format
        // l'escape delle graffe si fa raddoppiandole
        public static string EstraiValue(XDocument xDoc, string elementName, string namespc)
        {
            return EstraiValue(xDoc, string.Format("{{{0}}}{1}", namespc, elementName));
        }

        public static string EstraiValue(XDocument xDoc, string elementName)
        {
            XElement xele = null;
            if (xDoc != null)
                xele = xDoc.Descendants(elementName).FirstOrDefault();
            return xele == null ? "" : xele.Value;
        }

        public static XElement EstraiElement(XDocument xDoc, string elementName, string namespc)
        {
            return EstraiElement(xDoc, string.Format("{{{0}}}{1}", namespc, elementName));
        }

        public static XElement EstraiElement(XDocument xDoc, string elementName)
        {
            XElement xele = null;
            if (xDoc != null)
                xele = xDoc.Descendants(elementName).FirstOrDefault();
            return xele;
        }

        public static string EstraiAttribute(XDocument xDoc, string elementName, string attributeName, string namespc)
        {
            return EstraiAttribute(xDoc, string.Format("{{{0}}}{1}", namespc, elementName), attributeName);
        }

        public static string EstraiAttribute(XDocument xDoc, string elementName, string attributeName)
        {
            XElement xEle = EstraiElement(xDoc, elementName);
            XAttribute xAtt = (xEle == null ? null : xAtt = xEle.Attribute(attributeName));
            return xAtt == null ? null : xAtt.Value;
        }

        // serializzazione
        public static string ObjectToXML(object obj, bool omitXmlDeclaration, string defaultNamespace = Costanti.NUE_NAME_SPACE)
        {
            XmlWriterSettings settings = new XmlWriterSettings();
            settings.OmitXmlDeclaration = omitXmlDeclaration;

            StringWriter sw = new StringWriter();
            XmlWriter writer = XmlWriter.Create(sw, settings);
            new XmlSerializer(obj.GetType(), defaultNamespace).Serialize(writer, obj);
            return sw.ToString();
        }

        public static T Deserialize<T>(XDocument xDoc)
        {
            XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
            using (var reader = xDoc.Root.CreateReader())
            {
                return (T)xmlSerializer.Deserialize(reader);
            }
        }

        public static XDocument CambiaNomeRoot(XDocument xDoc, string newName)
        {
            XNamespace xNs = xDoc.Root.Name.Namespace;
            XDocument result = new XDocument(
                xDoc.Declaration,
                new XElement(xNs + newName, xDoc.Root.Attributes(), xDoc.Root.Nodes()));
            return result;
        }

        public static void CambiaDeclarationInUTF8(XDocument xDoc)
        {
            if (xDoc == null)
                return;

            // salva la vecchia declaration
            XDeclaration oldXDeclaration = xDoc.Declaration;

            // assegna la dichiarazione UTF-8
            xDoc.Declaration = new XDeclaration("1.0", "UTF-8", null);

            // se la vecchia declaration era diversa da UTF-8, la aggiunge come commento in testa
            if (oldXDeclaration != null)
            {
                if (!xDoc.Declaration.Encoding.Equals(oldXDeclaration.Encoding, StringComparison.CurrentCultureIgnoreCase))
                    xDoc.AddFirst(new XComment(oldXDeclaration.ToString()));
            }
        }
    }
}
