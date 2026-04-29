#!/bin/bash
set -e

echo "▶ Avvio backend Django (Docker Compose)..."
cd backend && docker-compose up -d
echo "✓ Backend su http://api.localhost"
echo "  Swagger: http://api.localhost/swagger"
echo "  Admin:   http://api.localhost/admin"
echo ""
echo "▶ Avvio frontend React..."
cd .. && npm run dev
