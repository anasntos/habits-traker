// charts.js
export function createWeeklyChart(ctx, historyData){
  // historyData: array of 'YYYY-MM-DD'
  // build dataset: last 7 days counts (0/1)
  const labels = [];
  const data = [];
  for(let i=6;i>=0;i--){
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0,10);
    labels.push(key.slice(5)); // MM-DD
    data.push(historyData.includes(key) ? 1 : 0);
  }
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets:[{ label: 'Completions', data }]},
    options: { responsive:true, maintainAspectRatio:false }
  });
}
