FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY backend/FitPrivacyCleaner.csproj backend/
RUN dotnet restore backend/FitPrivacyCleaner.csproj

COPY backend/ backend/
COPY frontend/ frontend/
RUN dotnet publish backend/FitPrivacyCleaner.csproj --configuration Release --output /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "FitPrivacyCleaner.dll"]
