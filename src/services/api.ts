
import axios from "axios";

import type { Employee } from "../types";

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await axios.post(
    "https://backend.jotish.in/backend_dev/gettabledata.php",
    {'username': 'test', 'password': '123456'}
  );

  console.log("FULL API RESPONSE:", response.data);

  const rawData = response.data?.TABLE_DATA?.data || response.data?.data || [];

   console.log("RAW DATA:", rawData); 



  // const rawData = response.data.TABLE_DATA.data;

  if (!rawData || rawData.length === 0) {
    return [];
  }

  const formattedData: Employee[] = rawData.map((row: any[]) => ({
    username: row[0],
    department: row[1],
    city: row[2],
    id: Number(row[3]),
    joinDate: row[4],
    salary: Number(row[5].replace(/[^0-9.-]+/g,"")), // convert "$320,800" to 320800
  }));

  return formattedData;
};