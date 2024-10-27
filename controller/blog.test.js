const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose');
let uploadedImage

require("dotenv").config()

beforeAll(async () => {
    await mongoose.connect("mongodb+srv://carrot1382:jV97j5h2FhnRT6ap@test-project.mwxwd.mongodb.net/BlogApp?retryWrites=true&w=majority&appName=test-project");
});
afterAll(async () => {
    await mongoose.connection.close();
});
describe("Blog controller" ,() => {
    it('should return 400 for missing Title', async() => {
        const res = await request(app)
            .post('/blogs')

        expect(res.status).toBe(400)
        expect(res.body.message).toBe("Please provide a Title")
    });

    it('should return 400 for missing Image', async() => {
        const res = await request(app)
            .post('/blogs')
            .send({title: "testblog"})

        expect(res.status).toBe(400)
        expect(res.body.message).toBe("Please provide an Image")
    });

    it('should return 201 for creation', async() => {
        const res = await request(app)
            .post('/blogs')
            .field('title', "testblog")
            .field('category', "tech")
            .field('content', "some content")
            .attach('image', `${__dirname}/../uploads/test.jpg`);

        uploadedImage = res.body.blog.image;
        expect(res.status).toBe(201)
        expect(res.body.message).toBe("Blog successfully created")
    });

    it('should return all blogs', async () => {
        const res = await request(app).get('/blogs');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(Array.isArray(res.body.Blogs)).toBe(true);
    });

    it('should get a single blog by title', async () => {
        const res = await request(app).get('/blogs/testblog');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.blog).toHaveProperty('title', "testblog");
    });

    it('should return 404 for non-existent blog', async () => {
        const res = await request(app).get('/blogs/Non-existent Blog');

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('status', 'fail');
        expect(res.body).toHaveProperty('message', 'no Blog found');
    });

    it('should update a blog successfully', async () => {
        const res = await request(app)
            .patch('/blogs/testblog')
            .field('content', 'Updated content.')

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.data.blog).toHaveProperty('content', 'Updated content.');
    });

    it('should delete a blog successfully', async () => {
        const res = await request(app)
            .delete('/blogs/testblog');

        expect(res.statusCode).toBe(200);
    });

    it('should return 404 for deleting non-existent blog', async () => {
        const res = await request(app)
            .delete('/blogs/Non-existent Blog');

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('status', 'fail');
        expect(res.body).toHaveProperty('message', 'no Blog found');
    });
})