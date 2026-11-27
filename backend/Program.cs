using Microsoft.AspNetCore.Http.Features;

const long MaxRequestBytes = 51L * 1024L * 1024L;
const int MaxInMemoryUploadBytes = 51 * 1024 * 1024;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = MaxRequestBytes;
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = MaxRequestBytes;
    // Keep the entire allowed FIT upload in memory rather than allowing
    // ASP.NET Core to spill the temporary upload buffer to disk.
    options.MemoryBufferThreshold = MaxInMemoryUploadBytes;
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    service = "Fit Privacy Cleaner"
}));

app.MapPost("/api/analyze", ApiEndpoints.Analyze);
app.MapPost("/api/anonymize", ApiEndpoints.Anonymize);

app.MapFallbackToFile("index.html");

app.Run();
