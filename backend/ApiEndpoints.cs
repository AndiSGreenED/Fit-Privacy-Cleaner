using FitPrivacyCleaner;

public static class ApiEndpoints
{
    private const long MaxUploadBytes = 50L * 1024L * 1024L;

    public static async Task<IResult> Analyze(HttpRequest request, ILogger<ApiEndpoints> logger)
    {
        var uploadResult = await ReadUpload(request);
        if (uploadResult.Error is not null)
        {
            return uploadResult.Error;
        }

        try
        {
            var analysis = FitFileProcessor.Analyze(uploadResult.Bytes!);
            return Results.Ok(analysis);
        }
        catch (FitFileException exception)
        {
            return Results.BadRequest(new { error = exception.Message });
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "FIT analysis failed.");
            return Results.Problem("Die FIT Datei konnte nicht analysiert werden.");
        }
    }

    public static async Task<IResult> Anonymize(HttpRequest request, ILogger<ApiEndpoints> logger)
    {
        var uploadResult = await ReadUpload(request);
        if (uploadResult.Error is not null)
        {
            return uploadResult.Error;
        }

        var form = uploadResult.Form!;
        var options = new CleanOptions(
            RemoveGps: ParseBoolean(form["removeGps"], defaultValue: false),
            RemoveDeviceAndProfileData: ParseBoolean(form["removeDeviceAndProfileData"], defaultValue: true));

        try
        {
            var result = FitFileProcessor.Clean(uploadResult.Bytes!, options);
            var downloadName = CreateDownloadName(uploadResult.FileName);

            request.HttpContext.Response.Headers["Cache-Control"] = "no-store";
            request.HttpContext.Response.Headers["X-Removed-Gps-Fields"] = result.RemovedGpsFields.ToString();
            request.HttpContext.Response.Headers["X-Removed-Identifier-Fields"] = result.RemovedIdentifierFields.ToString();
            request.HttpContext.Response.Headers["X-Removed-Metadata-Messages"] = result.RemovedMetadataMessages.ToString();
            request.HttpContext.Response.Headers["X-Removed-Developer-Fields"] = result.RemovedDeveloperFields.ToString();

            return Results.File(
                result.FileBytes,
                contentType: "application/octet-stream",
                fileDownloadName: downloadName);
        }
        catch (FitFileException exception)
        {
            return Results.BadRequest(new { error = exception.Message });
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "FIT anonymization failed.");
            return Results.Problem("Die FIT Datei konnte nicht sicher bereinigt werden.");
        }
    }

    private static async Task<UploadResult> ReadUpload(HttpRequest request)
    {
        IFormCollection form;

        try
        {
            form = await request.ReadFormAsync();
        }
        catch
        {
            return UploadResult.Fail(Results.BadRequest(new { error = "Die Upload Daten konnten nicht gelesen werden." }));
        }

        var file = form.Files.GetFile("file");
        if (file is null)
        {
            return UploadResult.Fail(Results.BadRequest(new { error = "Bitte zuerst eine FIT Datei auswählen." }));
        }

        if (file.Length == 0)
        {
            return UploadResult.Fail(Results.BadRequest(new { error = "Die ausgewählte Datei ist leer." }));
        }

        if (file.Length > MaxUploadBytes)
        {
            return UploadResult.Fail(Results.StatusCode(StatusCodes.Status413PayloadTooLarge));
        }

        if (!string.Equals(Path.GetExtension(file.FileName), ".fit", StringComparison.OrdinalIgnoreCase))
        {
            return UploadResult.Fail(Results.BadRequest(new { error = "Bitte eine Datei mit der Endung .fit auswählen." }));
        }

        await using var input = file.OpenReadStream();
        using var buffer = new MemoryStream((int)file.Length);
        await input.CopyToAsync(buffer);

        return UploadResult.Success(form, buffer.ToArray(), file.FileName);
    }

    private static bool ParseBoolean(string? value, bool defaultValue) =>
        bool.TryParse(value, out var parsed) ? parsed : defaultValue;

    private static string CreateDownloadName(string originalName)
    {
        var normalizedName = originalName.Replace('\\', '/');
        var baseName = Path.GetFileNameWithoutExtension(normalizedName);
        var invalidChars = Path.GetInvalidFileNameChars();
        var safeName = new string(baseName
            .Select(character => invalidChars.Contains(character) ? '_' : character)
            .Where(character => !char.IsControl(character))
            .Take(80)
            .ToArray())
            .Trim();

        if (string.IsNullOrWhiteSpace(safeName))
        {
            safeName = "activity";
        }

        return $"{safeName}_anonymized.fit";
    }

    private sealed record UploadResult(
        IFormCollection? Form,
        byte[]? Bytes,
        string FileName,
        IResult? Error)
    {
        public static UploadResult Success(IFormCollection form, byte[] bytes, string fileName) =>
            new(form, bytes, fileName, null);

        public static UploadResult Fail(IResult error) =>
            new(null, null, string.Empty, error);
    }
}
