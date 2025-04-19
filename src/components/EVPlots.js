
import React, { useEffect, useState } from 'react';
import './EVPlots.css';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91', '#FFC75F', '#F9F871', '#2C73D2'];

const EVPlots = () => {
  const [plots, setPlots] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/plots')
      .then(response => response.json())
      .then(data => setPlots(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const renderDescription = (desc) => {
    if (!desc) return null;
    const lines = typeof desc === 'string' ? desc.split('\n') : [];
    return lines.map((line, idx) => (
      <p key={idx} className="description-line">{line}</p>
    ));
  };

  const renderPie = (plot, index) => (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={plot.data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {plot.data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderBar = (plot, index) => (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={plot.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const LeftDescription = ({ description }) => (
    <div className="chart-hover-group">
      <div className="popup-container">
        <div className="popup">
          {renderDescription(description)}
        </div>
      </div>
    </div>
  );

  const RightDescription = ({ description }) => (
    <div className="chart-hover-group">
      <div className="popup-container right-popup-container">
        <div className="popup">
          {renderDescription(description)}
        </div>
      </div>
    </div>
  );

  const renderCombo = (plot, index) => (
    <div className="make-chart-container">
      <div className="chart-hover-group">
        {plot.position === "left" && (
          <LeftDescription description={plot.description} />
        )}

        <div className="pie-chart-container">
          <h3>{plot.title} (Pie)</h3>
          {renderPie(plot, index)}
        </div>

        <div className="bar-chart-container">
          <h3>{plot.title} (Bar)</h3>
          {renderBar(plot, index)}
        </div>

        {plot.position === "right" && (
          <RightDescription description={plot.description} />
        )}
      </div>
    </div>
  );

  // 👇 Smooth scroll to selected section
  const scrollToSection = (event) => {
    const sectionId = event.target.value;
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    event.target.value = "";
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>EV Data Dashboard</h1>
        <div className="header-right" >
          <select onChange={scrollToSection} style={{
    backgroundColor: '#fffdf5f4', color:'#8e696c'}}>
            <option value="">Jump to section...</option>
            <option value="makes">Top 10 EV Makes</option>
            <option value="models">Top 10 EV Models</option>
            <option value="type">EV Type Distribution</option>
            <option value="registration">EV Registrations by Year</option>
            <option value="range">Electric Range Distribution</option>
            <option value="county">EV Count by County</option>
            <option value="cities">Top Cities Using EVs</option>
            <option value="utility">EV Count by Utility</option>
            <option value="cafv">CAFV Eligibility</option>
          </select>
        </div>
      </header>

      <section className="write-up">
        <h2>About Electric Vehicles</h2>
        <p>Electric vehicles (EVs) are automobiles powered by electric motors, which run on electricity stored in batteries. EVs are an environmentally friendly alternative to traditional gasoline-powered cars, reducing harmful emissions and contributing to cleaner air. They are becoming increasingly popular as technology improves, offering higher driving ranges, faster charging times, and lower maintenance costs. EVs also offer benefits like tax incentives and reduced operational costs for owners.
        </p>
      </section>

      <div className="dashboard-container">
        {plots.map((plot, index) => {
          const idMap = {
            0: 'makes',
            1: 'models',
            2: 'type',
            3: 'registration',
            4: 'range',
            5: 'county',
            6: 'cities',
            7: 'utility',
            8: 'cafv'
          };
          const plotId = idMap[index];

          return (
            <div
              id={plotId}
              key={index}
              className={`dashboard-plot ${index % 2 === 0 ? 'left-align' : 'right-align'}`}
            >
              <div className="dashboard-inner">
                {plot.type === 'combo'
                  ? renderCombo(plot, index)
                  : plot.type === 'pie'
                    ? renderPie(plot, index)
                    : plot.type === 'bar'
                      ? renderBar(plot, index)
                      : null}

                {plot.type !== 'combo' && plot.description && (
                  <div className="popup">
                    {renderDescription(plot.description)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EVPlots;
