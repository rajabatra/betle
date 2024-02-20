import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios'; // Ensure you have axios installed or use fetch API

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  indexAxis: 'y',
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      enabled: true,
    },
    afterDatasetsDraw: (chart, args, options) => {
      const { ctx, data, scales } = chart;
      const { x } = scales;

      ctx.font = '12px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      data.datasets.forEach((dataset, datasetIndex) => {
        chart.getDatasetMeta(datasetIndex).data.forEach((bar, index) => {
          const value = dataset.data[index];
          const total = dataset.data.reduce((acc, curr) => acc + curr, 0);
          const percentage = ((value / total) * 100).toFixed(2) + '%';
          const position = bar.tooltipPosition();
          ctx.fillText(percentage, x.getPixelForValue(value) + 5, position.y);
        });
      });
    },
  },
};

const ChartToggle = () => {
  const [showFirstBarChart, setShowFirstBarChart] = useState(true);
  const [teamData, setTeamData] = useState({team1: 0, team2: 0});

  const dataFirstBar = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19],
        backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace the URL with your actual endpoint
        const response = await axios.get('http://localhost:8081/getLivePicks');
        setTeamData(response.data.gameForToday);
        console.log(response.data)
        console.log(teamData)
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchData();
  }, []);

  

  const dataSecondBar = {
    labels: ['Home', 'Away'],
    datasets: [
      {
        label: 'Todays Spread',
        data: [teamData.team1, teamData.team2],
        backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          
        ],
        borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
          
        ],
        borderWidth: 1,
      },
    ],
  };

  const toggleChart = () => {
    setShowFirstBarChart(!showFirstBarChart);
  };

  return (
    <div className="box2">
      <label className="toggle-switch">
        <input onClick={toggleChart} type="checkbox" />
        <span className="slider round"></span>
      </label>

      {showFirstBarChart ? (
        <Bar data={dataFirstBar} options={options} />
      ) : (
        <Bar data={dataSecondBar} options={options} />
      )}
    </div>
  );
};

export default ChartToggle;