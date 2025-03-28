export async function fetchStockReport(filename) {
    let url = `https://stock-analyzer-all.onrender.com/reports/${filename}`;
    console.log(url);
    const response = await fetch(`https://stock-analyzer-all.onrender.com/reports/${filename}`);
  
    if (!response.ok) {
      throw new Error("Report not found");
    }
  
    return await response.text(); // Get the HTML as a string
  }