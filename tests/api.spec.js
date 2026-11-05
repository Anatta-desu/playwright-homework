
import { test, expect } from '@playwright/test';

const baseURL = 'https://restful-booker.herokuapp.com';

const bookingData = {
  firstname: 'Jim',
  lastname: 'Brown',
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: '2018-01-01',
    checkout: '2019-01-01'
  },
  additionalneeds: 'Breakfast'
};

const updatedBookingData = {
  firstname: 'James',
  lastname: 'Brown',
  totalprice: 222,
  depositpaid: false,
  bookingdates: {
    checkin: '2020-01-01',
    checkout: '2021-01-01'
  },
  additionalneeds: 'Lunch'
};

async function createBooking(request) {
  const response = await request.post(`${baseURL}/booking`, {
    data: bookingData
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.bookingid).toBeTruthy();

  return body.bookingid;
}

async function getToken(request) {
  const response = await request.post(`${baseURL}/auth`, {
    data: {
      username: 'admin',
      password: 'password123'
    }
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.token).toBeTruthy();

  return body.token;
}

test.describe('API tests for Restful Booker @api', () => {
  test('Create booking', async ({ request }) => {
    const response = await request.post(`${baseURL}/booking`, {
      data: bookingData
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.bookingid).toBeTruthy();
    expect(body.booking).toMatchObject(bookingData);
  });

  test('Read booking', async ({ request }) => {
    const bookingId = await createBooking(request);

    const response = await request.get(
      `${baseURL}/booking/${bookingId}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toMatchObject(bookingData);
  });

  test('Update booking', async ({ request }) => {
    const bookingId = await createBooking(request);
    const token = await getToken(request);

    const response = await request.put(
      `${baseURL}/booking/${bookingId}`,
      {
        headers: {
          Cookie: `token=${token}`
        },
        data: updatedBookingData
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toMatchObject(updatedBookingData);
  });

  test('Delete booking', async ({ request }) => {
    const bookingId = await createBooking(request);
    const token = await getToken(request);

    const response = await request.delete(
      `${baseURL}/booking/${bookingId}`,
      {
        headers: {
          Cookie: `token=${token}`
        }
      }
    );

    expect(response.status()).toBe(201);

    const checkResponse = await request.get(
      `${baseURL}/booking/${bookingId}`
    );

    expect(checkResponse.status()).toBe(404);
  });
});
