using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ServerApp.Models;
using ServerApp.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using ServerApp.Helpers;

namespace ServerApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        readonly string MyAllowOrigins="_myAllowOrigins";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<SocialContext>(x=>x.UseSqlite("Data Source=social.db"));
            services.AddIdentity<User,Role>().AddEntityFrameworkStores<SocialContext>();
            services.AddScoped<ISocialRepository,SocialRepository>();
            services.AddAutoMapper(typeof(Startup));
            services.AddControllers().AddNewtonsoftJson(options =>{
                options.SerializerSettings.ReferenceLoopHandling=Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
            services.AddAuthentication(x=>{
              x.DefaultAuthenticateScheme=JwtBearerDefaults.AuthenticationScheme;
              x.DefaultChallengeScheme=JwtBearerDefaults.AuthenticationScheme;
            })

            .AddJwtBearer(x => {
                  x.RequireHttpsMetadata=false;
                  x.SaveToken=true;
                  x.TokenValidationParameters=new TokenValidationParameters {
                      ValidateIssuerSigningKey=true,
                      IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Secret").Value)),
                      ValidateIssuer=false,
                      ValidateAudience=false
                  };
            });

            services.AddScoped<LastActiveActionFilter>();
        
            services.Configure<IdentityOptions>(options=>{
                
                options.Password.RequireDigit=true;
                options.Password.RequireLowercase=true;
                options.Password.RequireUppercase=true;
                options.Password.RequireNonAlphanumeric=true;
                options.Password.RequiredLength=6;

                options.Lockout.DefaultLockoutTimeSpan=TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts=5;
                options.Lockout.AllowedForNewUsers=true;
                options.User.AllowedUserNameCharacters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail=true;

            });
            
            
            services.AddControllers().AddNewtonsoftJson();
            services.AddCors(options => {

                options.AddPolicy(
                    name: MyAllowOrigins,
                    builder => {
                        builder
                        .WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                        
                        
                    });      
            });
        }
       
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env,UserManager<User> userManager)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                SeedDatabase.Seed(userManager).Wait();
            }
            else{
                app.UseExceptionHandler(appError =>{
                 appError.Run(async context =>{
                     context.Response.StatusCode=(int)HttpStatusCode.InternalServerError;
                     context.Response.ContentType="application/json";
                     var exception=context.Features.Get<IExceptionHandlerFeature>();
                     if(exception!=null)
                     {
                         await context.Response.WriteAsync(new ErrorDetails()
                         {
                             StatusCode=context.Response.StatusCode,
                             Message=exception.Error.Message
                         }.ToString());

                     }
                 } );

              });
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(MyAllowOrigins);

            app.UseAuthentication();

            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
