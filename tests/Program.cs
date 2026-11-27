using Dynastream.Fit;
using FitPrivacyCleaner;

static void Require(bool condition, string message)
{
    if (!condition)
    {
        throw new InvalidOperationException(message);
    }
}

static byte[] CreateTestActivity()
{
    using var stream = new MemoryStream();
    var encoder = new Encode(ProtocolVersion.V20);

    var fileId = new FileIdMesg();
    fileId.SetType(Dynastream.Fit.File.Activity);
    fileId.SetManufacturer(1);
    fileId.SetProduct(1234);
    fileId.SetSerialNumber(123456789);
    fileId.SetTimeCreated(new Dynastream.Fit.DateTime(1000));

    var profile = new UserProfileMesg();
    profile.SetFriendlyName("Private Test");

    var device = new DeviceInfoMesg();
    device.SetManufacturer(1);
    device.SetProduct(1234);
    device.SetSerialNumber(987654321);
    device.SetTimestamp(new Dynastream.Fit.DateTime(1500));

    var record = new RecordMesg();
    record.SetTimestamp(new Dynastream.Fit.DateTime(2000));
    record.SetPositionLat(123456);
    record.SetPositionLong(654321);
    record.SetHeartRate(145);
    record.SetPower(250);
    record.SetCadence(90);
    record.SetDistance(125.5f);
    record.SetSpeed(3.2f);

    encoder.Open(stream);
    encoder.Write(fileId);
    encoder.Write(profile);
    encoder.Write(device);
    encoder.Write(record);
    encoder.Close();

    return stream.ToArray();
}

var original = CreateTestActivity();
var fixtureOutputPath = Environment.GetEnvironmentVariable("FIT_TEST_OUTPUT_PATH");
if (!string.IsNullOrWhiteSpace(fixtureOutputPath))
{
    var fullFixturePath = Path.GetFullPath(fixtureOutputPath);
    Directory.CreateDirectory(Path.GetDirectoryName(fullFixturePath)!);
    System.IO.File.WriteAllBytes(fullFixturePath, original);
}

var originalAnalysis = FitFileProcessor.Analyze(original);

Require(originalAnalysis.RecordCount == 1, "Expected one record in generated activity.");
Require(originalAnalysis.HasGps, "Expected GPS coordinates in generated activity.");
Require(originalAnalysis.HasHeartRate, "Expected heart rate in generated activity.");
Require(originalAnalysis.HasPower, "Expected power in generated activity.");
Require(originalAnalysis.HasCadence, "Expected cadence in generated activity.");
Require(originalAnalysis.DeviceInfoMessageCount == 1, "Expected one device info message.");
Require(originalAnalysis.UserProfileMessageCount == 1, "Expected one user profile message.");

var cleaned = FitFileProcessor.Clean(
    original,
    new CleanOptions(RemoveGps: true, RemoveDeviceAndProfileData: true));

var cleanedAnalysis = FitFileProcessor.Analyze(cleaned.FileBytes);

Require(!cleanedAnalysis.HasGps, "GPS coordinates remain after cleaning.");
Require(cleanedAnalysis.DeviceInfoMessageCount == 0, "Device information remains after cleaning.");
Require(cleanedAnalysis.UserProfileMessageCount == 0, "User profile remains after cleaning.");
Require(cleanedAnalysis.RecordCount == 1, "Record message was lost during cleaning.");
Require(cleanedAnalysis.HasHeartRate, "Heart rate was lost during cleaning.");
Require(cleanedAnalysis.HasPower, "Power was lost during cleaning.");
Require(cleanedAnalysis.HasCadence, "Cadence was lost during cleaning.");
Require(cleaned.RemovedGpsFields >= 2, "Expected latitude and longitude to be removed.");
Require(cleaned.RemovedIdentifierFields > 0, "Expected identifier fields to be removed.");
Require(cleaned.OutputMessageCount > 0, "Cleaned FIT file contains no messages.");

var preservedGps = FitFileProcessor.Clean(
    original,
    new CleanOptions(RemoveGps: false, RemoveDeviceAndProfileData: true));
var preservedGpsAnalysis = FitFileProcessor.Analyze(preservedGps.FileBytes);
Require(preservedGpsAnalysis.HasGps, "GPS should remain when GPS removal is disabled.");

var corrupted = original.ToArray();
corrupted[^1] ^= 0xFF;
var rejected = false;

try
{
    FitFileProcessor.Analyze(corrupted);
}
catch (FitFileException)
{
    rejected = true;
}

Require(rejected, "A FIT file with an invalid CRC must be rejected.");

Console.WriteLine("FIT cleaner smoke tests passed.");
