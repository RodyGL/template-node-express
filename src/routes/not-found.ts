export default async function notFound() {
  return Promise.resolve({
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      error: 'Not found',
    },
    statusCode: 404,
  });
}
