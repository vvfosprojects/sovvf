using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Servizi.Infrastruttura.Autenticazione;

namespace SO115App.API.Controllers
{    
    
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController: ControllerBase
    {
        private readonly IAuthOperatore _auth;
        private readonly IConfiguration _config;

        public AuthController(IAuthOperatore auth, IConfiguration config)
        {
            this._auth = auth;
            this._config = config;
        }
        
        [HttpPost("Login")]
        public async Task<IActionResult> Login(Utente user)
        {
            var _user = await _auth.Login(user.username,user.password);

            if(_user == null)
            {
                return Unauthorized();
            }

            var claim = new []
            {
                new Claim(ClaimTypes.NameIdentifier, _user.id.ToString()),
                new Claim(ClaimTypes.Name,_user.username) 
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var TokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claim),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(TokenDescriptor);

            _user.token = tokenHandler.WriteToken(token);

            return Ok( new {
                _user                
            });
            
        }


    }
}