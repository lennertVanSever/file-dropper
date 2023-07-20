import "./App.css";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import csv from "csvtojson";

const defaultJsonData = [[""], [""], [""], [""]];
function App() {
  const [jsonData, setJsonData] = useState(defaultJsonData);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");

      reader.onload = () => {
        // Do whatever you want with the file contents
        if (typeof reader.result === "string") {
          csv({
            noheader: true,
            output: "csv",
          })
            .fromString(reader.result)
            .then((csvRow: any[]) => {
              setJsonData(csvRow);
            });
        }
      };
      reader.readAsText(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragReject, isDragAccept, isFocused } =
    useDropzone({
      onDrop,
      accept: { "text/csv": [".csv"] },
    });

  return (
    <div className="p-4">
      <div className="cursor-pointer" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragReject ? (
          <div className="h-96 grid place-items-center bg-red-200">
            <p className="text-xl text-red-700">Only csv files are accepted</p>
          </div>
        ) : isDragAccept ? (
          <div className="h-96 grid place-items-center bg-green-200">
            <p className="text-xl text-green-700">Drop the files here ...</p>
          </div>
        ) : (
          <div className="h-96 grid place-items-center bg-blue-200">
            <p className="text-xl text-blue-700">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        )}
      </div>
      <table className="mt-5 min-w-full text-left text-sm font-light">
        {jsonData.map((jsonRow, rowIndex) => (
          <tr
            className={`border ${
              rowIndex ? "dark:border-neutral-500" : "border-blue-500"
            }`}
          >
            {jsonRow.map((jsonCell: string) => {
              if (rowIndex === 0) {
                return (
                  <th className="whitespace-nowrap px-6 py-4 font-bold text-base text-blue-500 bg-blue-50">
                    {jsonCell}
                  </th>
                );
              } else {
                return (
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-neutral-600">
                    {jsonCell}
                  </td>
                );
              }
            })}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
