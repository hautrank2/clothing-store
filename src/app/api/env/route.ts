export const GET = () => {
  return Response.json({
    ...process.env,
  });
};
