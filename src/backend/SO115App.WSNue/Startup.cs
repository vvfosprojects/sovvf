using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(SO115App.WSNue.Startup))]

namespace SO115App.WSNue
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
