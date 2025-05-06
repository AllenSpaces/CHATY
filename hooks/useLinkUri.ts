export function useLinkUri(uri: string) {
  const urlObj: any = new URL(uri);
  let params: any = urlObj.search.split("?")[1];

  let data: any = {};
  if (params.includes("&")) {
    params.split("&").forEach((item: any) => {
      data[item.split("=")[0]] = item.split("=")[1];
    });
  } else {
    data[params.split("=")[0]] = params.split("=")[1];
  }
  return {
    host: urlObj.host,
    params: data,
  };
}
