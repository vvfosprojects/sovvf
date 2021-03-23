namespace CQRS.Validation
{
    public class CodeValidationResult
    {
        private readonly int codice;
        public CodeValidationResult(int codice)
        {
            this.codice = codice;
        }

        public int Codice
        {
            get
            {
                return this.codice;
            }
        }

    }
}
