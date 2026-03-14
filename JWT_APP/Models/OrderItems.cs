namespace JwtBearer.Models;
using JwtBearer.Models;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }         // FK
    public int ProductId { get; set; }       // FK
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    
    // Relacionamentos
    public Order Order { get; set; }
    public Product Product { get; set; }
}