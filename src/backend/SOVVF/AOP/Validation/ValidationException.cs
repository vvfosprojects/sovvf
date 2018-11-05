using System;
using System.Runtime.Serialization;

namespace Modello.AOP.Validation
{
    [Serializable]
    internal class ValidationException : Exception
    {
        private ValidationResult[] validationResults;

        public ValidationException()
        {
        }

        public ValidationException(ValidationResult[] validationResults)
        {
            this.validationResults = validationResults;
        }

        public ValidationException(string message) : base(message)
        {
        }

        public ValidationException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected ValidationException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}