const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../index');
    })
    afterEach(async () => {
        await Genre.remove({});
        server.close();
    });
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([{
                    name: 'genre1'
                },
                {
                    name: 'genre2'
                }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
        it('should return 404 is there are no genre in the db', async() => {
            // await Genre.remove({});
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(404)
        })
    });
    describe('GET /:id', () => {
        it('should return a genre if valid ID is passed', async () => {
            const genre = new Genre({
                name: 'genre1'
            });
            
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return 404 if invalid ID is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
        it('should return 404 if no genre with given ID is present', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/1' + id);
            expect(res.status).toBe(404);
        });
    });
    describe('POST /', () => {
        let token;
        let name;

        const exec = async() => {
            return  await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name });
        }
        beforeEach(()=>{
            token = new User({}).generateAuthToken();
            name = 'genre1';
        });
        it('should return a 401 if client is not logged in', async() => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 400 if the genre length is less than 5', async() => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should return 400 if the genre length is more than 50', async() => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });
        it('should save the genre if it is valid', async() => {
            await exec();
            const genre = await Genre.find({name: 'genre1'});
            expect(genre).not.toBeNull();
        });
        it('should return the genre if it is valid', async() => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});

/**
 * TODO: 
 * Write the remaining tests for put, delete methods.
 */
