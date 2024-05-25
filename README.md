# Register a new user
curl -X POST -H "Content-Type: application/json" -d '{"username": "example", "password": "password123"}' http://localhost:3000/register

# Login with the registered user
curl -X POST -H "Content-Type: application/json" -d '{"username": "example", "password": "password123"}' http://localhost:3000/login