using Microsoft.AspNetCore.Http.Features;

const long MaxRequestBytes = 51L * 1024L * 1024L;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = MaxRequestBytes;
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = MaxRequestBytes;
    options.MemoryBufferThreshold = 50 * 1024 * 1024;
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
