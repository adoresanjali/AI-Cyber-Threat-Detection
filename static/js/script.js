// AI Cyber Threat Detection System - Main JavaScript

// Initialize Pie Chart, History Data, and Latest Report
let pieChart;
let historyData = [];
let latestReport = {};

// Load Metrics
fetch("/metrics")
.then(res => res.json())
.then(data => {
    document.getElementById("accuracy").innerHTML = data.accuracy;
    document.getElementById("precision").innerHTML = data.precision;
    document.getElementById("recall").innerHTML = data.recall;
    document.getElementById("f1").innerHTML = data.f1_score;
})
.catch(error => {
    console.error("Error loading metrics:", error);
});

function predict(){
    let text = document.getElementById("features").value;

    if(!text.trim()){
        alert("Please enter feature values");
        return;
    }

    let arr = text.split(",").map(Number);

    // Validate exactly 41 features
    if(arr.length !== 41){
        alert("Please enter exactly 41 features.\nYou entered " + arr.length + " features.");
        return;
    }

    // Validate numeric input
    if(arr.some(isNaN)){
        alert("Only numeric values are allowed.");
        return;
    }

    fetch("/predict",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            features:arr
        })
    })
    .then(res => res.json())
    .then(data => {

        let resultDiv = document.getElementById("result");

        if(data.prediction.includes("Threat")){
            resultDiv.innerHTML = "🚨 " + data.prediction + " (" + data.confidence + "%)";
            resultDiv.style.color = "#ef5350";
        }
        else{
            resultDiv.innerHTML = "✅ " + data.prediction + " (" + data.confidence + "%)";
            resultDiv.style.color = "#66bb6a";
        }

    })
    .catch(error => {
        document.getElementById("result").innerHTML = "Error : " + error;
        console.error("Predict error:", error);
    });
}

function uploadCSV(){

    let file = document.getElementById("csvFile").files[0];

    if(!file){
        alert("Please select a file first.");
        return;
    }

    let formData = new FormData();
    formData.append("file", file);

    document.getElementById("uploadResult").innerHTML = 
        '<div class="text-warning">⏳ Processing file...</div>';

    fetch("/upload",{
        method:"POST",
        body:formData
    })
    .then(res => res.json())
    .then(data => {

        if(data.error){
            document.getElementById("uploadResult").innerHTML =
                "<span style='color:red'>❌ Error: " + data.error + "</span>";
            return;
        }

        let safePercent = ((data.safe / data.total) * 100).toFixed(1);
        let threatPercent = ((data.threat / data.total) * 100).toFixed(1);

        // Update Live Analytics Cards
        document.getElementById("liveTotal").innerHTML = data.total;
        document.getElementById("liveSafe").innerHTML = data.safe;
        document.getElementById("liveThreat").innerHTML = data.threat;
        document.getElementById("liveRate").innerHTML = threatPercent + "%";

        // Destroy previous chart if it exists
        if (pieChart) {
            pieChart.destroy();
        }

        const ctx = document.getElementById("pieChart");

        pieChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Safe Traffic", "Threat Traffic"],
                datasets: [{
                    data: [data.safe, data.threat],
                    backgroundColor: [
                        "#22c55e",
                        "#ef4444"
                    ],
                    borderColor: "#161b22",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            color: "white",
                            font: {
                                size: 14
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: "Network Traffic Distribution",
                        color: "white",
                        font: {
                            size: 18
                        }
                    }
                }
            }
        });

        // Dark-themed Success Summary
        document.getElementById("uploadResult").innerHTML = `
            <div class="dark-success-card mt-3">
                <h5>✅ Upload Successful!</h5>
                <p class="mb-2">Dataset analyzed successfully.</p>
                <div class="d-flex justify-content-between mb-2">
                    <span>Safe Traffic : <strong>${safePercent}%</strong></span>
                    <span>Threat Traffic : <strong>${threatPercent}%</strong></span>
                </div>
                <div class="progress mt-2" style="height:20px;">
                    <div class="progress-bar bg-success" style="width:${safePercent}%;">Safe ${safePercent}%</div>
                    <div class="progress-bar bg-danger" style="width:${threatPercent}%;">Threat ${threatPercent}%</div>
                </div>
            </div>
        `;

        // Update Detection History Table with Dynamic Status Badges
        const currentTime = new Date().toLocaleTimeString();

        historyData.unshift({
            time: currentTime,
            total: data.total,
            safe: data.safe,
            threat: data.threat,
            threatPercent: threatPercent
        });

        let table = "";

        historyData.forEach(item => {
            let statusBadge = `<span class="badge bg-success">🟢 Safe</span>`;
            if(item.threatPercent > 50) {
                statusBadge = `<span class="badge bg-danger">🔴 High</span>`;
            } else if (item.threatPercent > 25) {
                statusBadge = `<span class="badge bg-warning text-dark">🟠 Medium</span>`;
            }

            table += `
            <tr>
                <td>${item.time}</td>
                <td>${item.total}</td>
                <td class="text-success">${item.safe}</td>
                <td class="text-danger">${item.threat}</td>
                <td>${statusBadge}</td>
            </tr>
            `;
        });

        document.getElementById("historyTable").innerHTML = table;

        // Step 3: Display AI report in the new Beautiful Card
        document.getElementById("aiReport").innerHTML = `
        <div class="card bg-dark text-white border-success mt-3">
            <div class="card-body">
                <pre style="
        white-space: pre-wrap;
        font-family: Arial;
        font-size:15px;
        margin:0;
        color:white;
        ">${data.ai_report}</pre>
            </div>
        </div>
        `;

        // Step 3 continued: Parse string to keep PDF working
        let level = "N/A";
        let attack = "N/A";
        if (data.ai_report) {
            const levelMatch = data.ai_report.match(/Threat Level:\s*([^\n]*)/);
            const attackMatch = data.ai_report.match(/Possible Attack:\s*([^\n]*)/);
            if (levelMatch) level = levelMatch[1].trim();
            if (attackMatch) attack = attackMatch[1].trim();
        }

        // Update latestReport for CSV and PDF generation
        latestReport = {
            date: new Date().toLocaleString(),
            total: data.total,
            safe: data.safe,
            threat: data.threat,
            threatRate: data.threat_rate + "%",
            threatLevel: level,
            attackType: attack
        };

    })
    .catch(error => {
        document.getElementById("uploadResult").innerHTML = 
            "<span style='color:red'>❌ Error: " + error + "</span>";
        console.error("Upload error:", error);
    });
}

// CSV Download Report
function downloadReport(){
    if(!latestReport.total){
        alert("Please upload a dataset first.");
        return;
    }

    let csv = 
`Date,Total Records,Safe Traffic,Threat Traffic,Threat Rate
${latestReport.date},
${latestReport.total},
${latestReport.safe},
${latestReport.threat},
${latestReport.threatRate}`;

    let blob = new Blob([csv],{
        type:"text/csv"
    });

    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "prediction_report.csv";
    a.click();
    URL.revokeObjectURL(url);
}

// PDF Download Report
async function downloadPDFReport(){
    if(!latestReport.total){
        alert("Please upload a dataset first.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setFont("helvetica","bold");
    doc.text("AI Cyber Threat Detection System",20,20);

    doc.setFontSize(16);
    doc.text("Threat Analysis Report",20,35);

    doc.setFontSize(12);
    doc.setFont("helvetica","normal");

    doc.text("Generated : " + latestReport.date,20,50);

    doc.line(20,58,190,58);

    doc.setFont("helvetica","bold");
    doc.text("Analysis Summary",20,72);

    doc.setFont("helvetica","normal");

    doc.text("Total Records : " + latestReport.total,25,85);
    doc.text("Safe Traffic : " + latestReport.safe,25,95);
    doc.text("Threat Traffic : " + latestReport.threat,25,105);
    doc.text("Threat Rate : " + latestReport.threatRate,25,115);

    doc.line(20,125,190,125);

    doc.setFont("helvetica","bold");
    doc.text("AI Threat Analysis",20,140);

    doc.setFont("helvetica","normal");

    // No emojis here, uses clean parsed values!
    doc.text("Threat Level : " + latestReport.threatLevel, 25, 155);
    doc.text("Possible Attack : " + latestReport.attackType, 25, 165);

    doc.line(20,175,190,175);

    doc.setFont("helvetica","bold");
    doc.text("Recommendations",20,190);

    doc.setFont("helvetica","normal");

    doc.text("- Monitor Network Traffic",25,205);
    doc.text("- Inspect Firewall Logs",25,215);
    doc.text("- Review IDS Alerts",25,225);
    doc.text("- Enable Rate Limiting",25,235);

    doc.save("AI_Cyber_Threat_Report.pdf");
}

// 🕒 Live Clock Functionality
function updateClock(){
    const now = new Date();
    document.getElementById("clock").innerHTML = now.toLocaleTimeString();
}

// Run immediately on load, then update every 1 second
updateClock();
setInterval(updateClock, 1000);