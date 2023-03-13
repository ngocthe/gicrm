import moment from "moment/moment";

enum ExportType {
  CSV = "csv",
}

export function exportFile(
  responseData: string,
  screenName: string,
  typeExport = ExportType.CSV
) {
  let url = "";
  if (typeExport === ExportType.CSV) {
    url = window.URL.createObjectURL(
      new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), responseData], {
        type: "text/csv;charset=utf-8",
      })
    );
  } else {
    url = window.URL.createObjectURL(new Blob([responseData]));
  }

  const fileName = `${screenName}_${moment().format(
    "YYYYMMDD-HHmmss"
  )}.${typeExport}`;
  const link = document.createElement("a");
  link.style.display = "none";

  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
}
