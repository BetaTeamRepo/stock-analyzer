export async function fetchStockReport(filename) {
    let url = `http://localhost:8000/reports/${filename}`;
    console.log(url);
    const response = await fetch(`http://localhost:8000/reports/${filename}`);
  
    if (!response.ok) {
      throw new Error("Report not found");
    }
  
    return await response.text(); // Get the HTML as a string
  }