using System.Linq;
using Dynastream.Fit;

namespace FitPrivacyCleaner;

public sealed record FitAnalysis(
    long SizeBytes,
    int MessageCount,
    int RecordCount,
    int LapCount,
    int SessionCount,
    bool HasGps,
    bool HasHeartRate,
    bool HasPower,
    bool HasCadence,
    bool HasSpeed,
    int DeviceInfoMessageCount,
    int UserProfileMessageCount,
    int DeveloperFieldCount);

public sealed record CleanOptions(
    bool RemoveGps,
    bool RemoveDeviceAndProfileData,
    bool RemoveHeartRate = false,
    bool RemovePower = false,
    bool RemoveCadence = false,
    bool RemoveDeveloperData = false);

public sealed record CleanResult(
    byte[] FileBytes,
    int RemovedGpsFields,
    int RemovedIdentifierFields,
    int RemovedHeartRateFields,
    int RemovedPowerFields,
    int RemovedCadenceFields,
    int RemovedMetadataMessages,
    int RemovedDeveloperFields,
    int OriginalMessageCount,
    int OutputMessageCount);

public sealed class FitFileException(string message) : Exception(message) { }

public static class FitFileProcessor
{
    // Developer values and their schema are preserved by default. They are
    // removed only when the user explicitly selects the custom data privacy option.
    private static readonly HashSet<string> DeveloperMetadataMessages =
    [
        "developerdataid",
        "fielddescription"
    ];

    private static readonly HashSet<string> DeviceAndProfileMessages =
    [
        "deviceinfo",
        "userprofile",
        "filecreator"
    ];

    private static readonly HashSet<string> IdentifierFields =
    [
        "serialnumber",
        "manufacturer",
        "product",
        "productname",
        "softwareversion",
        "hardwareversion",
        "antdevicenumber",
        "deviceid",
        "applicationid",
        "friendlyname",
        "firstname",
        "lastname",
        "email",
        "phone",
        "address",
        "username",
        "userid"
    ];

    private static readonly HashSet<string> HeartRateFields =
    [
        "heartrate",
        "avgheartrate",
        "maxheartrate",
        "minheartrate",
        "restingheartrate"
    ];

    private static readonly HashSet<string> PowerFields =
    [
        "power",
        "avgpower",
        "maxpower",
        "normalizedpower",
        "leftpowerphase",
        "rightpowerphase",
        "leftpowerphasepeak",
        "rightpowerphasepeak",
        "avgleftpowerphase",
        "avgrightpowerphase",
        "maxleftpowerphase",
        "maxrightpowerphase"
    ];

    private static readonly HashSet<string> CadenceFields =
    [
        "cadence",
        "fractionalcadence",
        "avgcadence",
        "maxcadence",
        "avgfractionalcadence",
        "maxfractionalcadence"
    ];

    public static FitAnalysis Analyze(byte[] fileBytes)
    {
        var messages = DecodeMessages(fileBytes);

        return new FitAnalysis(
            SizeBytes: fileBytes.LongLength,
            MessageCount: messages.Count,
            RecordCount: CountMessages(messages, "record"),
            LapCount: CountMessages(messages, "lap"),
            SessionCount: CountMessages(messages, "session"),
            HasGps: messages.SelectMany(message => message.Fields).Any(field => IsGpsField(field.Name)),
            HasHeartRate: HasField(messages, "heartrate"),
            HasPower: HasField(messages, "power"),
            HasCadence: HasField(messages, "cadence"),
            HasSpeed: HasField(messages, "speed") || HasField(messages, "enhancedspeed"),
            DeviceInfoMessageCount: CountMessages(messages, "deviceinfo"),
            UserProfileMessageCount: CountMessages(messages, "userprofile"),
            DeveloperFieldCount: messages.Sum(message => message.DeveloperFields.Count()));
    }

    public static CleanResult Clean(byte[] fileBytes, CleanOptions options)
    {
        var sourceMessages = DecodeMessages(fileBytes);
        EnsureFileIdFirst(sourceMessages);

        var cleanedMessages = new List<Mesg>(sourceMessages.Count);
        var removedGpsFields = 0;
        var removedIdentifierFields = 0;
        var removedHeartRateFields = 0;
        var removedPowerFields = 0;
        var removedCadenceFields = 0;
        var removedMetadataMessages = 0;
        var removedDeveloperFields = 0;
        var originalDeveloperFieldCount = sourceMessages.Sum(message => message.DeveloperFields.Count());
        var originalDeveloperMetadataCount = sourceMessages.Count(message =>
            DeveloperMetadataMessages.Contains(Normalize(message.Name)));

        foreach (var source in sourceMessages)
        {
            var messageName = Normalize(source.Name);
            var isDeveloperMetadata = DeveloperMetadataMessages.Contains(messageName);
            var isDeviceOrProfileMetadata = DeviceAndProfileMessages.Contains(messageName);

            if (options.RemoveDeveloperData && isDeveloperMetadata)
            {
                removedMetadataMessages++;
                continue;
            }

            var removeDeviceMetadataFields = options.RemoveDeviceAndProfileData && isDeviceOrProfileMetadata;
            if (removeDeviceMetadataFields)
            {
                removedMetadataMessages++;
            }

            var target = new Mesg(source.Name, source.Num)
            {
                LocalNum = source.LocalNum
            };

            if (options.RemoveDeveloperData)
            {
                removedDeveloperFields += source.DeveloperFields.Count();
            }
            else
            {
                // Preserve application specific fields, including their decoded values.
                foreach (var developerField in source.DeveloperFields)
                {
                    if (developerField.GetNumValues() > 0)
                    {
                        target.SetDeveloperField(new DeveloperField(developerField));
                    }
                }
            }

            foreach (var field in source.Fields)
            {
                // Device and profile messages may contain app-specific fields too.
                // Keep those custom values while omitting all native message fields.
                if (removeDeviceMetadataFields)
                {
                    continue;
                }

                // Component-expanded values are calculated by the decoder and must
                // not be written as separate native fields.
                if (field.IsExpandedField)
                {
                    continue;
                }

                if (options.RemoveGps && IsGpsField(field.Name))
                {
                    removedGpsFields++;
                    continue;
                }

                var isDeveloperApplicationId =
                    messageName == "developerdataid" &&
                    Normalize(field.Name) == "applicationid" &&
                    !options.RemoveDeveloperData;

                if (options.RemoveDeviceAndProfileData &&
                    IsIdentifierField(field.Name) &&
                    !isDeveloperApplicationId)
                {
                    removedIdentifierFields++;
                    continue;
                }

                if (options.RemoveHeartRate && IsHeartRateField(field.Name))
                {
                    removedHeartRateFields++;
                    continue;
                }

                if (options.RemovePower && IsPowerField(field.Name))
                {
                    removedPowerFields++;
                    continue;
                }

                if (options.RemoveCadence && IsCadenceField(field.Name))
                {
                    removedCadenceFields++;
                    continue;
                }

                target.SetField(new Field(field));
            }

            if (!removeDeviceMetadataFields || target.DeveloperFields.Any())
            {
                cleanedMessages.Add(target);
            }
        }

        EnsureFileIdFirst(cleanedMessages);

        var encodedBytes = EncodeMessages(cleanedMessages);
        var verifiedMessages = DecodeMessages(encodedBytes);
        EnsureFileIdFirst(verifiedMessages);

        if (options.RemoveGps &&
            verifiedMessages.SelectMany(message => message.Fields).Any(field => IsGpsField(field.Name)))
        {
            throw new FitFileException("Die GPS Koordinaten konnten nicht vollständig entfernt werden. Es wurde keine Datei bereitgestellt.");
        }

        if (options.RemoveDeveloperData &&
            (verifiedMessages.Any(message => DeveloperMetadataMessages.Contains(Normalize(message.Name))) ||
             verifiedMessages.Sum(message => message.DeveloperFields.Count()) > 0))
        {
            throw new FitFileException("Entwicklerdaten konnten nicht vollständig entfernt werden. Es wurde keine Datei bereitgestellt.");
        }

        if (!options.RemoveDeveloperData)
        {
            var verifiedDeveloperFieldCount = verifiedMessages.Sum(message => message.DeveloperFields.Count());
            var verifiedDeveloperMetadataCount = verifiedMessages.Count(message =>
                DeveloperMetadataMessages.Contains(Normalize(message.Name)));

            if (verifiedDeveloperFieldCount != originalDeveloperFieldCount ||
                verifiedDeveloperMetadataCount != originalDeveloperMetadataCount)
            {
                throw new FitFileException("App und eigene Zusatzfelder konnten nicht vollständig erhalten werden. Es wurde keine Datei bereitgestellt.");
            }
        }

        if (options.RemoveDeviceAndProfileData &&
            verifiedMessages.Any(message =>
                DeviceAndProfileMessages.Contains(Normalize(message.Name)) &&
                message.Fields.Any()))
        {
            throw new FitFileException("Die Geräte und Profilinformationen konnten nicht vollständig entfernt werden. Es wurde keine Datei bereitgestellt.");
        }

        if (options.RemoveHeartRate &&
            verifiedMessages.SelectMany(message => message.Fields).Any(field => IsHeartRateField(field.Name)))
        {
            throw new FitFileException("Herzfrequenzdaten konnten nicht vollständig entfernt werden. Es wurde keine Datei bereitgestellt.");
        }

        if (options.RemovePower &&
            verifiedMessages.SelectMany(message => message.Fields).Any(field => IsPowerField(field.Name)))
        {
            throw new FitFileException("Leistungsdaten konnten nicht vollständig entfernt werden. Es wurde keine Datei bereitgestellt.");
        }

        if (options.RemoveCadence &&
            verifiedMessages.SelectMany(message => message.Fields).Any(field => IsCadenceField(field.Name)))
        {
            throw new FitFileException("Kadenzdaten konnten nicht vollständig entfernt werden. Es wurde keine Datei bereitgestellt.");
        }

        return new CleanResult(
            FileBytes: encodedBytes,
            RemovedGpsFields: removedGpsFields,
            RemovedIdentifierFields: removedIdentifierFields,
            RemovedHeartRateFields: removedHeartRateFields,
            RemovedPowerFields: removedPowerFields,
            RemovedCadenceFields: removedCadenceFields,
            RemovedMetadataMessages: removedMetadataMessages,
            RemovedDeveloperFields: removedDeveloperFields,
            OriginalMessageCount: sourceMessages.Count,
            OutputMessageCount: verifiedMessages.Count);
    }

    private static List<Mesg> DecodeMessages(byte[] fileBytes)
    {
        if (fileBytes.Length < 14)
        {
            throw new FitFileException("Die Datei ist zu klein, um eine gültige FIT Datei zu sein.");
        }

        try
        {
            using var stream = new MemoryStream(fileBytes, writable: false);
            var decoder = new Decode();

            if (!decoder.CheckIntegrity(stream))
            {
                throw new FitFileException("Die FIT Datei ist beschädigt oder ihre Prüfsumme ist ungültig.");
            }

            var messages = new List<Mesg>();
            decoder.MesgEvent += (_, eventArgs) => messages.Add(new Mesg(eventArgs.mesg));

            stream.Position = 0;
            if (!decoder.Read(stream))
            {
                throw new FitFileException("Die FIT Datei konnte nicht vollständig gelesen werden.");
            }

            if (messages.Count == 0)
            {
                throw new FitFileException("Die FIT Datei enthält keine lesbaren Daten.");
            }

            return messages;
        }
        catch (FitFileException)
        {
            throw;
        }
        catch (Exception)
        {
            throw new FitFileException("Die FIT Datei ist ungültig, beschädigt oder verwendet ein nicht unterstütztes Datenformat.");
        }
    }

    private static byte[] EncodeMessages(IEnumerable<Mesg> messages)
    {
        using var output = new MemoryStream();
        var encoder = new Encode(ProtocolVersion.V20);

        try
        {
            encoder.Open(output);

            foreach (var message in messages)
            {
                encoder.Write(message);
            }

            // Close finalizes the file size and calculates the FIT header and file CRC.
            encoder.Close();
            return output.ToArray();
        }
        catch (FitFileException)
        {
            throw;
        }
        catch (Exception)
        {
            throw new FitFileException("Die bereinigte FIT Datei konnte nicht korrekt neu aufgebaut werden.");
        }
    }

    private static void EnsureFileIdFirst(IReadOnlyList<Mesg> messages)
    {
        if (messages.Count == 0 || Normalize(messages[0].Name) != "fileid")
        {
            throw new FitFileException("Die Datei enthält keine gültige file_id Nachricht an der vorgeschriebenen ersten Position.");
        }
    }

    private static int CountMessages(IEnumerable<Mesg> messages, string normalizedName) =>
        messages.Count(message => Normalize(message.Name) == normalizedName);

    private static bool HasField(IEnumerable<Mesg> messages, string normalizedName) =>
        messages.SelectMany(message => message.Fields)
            .Any(field => Normalize(field.Name) == normalizedName);

    private static bool IsGpsField(string? fieldName)
    {
        var name = Normalize(fieldName);
        return name.Contains("positionlat", StringComparison.Ordinal) ||
               name.Contains("positionlong", StringComparison.Ordinal);
    }

    private static bool IsIdentifierField(string? fieldName) =>
        IdentifierFields.Contains(Normalize(fieldName));

    private static bool IsHeartRateField(string? fieldName) =>
        HeartRateFields.Contains(Normalize(fieldName));

    private static bool IsPowerField(string? fieldName) =>
        PowerFields.Contains(Normalize(fieldName));

    private static bool IsCadenceField(string? fieldName) =>
        CadenceFields.Contains(Normalize(fieldName));

    private static string Normalize(string? value) =>
        new((value ?? string.Empty)
            .Where(char.IsLetterOrDigit)
            .Select(char.ToLowerInvariant)
            .ToArray());
}
