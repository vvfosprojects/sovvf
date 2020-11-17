using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace Prova_Polly2
{
    public interface IHttpRequestManager<OutputData>
    {
        Task<OutputData> ExecuteGet(Uri url);

        Task<OutputData> ExecutePost(Uri url, HttpContent content);

        Task<OutputData> ExecutePut(Uri url, HttpContent content);
    }
}
