# PowerShell script to create PostgreSQL database
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE DATABASE smartseason;"

Write-Host "Database 'smartseason' created successfully!"

# Now run the initialization script
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5432 -d smartseason -f "database/init.sql"

Write-Host "Database initialized with tables and sample data!"
