using System.Globalization;

namespace Retailen.Domain.Entities.Product
{
    public class ProductAttribute
    {
        public long Id { get; set; }                      
        public int ProductId { get; set; }                
        public int AttributeId { get; set; }              
        public string? ValueString { get; set; }          
        public int? ValueInt { get; set; }                
        public decimal? ValueDecimal { get; set; }        
        public DateTime? ValueDate { get; set; }          
        public bool? ValueBool { get; set; }              
        public DateTime CreatedAt { get; set; }

        // Navigation properties
        public Product Product { get; set; } = null!;     
        public Attribute Attribute { get; set; } = null!; 

        public void SetValue(string dataType, string? rawValue)
        {
            ValueString = null;
            ValueInt = null;
            ValueDecimal = null;
            ValueDate = null;
            ValueBool = null;

            if (string.IsNullOrEmpty(rawValue)) return;

            switch (dataType.ToLower())
            {
                case "int":
                case "integer":
                    if (int.TryParse(rawValue, out int iVal)) ValueInt = iVal;
                    break;
                case "decimal":
                case "number": 
                    if (decimal.TryParse(rawValue, NumberStyles.Any,
                        CultureInfo.InvariantCulture, out decimal dVal))
                        ValueDecimal = dVal;
                    break;
                case "bool":
                case "boolean": 
                    if (bool.TryParse(rawValue, out bool bVal)) ValueBool = bVal;
                    break;
                case "date":
                    if (DateTime.TryParse(rawValue, out DateTime dtVal)) ValueDate = dtVal;
                    break;
                default: 
                    ValueString = rawValue;
                    break;
            }
        }

        public string? GetValue()
        {
            if (ValueString != null) return ValueString;
            if (ValueInt != null) return ValueInt.ToString();
            if (ValueDecimal != null) return ValueDecimal.Value.ToString(CultureInfo.InvariantCulture);
            if (ValueBool != null) return ValueBool.ToString();
            if (ValueDate != null) return ValueDate.Value.ToString("yyyy-MM-dd");
            return null;
        }
    }
}