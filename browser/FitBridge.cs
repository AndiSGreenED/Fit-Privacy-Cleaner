using System.Text.Json;
using FitPrivacyCleaner;
using Microsoft.JSInterop;

namespace FitPrivacyCleaner.Browser;

public static class FitBridge
{
    private sealed record CleanResponse(
        string FileBase64,
        int RemovedGpsFields,
        int RemovedIdentifierFields,
        int RemovedMetadataMessages,
        int RemovedDeveloperFields,
        int OriginalMessageCount,
        int OutputMessageCount);

    [JSInvokable]
    public static string Analyze(string fileBase64)
    {
        var bytes = Convert.FromBase64String(fileBase64);
        var result = FitFileProcessor.Analyze(bytes);
        return JsonSerializer.Serialize(result);
    }

    [JSInvokable]
    public static string Clean(string fileBase64, bool removeGps, bool removeDeviceAndProfileData)
    {
        var bytes = Convert.FromBase64String(fileBase64);
        var result = FitFileProcessor.Clean(
            bytes,
            new CleanOptions(
                RemoveGps: removeGps,
                RemoveDeviceAndProfileData: removeDeviceAndProfileData));

        return JsonSerializer.Serialize(new CleanResponse(
            FileBase64: Convert.ToBase64String(result.FileBytes),
            RemovedGpsFields: result.RemovedGpsFields,
            RemovedIdentifierFields: result.RemovedIdentifierFields,
            RemovedMetadataMessages: result.RemovedMetadataMessages,
            RemovedDeveloperFields: result.RemovedDeveloperFields,
            OriginalMessageCount: result.OriginalMessageCount,
            OutputMessageCount: result.OutputMessageCount));
    }
}
