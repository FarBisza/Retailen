using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Retailen.Application.DTO.Attribute;
using Retailen.Application.Interfaces;

namespace Retailen.Presentation.Controllers
{
    [ApiController]
    [Route("api/attribute")]
    [Authorize(Policy = "RequireStaff")]
    public class AttributeController : ControllerBase
    {
        private readonly IAttributeService _attributeService;

        public AttributeController(IAttributeService attributeService)
        {
            _attributeService = attributeService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<AttributeDTO>>> GetAll()
        {
            var result = await _attributeService.GetAllAttributesAsync();
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<AttributeDTO>> GetById(int id)
        {
            var result = await _attributeService.GetAttributeByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<AttributeDTO>> Create([FromBody] CreateAttributeDTO dto)
        {
            var result = await _attributeService.CreateAttributeAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }


        [HttpGet("product/{productId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ProductAttributeDTO>>> GetProductAttributes(int productId)
        {
            var result = await _attributeService.GetProductAttributesAsync(productId);
            return Ok(result);
        }


        [HttpGet("category/{categoryId:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<CategoryAttributeDTO>>> GetAttributesByCategoryId(int categoryId)
        {
            var result = await _attributeService.GetAttributesByCategoryIdAsync(categoryId);
            return Ok(result);
        }


        [HttpPost("product/{productId:int}")]
        public async Task<IActionResult> SetProductAttribute(int productId, [FromBody] SetProductAttributeDTO dto)
        {
            await _attributeService.SetProductAttributeAsync(productId, dto);
            return Ok(new { message = "Attribute set successfully" });
        }


        [HttpDelete("product/{productId:int}/{attributeId:int}")]
        public async Task<IActionResult> RemoveProductAttribute(int productId, int attributeId)
        {
            await _attributeService.RemoveProductAttributeAsync(productId, attributeId);
            return Ok(new { message = "Attribute removed successfully" });
        }

        [HttpGet("colors")]
        [AllowAnonymous]
        public async Task<ActionResult<List<DictionaryDTO>>> GetColors()
        {
            var result = await _attributeService.GetColorsAsync();
            return Ok(result);
        }

        [HttpGet("materials")]
        [AllowAnonymous]
        public async Task<ActionResult<List<DictionaryDTO>>> GetMaterials()
        {
            var result = await _attributeService.GetMaterialsAsync();
            return Ok(result);
        }

        [HttpGet("sizes")]
        [AllowAnonymous]
        public async Task<ActionResult<List<DictionaryDTO>>> GetSizes()
        {
            var result = await _attributeService.GetSizesAsync();
            return Ok(result);
        }
    }
}