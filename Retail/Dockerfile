# ──────────────────────────────────────────
# Backend (ASP.NET Core) — Multi-stage build
# ──────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY Retail/Retail.csproj Retail/
WORKDIR /src/Retail
RUN dotnet restore

# Copy everything and publish
COPY Retail/ .
RUN dotnet publish -c Release -o /app/publish --no-restore

# ──────────────────────────────────────────
# Runtime image
# ──────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 5200
ENV ASPNETCORE_URLS=http://+:5200
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "Retailen.dll"]
