using JwtBearer.Models;
namespace JwtBearer.Models;

public class User
{
    public int Id { get; set; }              // PK automática (por convenção)
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }  // Nunca "Password" em texto plano!
    public bool IsAdmin { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Relacionamento (One-to-Many)
    public List<Order> Orders { get; set; } = new();
}
