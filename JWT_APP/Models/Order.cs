namespace JwtBearer.Models;
using JwtBearer.Models;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }          // Foreign Key (por convenção)
    public decimal Total { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Relacionamentos
    public User User { get; set; }           // Navigation property
    public List<OrderItem> OrderItems { get; set; } = new();
}