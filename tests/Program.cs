using Dynastream.Fit;
using FitPrivacyCleaner;

static void Require(bool condition, string message)
{
    if (!condition)
    {
        throw new InvalidOperationException(message);
    }
}

static List<Mesg> DecodeMessages(byte[] fileBytes)
{
    using var stream = new MemoryStream(fileBytes, writable: false);
    var decoder = new Decode();
    var messages = new List<Mesg>();
    decoder.MesgEvent += (_, eventArgs) => messages.Add(new Mesg(eventArgs.mesg));
    Require(decoder.Read(stream), "Generated FIT file could not be decoded.");
    return messages;
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

    var developerId = new DeveloperDataIdMesg();
    developerId.SetDeveloperDataIndex(0);
    for (byte i = 0; i < 16; i++)
    {
        developerId.SetApplicationId(i, (byte)(i + 1));
    }

    var fieldDescription = new FieldDescriptionMesg();
    fieldDescription.SetDeveloperDataIndex(0);
    fieldDescription.SetFieldDefinitionNumber(0);
    fieldDescription.SetFitBaseTypeId(FitBaseType.Uint16);
    fieldDescription.SetFieldName(0, "jump_height");
    fieldDescription.SetUnits(0, "cm");

    var jumpCountDescription = new FieldDescriptionMesg();
    jumpCountDescription.SetDeveloperDataIndex(0);
    jumpCountDescription.SetFieldDefinitionNumber(1);
    jumpCountDescription.SetFitBaseTypeId(FitBaseType.Uint8);
    jumpCountDescription.SetFieldName(0, "jump_count");
    jumpCountDescription.SetUnits(0, "count");

    var jibeCountDescription = new FieldDescriptionMesg();
    jibeCountDescription.SetDeveloperDataIndex(0);
    jibeCountDescription.SetFieldDefinitionNumber(2);
    jibeCountDescription.SetFitBaseTypeId(FitBaseType.Uint8);
    jibeCountDescription.SetFieldName(0, "jibe_count");
    jibeCountDescription.SetUnits(0, "count");

    var profile = new UserProfileMesg();
    profile.SetFriendlyName("Private Test");

    var device = new DeviceInfoMesg();
    device.SetManufacturer(1);
    device.SetProduct(1234);
    device.SetSerialNumber(987654321);
    device.SetTimestamp(new Dynastream.Fit.DateTime(1500));

    var session = new SessionMesg();
    session.SetStartPositionLat(111111);
    session.SetStartPositionLong(222222);
    session.SetEndPositionLat(333333);
    session.SetEndPositionLong(444444);

    var record = new RecordMesg();
    record.SetTimestamp(new Dynastream.Fit.DateTime(2000));
    record.SetPositionLat(123456);
    record.SetPositionLong(654321);
    record.SetHeartRate(145);
    record.SetPower(250);
    record.SetCadence(90);
    record.SetDistance(125.5f);
    record.SetSpeed(3.2f);
    var jumpHeight = new DeveloperField(fieldDescription, developerId);
    jumpHeight.SetValue(142);
    record.SetDeveloperField(jumpHeight);

    var jumpCount = new DeveloperField(jumpCountDescription, developerId);
    jumpCount.SetValue(4);
    record.SetDeveloperField(jumpCount);

    var jibeCount = new DeveloperField(jibeCountDescription, developerId);
    jibeCount.SetValue(6);
    record.SetDeveloperField(jibeCount);

    encoder.Open(stream);
    encoder.Write(fileId);
    encoder.Write(developerId);
    encoder.Write(fieldDescription);
    encoder.Write(jumpCountDescription);
    encoder.Write(jibeCountDescription);
    encoder.Write(profile);
    encoder.Write(device);
    encoder.Write(session);
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
Require(originalAnalysis.HasGps, "Expected GPS track point coordinates in generated activity.");
Require(originalAnalysis.HasLocation, "Expected session start and finish locations in generated activity.");
Require(originalAnalysis.HasHeartRate, "Expected heart rate in generated activity.");
Require(originalAnalysis.HasPower, "Expected power in generated activity.");
Require(originalAnalysis.HasCadence, "Expected cadence in generated activity.");
Require(originalAnalysis.DeveloperFieldCount == 3, "Expected three custom app fields in generated activity.");
Require(originalAnalysis.DeviceInfoMessageCount == 1, "Expected one device info message.");
Require(originalAnalysis.UserProfileMessageCount == 1, "Expected one user profile message.");

var cleaned = FitFileProcessor.Clean(
    original,
    new CleanOptions(RemoveGps: true, RemoveDeviceAndProfileData: true, RemoveLocation: true));

var cleanedAnalysis = FitFileProcessor.Analyze(cleaned.FileBytes);

Require(!cleanedAnalysis.HasGps, "GPS track point coordinates remain after cleaning.");
Require(!cleanedAnalysis.HasLocation, "Start or finish location coordinates remain after cleaning.");
Require(cleanedAnalysis.DeviceInfoMessageCount == 0, "Device information remains after cleaning.");
Require(cleanedAnalysis.UserProfileMessageCount == 0, "User profile remains after cleaning.");
Require(cleanedAnalysis.RecordCount == 1, "Record message was lost during cleaning.");
Require(cleanedAnalysis.HasHeartRate, "Heart rate was lost during cleaning.");
Require(cleanedAnalysis.HasPower, "Power was lost during cleaning.");
Require(cleanedAnalysis.HasCadence, "Cadence was lost during cleaning.");
Require(cleanedAnalysis.DeveloperFieldCount == 3, "Custom developer fields were lost during normal cleaning.");
var preservedDeveloperFields = DecodeMessages(cleaned.FileBytes)
    .SelectMany(message => message.DeveloperFields)
    .ToDictionary(field => field.Name ?? string.Empty);
Require(preservedDeveloperFields.ContainsKey("jump_height"), "Custom jump height field definition was not preserved.");
Require(Convert.ToUInt16(preservedDeveloperFields["jump_height"].GetValue()) == 142, "Custom jump height value was not preserved.");
Require(preservedDeveloperFields.ContainsKey("jump_count"), "Custom jump count field definition was not preserved.");
Require(Convert.ToByte(preservedDeveloperFields["jump_count"].GetValue()) == 4, "Custom jump count value was not preserved.");
Require(preservedDeveloperFields.ContainsKey("jibe_count"), "Custom jibe field definition was not preserved.");
Require(Convert.ToByte(preservedDeveloperFields["jibe_count"].GetValue()) == 6, "Custom jibe count value was not preserved.");
var preservedDeveloperIdMessage = DecodeMessages(cleaned.FileBytes)
    .Single(message => message.Name.Equals("developerdataid", StringComparison.OrdinalIgnoreCase));
var preservedDeveloperId = new DeveloperDataIdMesg(preservedDeveloperIdMessage);
Require(preservedDeveloperId.GetNumApplicationId() == 16, "Developer app identity was lost with the custom field definition.");
Require(cleaned.RemovedDeveloperFields == 0, "Developer fields should not be counted as removed by default.");
Require(cleaned.RemovedGpsFields >= 2, "Expected track latitude and longitude to be removed.");
Require(cleaned.RemovedLocationFields >= 4, "Expected session start and finish coordinates to be removed.");
Require(cleaned.RemovedIdentifierFields > 0, "Expected identifier fields to be removed.");
Require(cleaned.OutputMessageCount > 0, "Cleaned FIT file contains no messages.");

var preservedGps = FitFileProcessor.Clean(
    original,
    new CleanOptions(RemoveGps: false, RemoveDeviceAndProfileData: true));
var preservedGpsAnalysis = FitFileProcessor.Analyze(preservedGps.FileBytes);
Require(preservedGpsAnalysis.HasGps, "GPS track points should remain when GPS removal is disabled.");
Require(preservedGpsAnalysis.HasLocation, "Start and finish locations should remain when location removal is disabled.");
Require(preservedGpsAnalysis.DeveloperFieldCount == 3, "All custom developer fields should remain when their removal is disabled.");

var gpsOnly = FitFileProcessor.Clean(
    original,
    new CleanOptions(RemoveGps: true, RemoveDeviceAndProfileData: false, RemoveLocation: false));
var gpsOnlyAnalysis = FitFileProcessor.Analyze(gpsOnly.FileBytes);
Require(!gpsOnlyAnalysis.HasGps, "GPS track points were not removed independently.");
Require(gpsOnlyAnalysis.HasLocation, "Removing GPS track points must preserve start and finish locations.");
Require(gpsOnly.RemovedLocationFields == 0, "GPS only removal unexpectedly removed location fields.");

var locationOnly = FitFileProcessor.Clean(
    original,
    new CleanOptions(RemoveGps: false, RemoveDeviceAndProfileData: false, RemoveLocation: true));
var locationOnlyAnalysis = FitFileProcessor.Analyze(locationOnly.FileBytes);
Require(locationOnlyAnalysis.HasGps, "Removing start and finish locations must preserve GPS track points.");
Require(!locationOnlyAnalysis.HasLocation, "Start and finish locations were not removed independently.");
Require(locationOnly.RemovedGpsFields == 0, "Location only removal unexpectedly removed GPS track fields.");

var removedPrivateMetrics = FitFileProcessor.Clean(
    original,
    new CleanOptions(
        RemoveGps: false,
        RemoveDeviceAndProfileData: false,
        RemoveHeartRate: true,
        RemovePower: true,
        RemoveCadence: true));
var privateMetricsAnalysis = FitFileProcessor.Analyze(removedPrivateMetrics.FileBytes);
Require(!privateMetricsAnalysis.HasHeartRate, "Heart rate remains after selecting its removal.");
Require(!privateMetricsAnalysis.HasPower, "Power remains after selecting its removal.");
Require(!privateMetricsAnalysis.HasCadence, "Cadence remains after selecting its removal.");
Require(privateMetricsAnalysis.HasSpeed, "Speed should remain when only heart rate, power and cadence are removed.");
Require(privateMetricsAnalysis.DeveloperFieldCount == 3, "Selected native metric removal must not delete custom app fields.");
Require(removedPrivateMetrics.RemovedHeartRateFields > 0, "Expected heart rate fields to be counted.");
Require(removedPrivateMetrics.RemovedPowerFields > 0, "Expected power fields to be counted.");
Require(removedPrivateMetrics.RemovedCadenceFields > 0, "Expected cadence fields to be counted.");

var removedDeveloperData = FitFileProcessor.Clean(
    original,
    new CleanOptions(
        RemoveGps: false,
        RemoveDeviceAndProfileData: false,
        RemoveDeveloperData: true));
var removedDeveloperAnalysis = FitFileProcessor.Analyze(removedDeveloperData.FileBytes);
Require(removedDeveloperAnalysis.DeveloperFieldCount == 0, "Custom developer fields remain after selecting their removal.");
Require(!DecodeMessages(removedDeveloperData.FileBytes).Any(message =>
    message.Name.Equals("developerdataid", StringComparison.OrdinalIgnoreCase) ||
    message.Name.Equals("fielddescription", StringComparison.OrdinalIgnoreCase)),
    "Developer field definitions remain after selecting their removal.");
Require(removedDeveloperData.RemovedDeveloperFields == 3, "Expected all custom developer fields to be counted as removed.");

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
