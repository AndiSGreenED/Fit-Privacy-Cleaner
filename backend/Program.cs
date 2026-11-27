using Microsoft.AspNetCore.Http.Features;

const long MaxRequestBytes = 51L * 1024L * 1024L;
const int MaxInMemoryUploadBytes = 51 * 1024 * 1024;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(
                "https://andisgreened.github.io",
                "http://localhost:5000",
                "http://localhost:8080",
                "http://127.0.0.1:8080")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

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
app.UseCors("Frontend");

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    service = "Fit Privacy Cleaner"
}));

app.MapPost("/api/analyze", ApiEndpoints.Analyze);
app.MapPost("/api/anonymize", ApiEndpoints.Anonymize);

app.MapFallbackToFile("index.html");

app.Run();
