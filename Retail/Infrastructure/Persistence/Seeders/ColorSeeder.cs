using Microsoft.EntityFrameworkCore;
using Retailen.Domain.Entities.Product;
using Attribute = Retailen.Domain.Entities.Product.Attribute;

namespace Retailen.Infrastructure.Persistence.Seeders
{
    public static class ColorSeeder
    {
        public static async Task SeedColorsAsync(AppDbContext context)
        {
            var colorAttr = await context.Attributes.FirstOrDefaultAsync(a => a.Name == "Color");
            if (colorAttr == null)
            {
                colorAttr = new Attribute
                {
                    Name = "Color",
                    Code = "color",
                    DataType = "string",
                    Unit = null
                };
                context.Attributes.Add(colorAttr);
                await context.SaveChangesAsync();
            }

            bool hasProductColors = await context.ProductAttributes.AnyAsync(pa => pa.AttributeId == colorAttr.Id);
            if (hasProductColors)
            {
                return;
            }

            var allColors = await context.AttributeColors.Select(c => c.Name).ToListAsync();
            
            var curatedPalette = new List<string> 
            { 
                "Beige", "Black", "Brown", "Charcoal", "Gold", 
                "Gray", "Ivory", "Navy", "Olive", "White" 
            };
            
            var availableColors = allColors.Where(c => curatedPalette.Contains(c)).ToList();

            if (!availableColors.Any()) return;

            var products = await context.Products.Include(p => p.ProductAttributes).ToListAsync();
            var random = new Random();

            foreach (var product in products)
            {
                int count = random.Next(1, 3);
                var pickedColors = availableColors.OrderBy(x => random.Next()).Take(count).ToList();

                foreach (var colorName in pickedColors)
                {
                    var pa = new ProductAttribute
                    {
                        ProductId = product.Id,
                        AttributeId = colorAttr.Id,
                        ValueString = colorName
                    };
                    context.ProductAttributes.Add(pa);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
