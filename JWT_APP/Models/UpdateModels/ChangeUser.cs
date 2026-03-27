namespace JwtBearer.Models.UpdateModels;

public record ChangeUser
{
    public int? Id {get;set;}
    public string? Name {get;set;}
    public string? Email {get;set;}
    public bool? IsAdmin {get;set;}
}
