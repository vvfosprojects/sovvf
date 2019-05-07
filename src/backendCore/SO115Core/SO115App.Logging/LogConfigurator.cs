using Serilog;

namespace SO115App.Logging
{
    public static class LogConfigurator
    {
        public static void Configure()
        {
            var log = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .WriteTo.Trace()
                .CreateLogger();

            Log.Logger = log;

            Log.Debug("Log configured");
        }
    }
}