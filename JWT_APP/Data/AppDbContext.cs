namespace JwtBearer.Data;

using JwtBearer.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options) { }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // ============================================
        // USER
        // ============================================
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.IsAdmin).HasColumnName("is_admin");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            
            entity.HasIndex(e => e.Email).IsUnique();
            
            entity.Property(e => e.IsAdmin).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            // Relacionamento
            entity.HasMany(e => e.Orders)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        
        // ============================================
        // PRODUCT
        // ============================================
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.Stock).HasColumnName("stock");
            entity.Property(e => e.ImageUrl).HasColumnName("image_url");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            
            entity.Property(e => e.Price).HasPrecision(10, 2);
            entity.Property(e => e.Stock).HasDefaultValue(0);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasIndex(e => e.IsActive);
            
            // Relacionamento
            entity.HasMany(e => e.OrderItems)
                .WithOne(e => e.Product)
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        
        // ============================================
        // ORDER
        // ============================================
        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("orders");
            
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Total).HasColumnName("total");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            
            entity.Property(e => e.Total).HasPrecision(10, 2);
            entity.Property(e => e.Status).HasDefaultValue("pending");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.Status);
            
            // Relacionamento
            entity.HasMany(e => e.OrderItems)
                .WithOne(e => e.Order)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });
        
        
        // ============================================
        // ORDER ITEM
        // ============================================
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("order_items");
            
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Price).HasColumnName("price");
            
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            
            entity.Property(e => e.Price).HasPrecision(10, 2);
            
            entity.HasCheckConstraint("check_quantity_positive", "quantity > 0");
            
            entity.HasIndex(e => e.OrderId);
        });
    }
}