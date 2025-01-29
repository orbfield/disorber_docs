using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Disorber.Client.Game.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Register SidebarService as a scoped service
builder.Services.AddScoped<SidebarService>();

await builder.Build().RunAsync();
