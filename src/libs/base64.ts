export const decode = (base64str: string) => {
  const safebase64str = base64str.replace(/[-_]/g, (match) =>
    match === "-" ? "+" : "/"
  );
  return globalThis.atob(safebase64str);
};
