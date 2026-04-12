namespace JwtBearer.Models.UpdateModels;

public record UpdateProduct
(   
    int Id,
    string? Name,
    string? Description,
    decimal? Price,
    int? Stock,
    string? ImageUrl,
    string? IsActive
);