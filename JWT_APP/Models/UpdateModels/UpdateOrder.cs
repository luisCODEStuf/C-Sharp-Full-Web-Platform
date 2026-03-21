namespace JwtBearer.Models.UpdateModels;

public record UpdateOrder
{
    public int Id {get;set;}
    public string? NewState {get;set;}
}