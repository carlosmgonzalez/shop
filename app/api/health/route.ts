export async function GET() {
  const data = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };
  return Response.json(data);
}
