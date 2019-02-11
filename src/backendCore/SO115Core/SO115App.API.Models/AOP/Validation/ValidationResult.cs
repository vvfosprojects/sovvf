namespace SO115App.API.Models.AOP.Validation
{
    public class ValidationResult
    {
        private readonly string code;
        private readonly string message;

        public ValidationResult(string code, string message)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                throw new System.ArgumentNullException(nameof(code));
            }

            if (string.IsNullOrWhiteSpace(message))
            {
                throw new System.ArgumentNullException(nameof(message));
            }

            this.code = code;
            this.message = message;
        }

        public string Code { get; }
        public string Message { get; }
    }
}