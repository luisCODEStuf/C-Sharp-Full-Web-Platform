using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using JwtBearer.Models;
using System.Text;
using System.Security.Claims;

namespace JwtBearer.Services;

public class TokenService
{
  public string GenerateToken(User user)
    {
        var handler = new JwtSecurityTokenHandler();
        
        var key = Encoding.ASCII.GetBytes(Configuration.PrivateKey); 

        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            SigningCredentials = credentials,
            Expires = DateTime.UtcNow.AddHours(1),
            Subject = GenerateClaims(user),
        };

        var Token = handler.CreateToken(tokenDescriptor);

        var strToken = handler.WriteToken(Token);

        return strToken;
    }   

  private static ClaimsIdentity GenerateClaims(User user)
    {
        var claims = new ClaimsIdentity();
        claims.AddClaim(new Claim(ClaimTypes.Name, user.Name));
        claims.AddClaim(new Claim(ClaimTypes.Role, user.IsAdmin ? "admin":"user")); 
        return claims;
    }
}