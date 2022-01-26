export const decode = async (base64str: string) => {
  const safebase64str = base64str.replace(/[-_]/g, (match) =>
    match == "-" ? "+" : "/"
  );
  const res = await fetch(
    `data:text/plain;charset=utf-8;base64,${safebase64str}`
  );
  return await res.text();
};
