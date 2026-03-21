using JwtBearer.Services;
using JwtBearer.Models;
using JwtBearer.Models.UpdateModels;
using JwtBearer.Models.Register;
using JwtBearer.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddTransient<TokenService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()      
              .AllowAnyMethod()      
              .AllowAnyHeader();     
    });
});

var app = builder.Build();

app.UseCors();




app.MapGet("/testing", () =>
{
   return Results.Ok("ok"); 
});

app.MapGet("/Users/all/filter/page{Page}", async (AppDbContext dbContext,int Page) =>
{       
    var query = dbContext.Users.AsQueryable();

        var users = await query
        .Skip((Page - 1) * 5)
        .Take(5)
        .Select(u => new
        {
            u.Id,
            u.Name,
            u.Email,
            u.IsAdmin,
            CreatedAt = u.CreatedAt.ToString("dd/MM/yyyy HH:mm")
        })
        .ToListAsync();

        return Results.Ok(new
        {
            Sucess = true,
            Data = users
        });
    
});


app.MapGet("/api/admin/users/filter", async (
    
    AppDbContext db,
    string? Search,
    bool? IsAdmin,
    DateTime? DateFrom,
    DateTime? DateTo,
    string SortBy = "name",
    string Order = "asc",
    int Page = 1,
    int PageSize = 5
   
) =>
{
    var query = db.Users.AsQueryable();
    

    if (!string.IsNullOrEmpty(Search))
    {
        query = query.Where(u => 
            u.Name.Contains(Search) || 
            u.Email.Contains(Search) ||
            u.Id.ToString().Contains(Search)
        );
    }
    
    if (IsAdmin.HasValue)
    {
        query = query.Where(u => u.IsAdmin == IsAdmin.Value);
    }
    
    if (DateFrom.HasValue)
    {
        var dateFromUtc = DateTime.SpecifyKind(DateFrom.Value, DateTimeKind.Utc);
        query = query.Where(u => u.CreatedAt >= dateFromUtc);
    }
    
    if (DateTo.HasValue)
    {
        var dateToUtc = DateTime.SpecifyKind(DateTo.Value, DateTimeKind.Utc);
        query = query.Where(u => u.CreatedAt <= dateToUtc);
    }
    
    query = (SortBy.ToLower(), Order.ToLower()) switch
    {
        ("id", "desc") => query.OrderByDescending(u => u.Id),
        ("id", _) => query.OrderBy(u => u.Id),
        
        ("name", "desc") => query.OrderByDescending(u => u.Name),
        ("name", _) => query.OrderBy(u => u.Name),
        
        ("email", "desc") => query.OrderByDescending(u => u.Email),
        ("email", _) => query.OrderBy(u => u.Email),
        
        ("createdat", "desc") => query.OrderByDescending(u => u.CreatedAt),
        ("createdat", _) => query.OrderBy(u => u.CreatedAt),
        
        _ => query.OrderBy(u => u.Name) 
    };
    
    
    var totalCount = await query.CountAsync();
    
    
    var users = await query
        .Skip((Page - 1) * PageSize)
        .Take(PageSize)
        .Select(u => new
        {
            u.Id,
            u.Name,
            u.Email,
            u.IsAdmin,
            CreatedAt = u.CreatedAt.ToString("dd/MM/yyyy HH:mm")
        })
        .ToListAsync();
    
    
    var totalPages = (int)Math.Ceiling(totalCount / (double)PageSize);
    
    
    return Results.Ok(new
    {
        Success = true,
        Message = $"Encontrados {totalCount} usuários",
        Data = users,
        Pagination = new
        {
            CurrentPage = Page,
            PageRenderingSize = PageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = Page > 1,
            HasNextPage = Page < totalPages
        },
        AppliedFilters = new
        {
            Search,
            IsAdmin,
            DateFrom = DateFrom?.ToString("yyyy-MM-dd"),
            DateTo = DateTo?.ToString("yyyy-MM-dd"),
            SortBy,
            Order
        }
    });
});


app.MapGet("/api/admin/orders/all/{Page?}", async (AppDbContext db,int Page = 1) =>
{    
    var orders = await db.Orders
        .Include(o => o.User )
        .Include(o => o.OrderItems)
           .ThenInclude(oi => oi.Product)
        .OrderByDescending(o => o.CreatedAt)     
        .Select(o => new
        {
            o.Id,
            o.Total,
            o.Status,
            User = new
            {
                o.User.Id,
                o.User.Email
            },
            Products = o.OrderItems.Select(oi => new
            {
                ProductIdentifer = oi.ProductId,
                ProductName = oi.Product.Name,
                ProductPrice = oi.Product.Price,
                ProductStock = oi.Product.Stock
            })
        })
        .Skip((Page - 1) * 2)
        .Take(2)
        .ToListAsync();

    return Results.Ok(new
    {
        success = true,
        ordersData = orders
    });
});


app.MapGet("/api/admin/orders/filter/{Page?}", async 
(
    AppDbContext db,
    int? orderId,
    DateTime? DateFrom,
    DateTime? DateTo,
    int? UserId,
    string? UserNameOrEmail,
    string? OrderStatus,
    int? SomeProductId,
    string? SomeProductName,
    int? productsQuantity,
    string SortBy = "name",
    string Order = "asc",
    int Page = 1

) =>
{
    
    var query = db.Orders
    .Include(u => u.User)
    .Include(oi => oi.OrderItems)
        .ThenInclude(p => p.Product)
    .AsQueryable();
    

    if(orderId != 0)
    {
        query = query.Where(u => u.UserId == orderId);
    }
    if(UserId != 0)
    {
        query = query.Where(o => o.User.Id == UserId);
    }
    if(UserNameOrEmail != null)
    {
        query = query.Where(o => o.User.Name.Contains(UserNameOrEmail) || o.User.Email.Contains(UserNameOrEmail));
    }
    if(OrderStatus != null)
    {
        query = query.Where(o => o.Status.Contains(OrderStatus));
    }
    if(SomeProductId != 0)
    {
        query = query.Where(o => o.OrderItems.Any(o => o.Product.Id == SomeProductId));
    }
    if(SomeProductName != null)
    {
        query = query.Where(o => o.OrderItems.Any(o => o.Product.Name.Contains(SomeProductName)));
    }
    if(productsQuantity != 0)
    {
        query = query.Where(o => o.OrderItems.Count == productsQuantity);
    }

    if (DateFrom.HasValue)
    {
        var dateFromUtc = DateTime.SpecifyKind(DateFrom.Value, DateTimeKind.Utc);
        query = query.Where(u => u.CreatedAt >= dateFromUtc);
    }
    
    if (DateTo.HasValue)
    {
        var dateToUtc = DateTime.SpecifyKind(DateTo.Value, DateTimeKind.Utc);
        query = query.Where(u => u.CreatedAt <= dateToUtc);
    }
    

    query = (SortBy.ToLower(), Order.ToLower()) switch
    {
        ("id", "desc") => query.OrderByDescending(u => u.Id),
        ("id", _) => query.OrderBy(u => u.Id),
        
        ("name", "desc") => query.OrderByDescending(u => u.User.Name),
        ("name", _) => query.OrderBy(u => u.User.Name),
        
        ("email", "desc") => query.OrderByDescending(u => u.User.Email),
        ("email", _) => query.OrderBy(u => u.User.Email),
        
        ("createdat", "desc") => query.OrderByDescending(u => u.CreatedAt),
        ("createdat", _) => query.OrderBy(u => u.CreatedAt),
        
        _ => query.OrderBy(u => u.User.Name) 
    };
    
    var FilteredOrders = await query
    .Skip((Page -1) * 2)
    .Take(2)
    .Select(o => new
    {
        o.Id,
        o.Total,
        o.Status,
        User = new
        {
            o.User.Id,
            o.User.Email
        },
        Products = o.OrderItems.Select(oi => new
        {
        ProductIdentifer = oi.ProductId,
            ProductName = oi.Product.Name,
            ProductPrice = oi.Product.Price,
            ProductStock = oi.Product.Stock
        })
    })
    .ToListAsync();

});



app.MapPost("/auth/register", (RegisterRequest request) =>
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var existingUser = dbContext.Users.FirstOrDefault(u => u.Email == request.Email);
        
        if (existingUser != null)
        {
            return Results.Conflict();
        }
        else
        {
            User newUser = new User { Name = request.Name, Email = request.Email, PasswordHash = request.Password};
            dbContext.Users.Add(newUser);
            dbContext.SaveChanges();
            return Results.Ok();
        }
    }
});


app.MapPut("/api/admin/orders/update", async (AppDbContext db, UpdateOrder upOrder) =>
{  
    HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
    };
    if (!ValidStatuses.Contains(upOrder.NewState))
    {
        return Results.BadRequest("Status inválido");
    }
    if(upOrder.Id == 0)
    {
      return Results.BadRequest("Id invalido");   
    }
  
   Order? selectedOrder = await db.Orders.FindAsync(upOrder.Id);

   if(selectedOrder == null )
    {
        return Results.BadRequest($"O pedido com o id {upOrder.Id} nao existe");
    }  
   
    selectedOrder.Status = upOrder.NewState;
    selectedOrder.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
   
   return Results.Ok("status do pedido trocado com sucesso!");
});

app.MapPost("/api/admin/users/change", async (
    ChangeUser changeUserRequest, 
    AppDbContext appDbContext
) =>
{
    if (!changeUserRequest.Id.HasValue || changeUserRequest.Id.Value <= 0)
    {
        return Results.BadRequest(new
        {
            Success = false,
            Message = "ID inválido"
        });
    }

    var userToChange = await appDbContext.Users.FindAsync(changeUserRequest.Id.Value);
    
    if (userToChange == null)
    {
        return Results.NotFound(new
        {
            Success = false,
            Message = $"Usuário {changeUserRequest.Id} não foi encontrado"
        });
    }

    if (!string.IsNullOrWhiteSpace(changeUserRequest.Email))
    {
        var emailExists = await appDbContext.Users
            .AnyAsync(u => 
                u.Email == changeUserRequest.Email && 
                u.Id != changeUserRequest.Id.Value
            );
        
        if (emailExists)
        {
            return Results.Conflict(new
            {
                Success = false,
                Message = "Email já está em uso por outro usuário"
            });
        }
    }

    if (!string.IsNullOrWhiteSpace(changeUserRequest.Name))
    {
        userToChange.Name = changeUserRequest.Name;
    }
    
    if (!string.IsNullOrWhiteSpace(changeUserRequest.Email))
    {
        userToChange.Email = changeUserRequest.Email;
    }
    
    if (changeUserRequest.IsAdmin ==true)
    {
        userToChange.IsAdmin = true;
    }else{
        userToChange.IsAdmin = false;
    }

    await appDbContext.SaveChangesAsync();

    return Results.Ok(new
    {
        Success = true,
        Message = $"Usuário {changeUserRequest.Id} alterado com sucesso!",
        Data = new
        {
            userToChange.Id,
            userToChange.Name,
            userToChange.Email,
            userToChange.IsAdmin
        }
    });
});


app.Run();
