import express from 'express';
import request from 'supertest';
import { expect } from 'chai';
import loginRouter from './login.js'; // Assurez-vous que cela est correct

// Créez une instance d'application
const app = express();
app.use(express.json());
app.use('/', loginRouter); // Utilisez votre routeur ici

describe('POST /login', () => {
    it('should return 200 for valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal('Connexion réussie !');
    });

    it('should return 401 for invalid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' });

        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal('Identifiants incorrects');
    });
});
