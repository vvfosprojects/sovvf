using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using System.Linq;
using System.Reflection;

namespace SO115App.Persistence.MongoDB.Convention
{
    /// <summary>
    ///   A convention to ensure that read-only properties are automatically mapped (and therefore serialised).
    /// </summary>
    public class MapReadOnlyPropertiesConvention : ConventionBase, IClassMapConvention
    {
        private readonly BindingFlags _bindingFlags;

        public MapReadOnlyPropertiesConvention() : this(BindingFlags.Instance | BindingFlags.Public)
        {
        }

        public MapReadOnlyPropertiesConvention(BindingFlags bindingFlags)
        {
            _bindingFlags = bindingFlags | BindingFlags.DeclaredOnly;
        }

        public void Apply(BsonClassMap classMap)
        {
            var readOnlyProperties = classMap
                .ClassType
                .GetTypeInfo()
                .GetProperties(_bindingFlags)
                .Where(p => IsReadOnlyProperty(classMap, p))
                .ToList();

            foreach (var property in readOnlyProperties)
            {
                classMap.MapMember(property);
            }
        }

        private static bool IsReadOnlyProperty(BsonClassMap classMap, PropertyInfo propertyInfo)
        {
            if (!propertyInfo.CanRead) return false;
            if (propertyInfo.CanWrite) return false; // already handled by default convention
            if (propertyInfo.GetIndexParameters().Length != 0) return false; // skip indexers

            var getMethodInfo = propertyInfo.GetMethod;

            // skip overridden properties (they are already included by the base class)
            if (getMethodInfo.IsVirtual && getMethodInfo.GetBaseDefinition().DeclaringType != classMap.ClassType) return false;

            return true;
        }
    }
}
