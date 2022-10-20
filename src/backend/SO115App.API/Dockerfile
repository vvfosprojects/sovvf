#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["SO115App.API/SO115App.API.csproj", "SO115App.API/"]
COPY ["SO115App.CompositionRoot/SO115App.CompositionRoot.csproj", "SO115App.CompositionRoot/"]
COPY ["SO115App.Persistence.MongoDB/SO115App.Persistence.MongoDB.csproj", "SO115App.Persistence.MongoDB/"]
COPY ["SO115App.SignalR/SO115App.SignalR.csproj", "SO115App.SignalR/"]
COPY ["SO115App.CQRS/SO115App.CQRS.csproj", "SO115App.CQRS/"]
COPY ["SO115App.Models/SO115App.Models.csproj", "SO115App.Models/"]
COPY ["SO115App.Persistence.File/SO115App.Persistence.File.csproj", "SO115App.Persistence.File/"]
COPY ["SO115App.FakePersistance.ExternalAPI/SO115App.ExternalAPI.Fake.csproj", "SO115App.FakePersistance.ExternalAPI/"]
COPY ["SO115App.ExternalApi.Client/SO115App.ExternalAPI.Client.csproj", "SO115App.ExternalApi.Client/"]
COPY ["SO115App.Logging/SO115App.Logging.csproj", "SO115App.Logging/"]
COPY ["SO115App.Monitor/SO115App.Monitor.csproj", "SO115App.Monitor/"]
RUN dotnet restore "SO115App.API/SO115App.API.csproj"
COPY . .
WORKDIR "/src/SO115App.API"
RUN dotnet build "SO115App.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SO115App.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SO115App.API.dll"]