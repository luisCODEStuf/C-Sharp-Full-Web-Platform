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

app.MapGet("/Users/all/filter/page{Page}", async (AppDbContext dbContext, int Page) =>
{
    var query = dbContext.Users.AsQueryable();

    query = query.OrderBy(u => u.Id);

    var totalCount = await query.CountAsync();

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

    var totalPages = (int)Math.Ceiling(totalCount / (double)5);

    return Results.Ok(new
    {
        Success = true,
        Message = $"{totalCount} usuários encontrados",
        Data = users,
        Pagination = new
        {
            CurrentPage = Page,
            PageSize = 5,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = Page > 1,
            HasNextPage = Page < totalPages
        }
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


app.MapGet("/api/admin/orders/all/{Page?}", async (AppDbContext db, int Page = 1) =>
{
    var query = db.Orders.AsQueryable();
    var totalCount = await query.CountAsync();
    
    var orders = await query
        .Include(o => o.User)
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

    var totalPages = (int)Math.Ceiling(totalCount / (double)2);

    return Results.Ok(new
    {
        Success = true,
        Message = $"{totalCount} pedidos encontrados",
        OrdersData = orders,
        Pagination = new
        {
            CurrentPage = Page,
            PageSize = 2,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = Page > 1,
            HasNextPage = Page < totalPages
        }
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


    if (orderId.HasValue && orderId.Value != 0)
    {
        query = query.Where(o => o.Id == orderId.Value);
    }
    if (UserId.HasValue && UserId.Value != 0)
    {
        query = query.Where(o => o.User.Id == UserId.Value);
    }
    if (!string.IsNullOrEmpty(UserNameOrEmail))
    {
        query = query.Where(o => o.User.Name.Contains(UserNameOrEmail) || o.User.Email.Contains(UserNameOrEmail));
    }
    if (!string.IsNullOrEmpty(OrderStatus))
    {
        query = query.Where(o => o.Status == OrderStatus);
    }
    if (SomeProductId.HasValue && SomeProductId.Value != 0)
    {
        query = query.Where(o => o.OrderItems.Any(oi => oi.Product.Id == SomeProductId.Value));
    }
    if (!string.IsNullOrEmpty(SomeProductName))
    {
        query = query.Where(o => o.OrderItems.Any(oi => oi.Product.Name.Contains(SomeProductName)));
    }
    if (productsQuantity.HasValue && productsQuantity.Value != 0)
    {
        query = query.Where(o => o.OrderItems.Count == productsQuantity.Value);
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

    var totalCount = await query.CountAsync();

    var FilteredOrders = await query
    .Skip((Page - 1) * 2)
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

    var totalPages = (int)Math.Ceiling(totalCount / (double)2);

    return Results.Ok(new
    {
        Success = true,
        Message = $"{totalCount} pedidos filtrados",
        OrdersData = FilteredOrders,
        Pagination = new
        {
            CurrentPage = Page,
            PageSize = 2,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = Page > 1,
            HasNextPage = Page < totalPages
        },
        AppliedFilters = new
        {
            OrderId = orderId,
            UserId = UserId,
            UserNameOrEmail,
            OrderStatus,
            SomeProductId,
            SomeProductName,
            ProductsQuantity = productsQuantity,
            DateFrom = DateFrom?.ToString("yyyy-MM-dd"),
            DateTo = DateTo?.ToString("yyyy-MM-dd"),
            SortBy,
            Order
        }
    });
});



app.MapPost("/auth/register", async (RegisterRequest request) =>
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (existingUser != null)
        {
            return Results.Conflict();
        }
        else
        {
            User newUser = new User { Name = request.Name, Email = request.Email, PasswordHash = request.Password };
            dbContext.Users.Add(newUser);
            await dbContext.SaveChangesAsync();
            return Results.Ok();
        }
    }
});



app.MapPut("/api/admin/orders/update", async (AppDbContext db, UpdateOrder upOrder) =>
{
    if (string.IsNullOrEmpty(upOrder.NewState))
    {
        return Results.BadRequest("Status não pode ser vazio");
    }

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
    if (upOrder.Id == 0)
    {
        return Results.BadRequest("Id inválido");
    }

    Order? selectedOrder = await db.Orders.FindAsync(upOrder.Id);

    if (selectedOrder == null)
    {
        return Results.BadRequest($"O pedido com o id {upOrder.Id} não existe");
    }

    selectedOrder.Status = upOrder.NewState;
    selectedOrder.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok("Status do pedido trocado com sucesso!");
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

    if (changeUserRequest.IsAdmin == true)
    {
        userToChange.IsAdmin = true;
    }
    else
    {
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


app.MapGet("/products/all/{Page?}", async (AppDbContext db, int Page = 1) =>
{
    var query = db.Products.AsQueryable();

    query = query.OrderBy(p => p.Id);

    var totalCount = await query.CountAsync();

    var selectedProducts = await query.Skip((Page - 1) * 20).Take(20).Select(p => new
    {
        productId = p.Id,
        productName = p.Name,
        productDescription = p.Description,
        productPrice = p.Price,
        productStock = p.Stock,
        orderCount = db.OrderItems
                .Where(oi => oi.ProductId == p.Id)
                .Select(oi => oi.OrderId)
                .Distinct()
                .Count()
    }).
    ToListAsync();

    var totalPages = (int)Math.Ceiling(totalCount / (double)20);

    return Results.Ok(new
    {
        Success = true,
        Message = $"{totalCount} produtos encontrados",
        Data = selectedProducts,
        Pagination = new
        {
            CurrentPage = Page,
            PageSize = 20,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = Page > 1,
            HasNextPage = Page < totalPages
        }
    });
});

app.MapGet("/api/admin/products/filter",
async
(
    AppDbContext db,
    int? productId,
    string? Search,
    int? stock,
    decimal? PriceFrom,
    decimal? PriceTo,
    string? DateFrom,
    string? DateTo,
    string order = "asc",
    string sortBy = "name",
    int page = 1,
    string isActive = "all"

) =>
{

    var query = db.Products.AsQueryable();

    if (!string.IsNullOrWhiteSpace(Search))
    {
        query = query.Where(p => p.Name.Contains(Search));
    }

    if (productId != null)
    {
        query = query.Where(p => productId == p.Id);
    }

    if (PriceFrom != null)
    {
        query = query.Where(p => p.Price >= PriceFrom);
    }

    if (PriceTo != null)
    {
        query = query.Where(p => p.Price <= PriceTo);
    }
    if(stock != null)
    {
        query = query.Where(p => p.Stock == stock);
    }
    switch (isActive)
    {
        case "all":
            break;
        case "true":
            query = query.Where(p => p.IsActive);
            break;
        case "false":
            query = query.Where(p => p.IsActive == false);
            break;
    }
    if (DateTime.TryParse(DateFrom, out var ParsedDateFrom))
    {
        var dateFromUtc = DateTime.SpecifyKind(ParsedDateFrom, DateTimeKind.Utc);
        query = query.Where(p => p.CreatedAt >= dateFromUtc);
    }
    if (DateTime.TryParse(DateTo,out var ParsedDateTo))
    {
        var dateToUtc = DateTime.SpecifyKind(ParsedDateTo, DateTimeKind.Utc);
        query = query.Where(p => p.CreatedAt <= dateToUtc);
    }

    query = (sortBy.ToLower(), order.ToLower()) switch
    {
        ("id", "desc") => query.OrderByDescending(p => p.Id),
        ("id", _) => query.OrderBy(p => p.Id),

        ("name", "desc") => query.OrderByDescending(p => p.Name),
        ("name", _) => query.OrderBy(p => p.Name),

        ("createdat", "desc") => query.OrderByDescending(p => p.CreatedAt),
        ("createdat", _) => query.OrderBy(p => p.CreatedAt),

        _ => query.OrderBy(p => p.Name)
    };

    var totalCount = await query.CountAsync();

    var selectedProducts = await query.Skip((page - 1) * 20).Take(20).Select(p => new
    {
        productId = p.Id,
        productName = p.Name,
        productDescription = p.Description,
        productPrice = p.Price,
        productStock = p.Stock,
        orderCount = db.OrderItems
                .Where(oi => oi.ProductId == p.Id)
                .Select(oi => oi.OrderId)
                .Distinct()
                .Count()
    })
    .ToListAsync();

    var totalPages = (int)Math.Ceiling(totalCount / (double)20);

    return Results.Ok(new
    {
        Success = true,
        Message = $"{totalCount} produtos encontrados",
        Data = selectedProducts,
        Pagination = new
        {
            CurrentPage = page,
            PageSize = 20,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasPreviousPage = page > 1,
            HasNextPage = page < totalPages
        },
        AppliedFilters = new
        {
            ProductId = productId,
            Search,
            Stock = stock,
            PriceFrom,
            PriceTo,
            DateFrom,
            DateTo,
            Order = order,
            SortBy = sortBy,
            Page = page,
            IsActive = isActive
        }
    });


});

app.Run();
