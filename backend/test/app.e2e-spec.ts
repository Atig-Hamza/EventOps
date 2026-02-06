import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;
  let createdEventId: string;
  let createdReservationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 1. Signup Users
  it('/auth/signup (POST) - Create Admin', async () => {
    const email = `admin_${Date.now()}@e2e.test`;
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'password123',
        role: 'ADMIN',
      })
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    adminToken = response.body.token;
  });

  it('/auth/signup (POST) - Create Participant', async () => {
    const email = `user_${Date.now()}@e2e.test`;
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: 'password123',
        role: 'PARTICIPANT',
      })
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    userToken = response.body.token;
  });

  // 2. Admin Creates Event
  it('/events (POST) - Admin creates event', async () => {
    const response = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'E2E Test Event',
        description: 'Testing full flow',
        dateTime: new Date(Date.now() + 86400000).toISOString(),
        location: 'Test Location',
        capacity: 10,
      })
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    createdEventId = response.body.id;
  });

  // 3. Admin Publishes Event
  it('/events/:id (PATCH) - Admin publishes event', async () => {
    await request(app.getHttpServer())
      .patch(`/events/${createdEventId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'PUBLISHED' })
      .expect(200);
  });

  // 4. Participant Reserves Event
  it('/reservations (POST) - Participant reserves', async () => {
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ eventId: createdEventId })
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    createdReservationId = response.body.id;
  });

  // 5. Admin Confirms Reservation
  it('/reservations/:id/status (PATCH) - Admin confirms', async () => {
    await request(app.getHttpServer())
      .patch(`/reservations/${createdReservationId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'CONFIRMED' })
      .expect(200);
  });

  // 6. Verification
  it('/reservations/my (GET) - Participant checks status', async () => {
    const response = await request(app.getHttpServer())
      .get('/reservations/my')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const reservation = response.body.find((r: { id: string; status: string }) => r.id === createdReservationId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(reservation.status).toBe('CONFIRMED');
  });
});
