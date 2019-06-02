using Bogus;
using SO115App.API.Models.Classi.Condivise;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.GeneratoreRichiesteFake
{
    /// <summary>
    ///   Servizio di generazione coordinate interventi in base alle statistiche disponibili per ogni
    ///   unità operativa. Il servizio dispone delle coordinate medie e delle relative deviazioni
    ///   standard. Calcola le coordinate di un intervento con una gaussiana bidimensionale.
    /// </summary>
    public class GeneratoreCoordinateInterventoPerUO
    {
        private static Faker faker = new Faker("it");

        private class StatisticaUo
        {
            public StatisticaUo(
                string codiceUO,
                double avgLat,
                double avgLon,
                double stDevLat,
                double stDevLon)
            {
                CodiceUO = codiceUO;
                AvgLat = avgLat;
                AvgLon = avgLon;
                StDevLat = stDevLat;
                StDevLon = stDevLon;
            }

            public string CodiceUO { get; }
            public double AvgLat { get; }
            public double AvgLon { get; }
            public double StDevLat { get; }
            public double StDevLon { get; }
        }

        private Dictionary<string, StatisticaUo> statistiche = new Dictionary<string, StatisticaUo>()
        {
            { "AG", new StatisticaUo("AG", 37.330974, 13.5640261, .1401794, .2809317) },
            { "AL", new StatisticaUo("AL", 44.8763306, 8.6368015, .1446065, .1525943) },
            { "AN", new StatisticaUo("AN", 43.5453183, 13.3084775, .1071354, .2218016) },
            { "AP", new StatisticaUo("AP", 42.9430761, 13.6148155, .1427901, .1883689) },
            { "AQ", new StatisticaUo("AQ", 42.1604321, 13.5617329, .2020197, .2693167) },
            { "AR", new StatisticaUo("AR", 43.4893967, 11.818725, .1296866, .1694405) },
            { "AT", new StatisticaUo("AT", 44.8823464, 8.2093568, .0816813, .0983316) },
            { "AV", new StatisticaUo("AV", 40.9483285, 14.9127293, .0856377, .1930066) },
            { "BA", new StatisticaUo("BA", 41.0870032, 16.7390892, .1330293, .2585311) },
            { "BG", new StatisticaUo("BG", 45.6875617, 9.7037439, .1079735, .1426631) },
            { "BI", new StatisticaUo("BI", 45.5724753, 8.0927333, .0544191, .077876) },
            { "BL", new StatisticaUo("BL", 46.2916896, 12.1847729, .204211, .2218375) },
            { "BN", new StatisticaUo("BN", 41.1515669, 14.7155918, .0842846, .1285881) },
            { "BO", new StatisticaUo("BO", 44.4777548, 11.3601658, .113175, .1630072) },
            { "BR", new StatisticaUo("BR", 40.621696, 17.8192317, .079506, .1731214) },
            { "BS", new StatisticaUo("BS", 45.5854807, 10.2358916, .1714797, .1858545) },
            { "CA", new StatisticaUo("CA", 39.2675037, 9.0464911, .1063409, .2332556) },
            { "CB", new StatisticaUo("CB", 41.7340317, 14.8118627, .1916263, .1726846) },
            { "CE", new StatisticaUo("CE", 41.0821458, 14.1974739, .1007949, .1620574) },
            { "CH", new StatisticaUo("CH", 42.2525258, 14.3702728, .1294337, .2033688) },
            { "CL", new StatisticaUo("CL", 37.3185709, 14.120838, .203095, .1481222) },
            { "CN", new StatisticaUo("CN", 44.5387544, 7.7190108, .1600294, .2433928) },
            { "CO", new StatisticaUo("CO", 45.8145, 9.1147343, .1169707, .0996154) },
            { "CR", new StatisticaUo("CR", 45.2298288, 9.9098322, .1165381, .2125013) },
            { "CS", new StatisticaUo("CS", 39.4846432, 16.2618318, .2175822, .2258932) },
            { "CT", new StatisticaUo("CT", 37.5444304, 15.0236646, .1366359, .1603973) },
            { "CZ", new StatisticaUo("CZ", 38.8629127, 16.5098759, .110192, .1500481) },
            { "EA", new StatisticaUo("EA", 42.6357426, 13.2842811, .0280268, .0274129) },
            { "EN", new StatisticaUo("EN", 37.5538749, 14.3623871, .1181692, .1213289) },
            { "FE", new StatisticaUo("FE", 44.7979476, 11.7148122, .079765, .2904216) },
            { "FG", new StatisticaUo("FG", 41.498392, 15.6146933, .1681534, .2099366) },
            { "FI", new StatisticaUo("FI", 43.771509, 11.2158843, .0906056, .1546706) },
            { "FO", new StatisticaUo("FO", 44.1575626, 12.1359238, .0846947, .1513776) },
            { "FR", new StatisticaUo("FR", 41.6117171, 13.4973384, .1093956, .2352457) },
            { "GE", new StatisticaUo("GE", 44.4098325, 8.9775481, .0566731, .1801756) },
            { "GO", new StatisticaUo("GO", 45.8713209, 13.5335417, .0856883, .0776811) },
            { "GR", new StatisticaUo("GR", 42.7732368, 11.1134376, .157742, .2354968) },
            { "IM", new StatisticaUo("IM", 43.8480809, 7.8341079, .0532788, .1667633) },
            { "IS", new StatisticaUo("IS", 41.6257574, 14.2249759, .1226001, .1273509) },
            { "KR", new StatisticaUo("KR", 39.1314605, 17.0503712, .1292843, .1307696) },
            { "LC", new StatisticaUo("LC", 45.8237318, 9.3780312, .1150911, .054265) },
            { "LE", new StatisticaUo("LE", 40.2168553, 18.1583201, .1745665, .1240282) },
            { "LI", new StatisticaUo("LI", 43.3850917, 10.3829776, .2572026, .1031847) },
            { "LO", new StatisticaUo("LO", 45.2584163, 9.5124414, .0766849, .1132602) },
            { "LT", new StatisticaUo("LT", 41.4151219, 13.0891819, .1206889, .3269041) },
            { "LU", new StatisticaUo("LU", 43.8910347, 10.3969804, .0796927, .1492441) },
            { "MC", new StatisticaUo("MC", 43.1596789, 13.2616702, .1382637, .2168671) },
            { "ME", new StatisticaUo("ME", 38.1449301, 15.3218682, .1300765, .3008055) },
            { "MI", new StatisticaUo("MI", 45.5027381, 9.1734372, .074712, .1183386) },
            { "MN", new StatisticaUo("MN", 45.1341836, 10.7371461, .1290664, .1781503) },
            { "MO", new StatisticaUo("MO", 44.6126825, 10.9190961, .1666623, .1229721) },
            { "MS", new StatisticaUo("MS", 44.0810853, 10.0778039, .0924665, .0743659) },
            { "MT", new StatisticaUo("MT", 40.4903175, 16.6017748, .1957728, .1005872) },
            { "NA", new StatisticaUo("NA", 40.8520309, 14.2669557, .0670448, .1287644) },
            { "NO", new StatisticaUo("NO", 45.5643876, 8.5743564, .1382822, .0956943) },
            { "NU", new StatisticaUo("NU", 40.2119629, 9.3419134, .2366576, .297437) },
            { "OR", new StatisticaUo("OR", 39.9194983, 8.6612966, .1285675, .1190819) },
            { "PA", new StatisticaUo("PA", 38.1013576, 13.360972, .0798345, .1489361) },
            { "PC", new StatisticaUo("PC", 44.9937756, 9.6897211, .0912952, .1465823) },
            { "PD", new StatisticaUo("PD", 45.3887573, 11.8439511, .1216731, .1259874) },
            { "PE", new StatisticaUo("PE", 42.4393082, 14.1395321, .0862985, .1119582) },
            { "PG", new StatisticaUo("PG", 43.0006229, 12.6465543, .2048202, .3077812) },
            { "PI", new StatisticaUo("PI", 43.6648879, 10.5401714, .1070176, .1686607) },
            { "PN", new StatisticaUo("PN", 45.9879232, 12.6946091, .0949983, .1208717) },
            { "PO", new StatisticaUo("PO", 43.8843409, 11.0836132, .044017, .040849) },
            { "PR", new StatisticaUo("PR", 44.7717041, 10.2292247, .110404, .1690213) },
            { "PS", new StatisticaUo("PS", 43.7975504, 12.8218722, .1159662, .1729257) },
            { "PT", new StatisticaUo("PT", 43.9135869, 10.854714, .0557082, .1009979) },
            { "PV", new StatisticaUo("PV", 45.1693031, 9.0320519, .1260214, .1949999) },
            { "PZ", new StatisticaUo("PZ", 40.5868443, 15.8045822, .3118224, .163112) },
            { "RA", new StatisticaUo("RA", 44.3764937, 12.0801027, .0829915, .1861748) },
            { "RC", new StatisticaUo("RC", 38.1823414, 15.8311704, .1473518, .2328884) },
            { "RE", new StatisticaUo("RE", 44.6977185, 10.6124888, .1259273, .1081354) },
            { "RG", new StatisticaUo("RG", 36.8959872, 14.6592731, .0737793, .1162974) },
            { "RI", new StatisticaUo("RI", 42.3932392, 12.8931628, .1197325, .1824999) },
            { "RM", new StatisticaUo("RM", 41.8698891, 12.5051329, .1207904, .1854377) },
            { "RN", new StatisticaUo("RN", 44.0182792, 12.555281, .067058, .1121922) },
            { "RO", new StatisticaUo("RO", 45.04202, 11.8083007, .0585529, .305352) },
            { "SA", new StatisticaUo("SA", 40.6129356, 14.8854942, .1799275, .2668958) },
            { "SI", new StatisticaUo("SI", 43.2664721, 11.4022435, .1686486, .2381121) },
            { "SO", new StatisticaUo("SO", 46.223767, 9.8078107, .1117488, .3029181) },
            { "SP", new StatisticaUo("SP", 44.1236395, 9.844624, .0477385, .0997096) },
            { "SR", new StatisticaUo("SR", 37.0783176, 15.1832241, .1386681, .1213821) },
            { "SS", new StatisticaUo("SS", 40.7336338, 8.7027836, .1261074, .3993243) },
            { "SV", new StatisticaUo("SV", 44.2354247, 8.3640304, .1306463, .1419774) },
            { "TA", new StatisticaUo("TA", 40.4777272, 17.2879648, .0867038, .1709776) },
            { "TE", new StatisticaUo("TE", 42.6758353, 13.7836051, .095678, .1446473) },
            { "TO", new StatisticaUo("TO", 45.08671, 7.6222294, .1168141, .1792935) },
            { "TP", new StatisticaUo("TP", 37.8619017, 12.6293948, .191904, .1802919) },
            { "TR", new StatisticaUo("TR", 42.5922864, 12.5228067, .0823829, .2049212) },
            { "TS", new StatisticaUo("TS", 45.6490214, 13.7809599, .0295884, .0328172) },
            { "TV", new StatisticaUo("TV", 45.7652687, 12.2192151, .1182054, .1870731) },
            { "UD", new StatisticaUo("UD", 46.0785622, 13.1868641, .2167514, .1581618) },
            { "VA", new StatisticaUo("VA", 45.749779, 8.8168227, .1197008, .1065081) },
            { "VB", new StatisticaUo("VB", 45.9785792, 8.4563419, .0955695, .1273493) },
            { "VC", new StatisticaUo("VC", 45.417363, 8.3017823, .198117, .1358063) },
            { "VE", new StatisticaUo("VE", 45.4839561, 12.3578422, .1399107, .23045) },
            { "VI", new StatisticaUo("VI", 45.6225424, 11.528117, .1574083, .1683604) },
            { "VR", new StatisticaUo("VR", 45.4134784, 11.0047649, .1163896, .1776512) },
            { "VT", new StatisticaUo("VT", 42.405387, 12.1078525, .1127523, .1880309) },
            { "VV", new StatisticaUo("VV", 38.6670353, 16.112641, .1205382, .1301653) },
        };

        public Coordinate Genera(string codiceUO)
        {
            if (this.statistiche.ContainsKey(codiceUO))
            {
                var statistiche = this.statistiche[codiceUO];
                var gaussianaLat = new Gaussiana((float)statistiche.AvgLat, (float)statistiche.StDevLat);
                var gaussianaLon = new Gaussiana((float)statistiche.AvgLon, (float)statistiche.StDevLon);

                return new Coordinate(gaussianaLat.Genera(), gaussianaLon.Genera());
            }

            return new Coordinate(Math.Round(faker.Random.Double(0.0, 1) * 0.03 + 41.850, 6), Math.Round(faker.Random.Double(0.0, 1) * 0.12 + 12.450, 6));
        }
    }
}
