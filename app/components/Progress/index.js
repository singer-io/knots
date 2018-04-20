import React from 'react';

const Progress = () => (
  <ul className="nav nav-pills nav-justified">
    <li className="nav-item">
      <a href="#" className="nav-link completed">
        <span className="step">1</span>
        <span className="oi oi-check" />
      </a>
      <small>Select Tap</small>
    </li>
    <li className="nav-item">
      <a href="#" className="nav-link completed">
        <span className="step">2</span>
        <span className="oi oi-check" />
      </a>
      <small>Configure Tap</small>
    </li>
    <li className="nav-item">
      <a href="#" className="nav-link active">
        <span className="step">3</span>
        <span className="oi oi-check" />
      </a>
      <small>Replication Options</small>
    </li>
    <li className="nav-item">
      <a href="#" className="nav-link disabled">
        <span className="step">4</span>
        <span className="oi oi-check" />
      </a>
      <small>Configure Target</small>
    </li>
    <li className="nav-item">
      <a href="#" className="nav-link disabled">
        <span className="step">5</span>
        <span className="oi oi-check" />
      </a>
      <small>Save/Run</small>
    </li>
  </ul>
);

export default Progress;
