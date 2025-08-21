// Application Data
const appData = {
  vehicles: [
    {"id": "V001", "type": "Truck", "driver": "John Smith", "location": "Delhi", "status": "Active", "fuel": 78, "lat": 28.6139, "lng": 77.2090},
    {"id": "V002", "type": "Van", "driver": "Sarah Johnson", "location": "Mumbai", "status": "Idle", "fuel": 65, "lat": 19.0760, "lng": 72.8777},
    {"id": "V003", "type": "Car", "driver": "Mike Wilson", "location": "Bangalore", "status": "Active", "fuel": 42, "lat": 12.9716, "lng": 77.5946},
    {"id": "V004", "type": "Truck", "driver": "Emily Davis", "location": "Chennai", "status": "Maintenance", "fuel": 89, "lat": 13.0827, "lng": 80.2707},
    {"id": "V005", "type": "Van", "driver": "Chris Brown", "location": "Hyderabad", "status": "Active", "fuel": 56, "lat": 17.3850, "lng": 78.4867},
    {"id": "V006", "type": "Car", "driver": "Lisa Garcia", "location": "Pune", "status": "Idle", "fuel": 73, "lat": 18.5204, "lng": 73.8567},
    {"id": "V007", "type": "Truck", "driver": "David Lee", "location": "Kolkata", "status": "Active", "fuel": 91, "lat": 22.5726, "lng": 88.3639},
    {"id": "V008", "type": "Van", "driver": "Maria Rodriguez", "location": "Ahmedabad", "status": "Idle", "fuel": 38, "lat": 23.0225, "lng": 72.5714},
    {"id": "V009", "type": "Car", "driver": "James Wilson", "location": "Jaipur", "status": "Active", "fuel": 67, "lat": 26.9124, "lng": 75.7873},
    {"id": "V010", "type": "Truck", "driver": "Anna Kumar", "location": "Lucknow", "status": "Maintenance", "fuel": 54, "lat": 26.8467, "lng": 80.9462},
    {"id": "V011", "type": "Van", "driver": "Robert Chen", "location": "Kanpur", "status": "Active", "fuel": 82, "lat": 26.4499, "lng": 80.3319},
    {"id": "V012", "type": "Car", "driver": "Sophie Taylor", "location": "Nagpur", "status": "Idle", "fuel": 76, "lat": 21.1458, "lng": 79.0882}
  ],
  trips: [
    {"id": "T001", "vehicle": "V001", "start": "Delhi", "end": "Gurgaon", "status": "In Progress", "distance": "28 km", "eta": "45 min"},
    {"id": "T002", "vehicle": "V003", "start": "Bangalore", "end": "Mysore", "status": "In Progress", "distance": "156 km", "eta": "2h 30min"},
    {"id": "T003", "vehicle": "V005", "start": "Hyderabad", "end": "Warangal", "status": "In Progress", "distance": "145 km", "eta": "2h 15min"},
    {"id": "T004", "vehicle": "V007", "start": "Kolkata", "end": "Durgapur", "status": "In Progress", "distance": "165 km", "eta": "2h 45min"},
    {"id": "T005", "vehicle": "V009", "start": "Jaipur", "end": "Ajmer", "status": "In Progress", "distance": "135 km", "eta": "2h 10min"},
    {"id": "T006", "vehicle": "V011", "start": "Kanpur", "end": "Allahabad", "status": "In Progress", "distance": "198 km", "eta": "3h 15min"},
    {"id": "T007", "vehicle": "V012", "start": "Nagpur", "end": "Wardha", "status": "In Progress", "distance": "78 km", "eta": "1h 30min"}
  ],
  analytics: {
    fuel_consumption: [
      {"month": "Jan", "consumption": 2400, "efficiency": 82},
      {"month": "Feb", "consumption": 2200, "efficiency": 85},
      {"month": "Mar", "consumption": 2600, "efficiency": 78},
      {"month": "Apr", "consumption": 2100, "efficiency": 88},
      {"month": "May", "consumption": 2350, "efficiency": 84},
      {"month": "Jun", "consumption": 2180, "efficiency": 87}
    ],
    driver_scores: [
      {"name": "John Smith", "score": 94, "safety": 96, "efficiency": 92},
      {"name": "Sarah Johnson", "score": 87, "safety": 89, "efficiency": 85},
      {"name": "Mike Wilson", "score": 91, "safety": 88, "efficiency": 94},
      {"name": "Emily Davis", "score": 89, "safety": 91, "efficiency": 87},
      {"name": "Chris Brown", "score": 85, "safety": 83, "efficiency": 87}
    ]
  }
};

// Application State
let currentSection = 'dashboard';
let filteredVehicles = [...appData.vehicles];
let fuelChartInstance = null;
let driverChartInstance = null;

// Global functions for HTML onclick handlers
function showVehicleDetails(vehicleId) {
  console.log('Showing details for vehicle:', vehicleId);
  
  const vehicle = appData.vehicles.find(v => v.id === vehicleId);
  if (!vehicle) {
    console.error('Vehicle not found:', vehicleId);
    return;
  }
  
  const modal = document.getElementById('vehicle-modal');
  const modalTitle = document.getElementById('modal-vehicle-id');
  const modalBody = document.getElementById('modal-body');
  
  if (modalTitle) modalTitle.textContent = `Vehicle ${vehicle.id} Details`;
  
  if (modalBody) {
    const statusClass = vehicle.status.toLowerCase();
    const fuelClass = vehicle.fuel < 50 ? 'low' : vehicle.fuel < 70 ? 'medium' : 'high';
    
    modalBody.innerHTML = `
      <div style="display: grid; gap: 16px;">
        <div class="modal-detail-row">
          <strong>Vehicle Type:</strong> ${vehicle.type}
        </div>
        <div class="modal-detail-row">
          <strong>Driver:</strong> ${vehicle.driver}
        </div>
        <div class="modal-detail-row">
          <strong>Current Location:</strong> ${vehicle.location}
        </div>
        <div class="modal-detail-row">
          <strong>Status:</strong> 
          <span class="vehicle-status ${statusClass}">
            <span class="status-dot ${statusClass}"></span>
            ${vehicle.status}
          </span>
        </div>
        <div class="modal-detail-row">
          <strong>Fuel Level:</strong>
          <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
            <div class="fuel-bar">
              <div class="fuel-fill ${fuelClass}" style="width: ${vehicle.fuel}%"></div>
            </div>
            <span>${vehicle.fuel}%</span>
          </div>
        </div>
        <div class="modal-detail-row">
          <strong>GPS Coordinates:</strong> ${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}
        </div>
        <div class="modal-detail-row">
          <strong>Last Updated:</strong> ${new Date().toLocaleString()}
        </div>
      </div>
    `;
  }
  
  if (modal) {
    modal.classList.remove('hidden');
    console.log('Modal opened for vehicle:', vehicleId);
  }
}

function closeModal() {
  const modal = document.getElementById('vehicle-modal');
  if (modal) {
    modal.classList.add('hidden');
    console.log('Modal closed');
  }
}

// Initialize Application
function initializeApp() {
  console.log('Initializing SmartFleet Tracker...');
  
  // Wait a bit to ensure DOM is fully loaded
  setTimeout(() => {
    initializeNavigation();
    initializeVehicleTable();
    initializeModal();
    initializeRouteOptimization();
    initializeMarkerTooltips();
    simulateRealTimeUpdates();
    populateTripsGrid();
    
    console.log('SmartFleet Tracker initialized successfully');
  }, 100);
}

// Navigation System
function initializeNavigation() {
  console.log('Setting up navigation...');
  
  const navButtons = document.querySelectorAll('.nav-btn');
  console.log('Found', navButtons.length, 'navigation buttons');
  
  navButtons.forEach((button, index) => {
    const section = button.getAttribute('data-section');
    console.log(`Button ${index}: ${section}`);
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetSection = this.getAttribute('data-section');
      console.log('Navigation clicked:', targetSection);
      
      switchSection(targetSection);
    });
  });
  
  console.log('Navigation event listeners attached');
}

function switchSection(sectionId) {
  console.log('Switching to section:', sectionId);
  
  // Update navigation buttons
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  const activeButton = document.querySelector(`[data-section="${sectionId}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
    console.log('Active button updated');
  } else {
    console.error('Active button not found for section:', sectionId);
  }
  
  // Update sections
  const sections = document.querySelectorAll('.section');
  console.log('Found', sections.length, 'sections');
  
  sections.forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });
  
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    targetSection.style.display = 'block';
    console.log('Target section activated:', sectionId);
  } else {
    console.error('Target section not found:', sectionId);
  }
  
  currentSection = sectionId;
  
  // Trigger section-specific initialization
  if (sectionId === 'analytics') {
    setTimeout(() => {
      initializeCharts();
    }, 200);
  } else if (sectionId === 'vehicles') {
    setTimeout(() => {
      filterVehicles();
    }, 100);
  }
  
  console.log('Section switched to:', sectionId);
}

// Vehicle Management
function initializeVehicleTable() {
  console.log('Initializing vehicle table...');
  renderVehicleTable();
  
  const vehicleSearch = document.getElementById('vehicle-search');
  const statusFilter = document.getElementById('status-filter');
  
  // Search functionality
  if (vehicleSearch) {
    vehicleSearch.addEventListener('input', function() {
      console.log('Search input changed:', this.value);
      filterVehicles();
    });
    console.log('Search input event listener added');
  } else {
    console.log('Vehicle search input not found');
  }
  
  // Status filter
  if (statusFilter) {
    statusFilter.addEventListener('change', function() {
      console.log('Status filter changed:', this.value);
      filterVehicles();
    });
    console.log('Status filter event listener added');
  } else {
    console.log('Status filter not found');
  }
}

function filterVehicles() {
  const vehicleSearch = document.getElementById('vehicle-search');
  const statusFilter = document.getElementById('status-filter');
  
  const searchTerm = vehicleSearch ? vehicleSearch.value.toLowerCase() : '';
  const statusFilterValue = statusFilter ? statusFilter.value : '';
  
  filteredVehicles = appData.vehicles.filter(vehicle => {
    const matchesSearch = !searchTerm || 
      vehicle.id.toLowerCase().includes(searchTerm) ||
      vehicle.driver.toLowerCase().includes(searchTerm) ||
      vehicle.location.toLowerCase().includes(searchTerm) ||
      vehicle.type.toLowerCase().includes(searchTerm);
    
    const matchesStatus = !statusFilterValue || vehicle.status === statusFilterValue;
    
    return matchesSearch && matchesStatus;
  });
  
  renderVehicleTable();
  console.log('Vehicles filtered:', filteredVehicles.length, 'of', appData.vehicles.length);
}

function renderVehicleTable() {
  const vehiclesTableBody = document.getElementById('vehicles-tbody');
  if (!vehiclesTableBody) {
    console.log('Vehicle table body not found');
    return;
  }
  
  vehiclesTableBody.innerHTML = '';
  
  filteredVehicles.forEach(vehicle => {
    const row = document.createElement('tr');
    
    const fuelClass = vehicle.fuel < 50 ? 'low' : vehicle.fuel < 70 ? 'medium' : 'high';
    const statusClass = vehicle.status.toLowerCase();
    
    row.innerHTML = `
      <td>${vehicle.id}</td>
      <td>${vehicle.type}</td>
      <td>${vehicle.driver}</td>
      <td>${vehicle.location}</td>
      <td>
        <span class="vehicle-status ${statusClass}">
          <span class="status-dot ${statusClass}"></span>
          ${vehicle.status}
        </span>
      </td>
      <td>
        <div class="fuel-bar">
          <div class="fuel-fill ${fuelClass}" style="width: ${vehicle.fuel}%"></div>
        </div>
        <span style="font-size: 12px; color: var(--color-text-secondary); margin-left: 8px;">${vehicle.fuel}%</span>
      </td>
      <td>
        <button class="action-btn" onclick="showVehicleDetails('${vehicle.id}')">View Details</button>
      </td>
    `;
    
    vehiclesTableBody.appendChild(row);
  });
  
  console.log('Vehicle table rendered with', filteredVehicles.length, 'vehicles');
}

// Modal Functionality
function initializeModal() {
  const modal = document.getElementById('vehicle-modal');
  const modalClose = document.querySelector('.modal-close');
  
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
    console.log('Modal close button event listener added');
  }
  
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
    console.log('Modal backdrop click event listener added');
  }
  
  console.log('Modal initialized');
}

// Charts Initialization
function initializeCharts() {
  console.log('Initializing charts...');
  
  // Small delay to ensure elements are visible
  setTimeout(() => {
    initializeFuelChart();
    initializeDriverChart();
  }, 100);
}

function initializeFuelChart() {
  const ctx = document.getElementById('fuelChart');
  if (!ctx) {
    console.warn('Fuel chart canvas not found');
    return;
  }
  
  // Destroy existing chart if it exists
  if (fuelChartInstance) {
    fuelChartInstance.destroy();
  }
  
  try {
    fuelChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: appData.analytics.fuel_consumption.map(item => item.month),
        datasets: [
          {
            label: 'Fuel Consumption (L)',
            data: appData.analytics.fuel_consumption.map(item => item.consumption),
            borderColor: '#1FB8CD',
            backgroundColor: 'rgba(31, 184, 205, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Efficiency (%)',
            data: appData.analytics.fuel_consumption.map(item => item.efficiency),
            borderColor: '#B4413C',
            backgroundColor: 'rgba(180, 65, 60, 0.1)',
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Fuel Consumption (L)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Efficiency (%)'
            },
            grid: {
              drawOnChartArea: false,
            },
          }
        }
      }
    });
    
    console.log('Fuel chart initialized successfully');
  } catch (error) {
    console.error('Error initializing fuel chart:', error);
  }
}

function initializeDriverChart() {
  const ctx = document.getElementById('driverChart');
  if (!ctx) {
    console.warn('Driver chart canvas not found');
    return;
  }
  
  // Destroy existing chart if it exists
  if (driverChartInstance) {
    driverChartInstance.destroy();
  }
  
  try {
    driverChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: appData.analytics.driver_scores.map(driver => driver.name.split(' ')[0]),
        datasets: [
          {
            label: 'Overall Score',
            data: appData.analytics.driver_scores.map(driver => driver.score),
            backgroundColor: '#1FB8CD'
          },
          {
            label: 'Safety Score',
            data: appData.analytics.driver_scores.map(driver => driver.safety),
            backgroundColor: '#FFC185'
          },
          {
            label: 'Efficiency Score',
            data: appData.analytics.driver_scores.map(driver => driver.efficiency),
            backgroundColor: '#B4413C'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Score'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Drivers'
            }
          }
        }
      }
    });
    
    console.log('Driver chart initialized successfully');
  } catch (error) {
    console.error('Error initializing driver chart:', error);
  }
}

// Route Optimization
function initializeRouteOptimization() {
  const optimizeRouteBtn = document.getElementById('optimize-route');
  
  if (optimizeRouteBtn) {
    optimizeRouteBtn.addEventListener('click', function() {
      console.log('Route optimization started');
      
      // Simulate route optimization process
      const button = this;
      const originalText = button.textContent;
      
      button.textContent = 'Optimizing...';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        
        // Show optimization results with animation
        const optimizedCard = document.querySelector('.optimization-card.optimized');
        if (optimizedCard) {
          optimizedCard.style.transform = 'scale(1.02)';
          optimizedCard.style.boxShadow = '0 8px 25px rgba(31, 184, 205, 0.3)';
          
          setTimeout(() => {
            optimizedCard.style.transform = 'scale(1)';
            optimizedCard.style.boxShadow = '';
          }, 500);
        }
        
        console.log('Route optimization completed');
      }, 2000);
    });
    
    console.log('Route optimization button event listener added');
  } else {
    console.log('Route optimization button not found');
  }
}

// Vehicle Marker Tooltips
function initializeMarkerTooltips() {
  const vehicleMarkers = document.querySelectorAll('.vehicle-marker');
  console.log('Found', vehicleMarkers.length, 'vehicle markers');
  
  vehicleMarkers.forEach((marker, index) => {
    const vehicleId = marker.getAttribute('data-vehicle');
    console.log(`Marker ${index}: ${vehicleId}`);
    
    marker.addEventListener('mouseenter', function() {
      const vehicle = appData.vehicles.find(v => v.id === vehicleId);
      
      if (vehicle) {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'marker-tooltip';
        tooltip.innerHTML = `
          <strong>${vehicle.id}</strong><br>
          Driver: ${vehicle.driver}<br>
          Status: ${vehicle.status}<br>
          Fuel: ${vehicle.fuel}%
        `;
        tooltip.style.cssText = `
          position: absolute;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-base);
          padding: var(--space-8);
          font-size: var(--font-size-xs);
          box-shadow: var(--shadow-md);
          z-index: 1000;
          pointer-events: none;
          top: -60px;
          left: 50%;
          transform: translateX(-50%);
          min-width: 120px;
        `;
        
        this.appendChild(tooltip);
      }
    });
    
    marker.addEventListener('mouseleave', function() {
      const tooltip = this.querySelector('.marker-tooltip');
      if (tooltip) {
        tooltip.remove();
      }
    });
    
    marker.addEventListener('click', function(e) {
      e.stopPropagation();
      console.log('Vehicle marker clicked:', vehicleId);
      showVehicleDetails(vehicleId);
    });
  });
  
  console.log('Vehicle markers initialized');
}

// Real-time Updates Simulation
function simulateRealTimeUpdates() {
  setInterval(() => {
    // Simulate fuel level changes
    appData.vehicles.forEach(vehicle => {
      if (vehicle.status === 'Active') {
        // Decrease fuel slightly for active vehicles
        vehicle.fuel = Math.max(0, vehicle.fuel - Math.random() * 0.5);
      }
    });
    
    // Update vehicle table if visible
    if (currentSection === 'vehicles') {
      renderVehicleTable();
    }
    
    // Update statistics
    updateFleetStatistics();
  }, 10000); // Update every 10 seconds
  
  console.log('Real-time updates simulation started');
}

function updateFleetStatistics() {
  const activeVehicles = appData.vehicles.filter(v => v.status === 'Active').length;
  const lowFuelAlerts = appData.vehicles.filter(v => v.fuel < 50).length;
  const avgFuelEfficiency = Math.round(
    appData.vehicles.reduce((sum, v) => sum + v.fuel, 0) / appData.vehicles.length
  );
  
  // Update dashboard cards if visible
  if (currentSection === 'dashboard') {
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
      statValues[1].textContent = activeVehicles; // Active trips
      statValues[2].textContent = lowFuelAlerts; // Alerts
      statValues[3].textContent = `${avgFuelEfficiency}%`; // Fuel efficiency
    }
  }
}

// Populate Trips Grid
function populateTripsGrid() {
  const tripsGrid = document.getElementById('trips-grid');
  if (!tripsGrid) {
    console.log('Trips grid not found');
    return;
  }
  
  tripsGrid.innerHTML = '';
  
  appData.trips.forEach(trip => {
    const tripCard = document.createElement('div');
    tripCard.className = 'trip-card';
    
    tripCard.innerHTML = `
      <div class="trip-header">
        <span class="trip-id">${trip.id}</span>
        <span class="status status--success">${trip.status}</span>
      </div>
      <div class="trip-route">${trip.start} → ${trip.end}</div>
      <div class="trip-details">
        <span>Vehicle: ${trip.vehicle}</span>
        <span>Distance: ${trip.distance}</span>
        <span>ETA: ${trip.eta}</span>
      </div>
    `;
    
    tripsGrid.appendChild(tripCard);
  });
  
  console.log('Trips grid populated with', appData.trips.length, 'trips');
}

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Starting initialization...');
  
  // Make functions globally available
  window.showVehicleDetails = showVehicleDetails;
  window.closeModal = closeModal;
  
  initializeApp();
  
  // Add interactive enhancements
  setTimeout(() => {
    const cards = document.querySelectorAll('.stat-card, .ml-feature-card, .trip-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn, .nav-btn');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 100);
      });
    });
    
    // Animate statistics on page load
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((stat, index) => {
      stat.style.opacity = '0';
      stat.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        stat.style.transition = 'all 0.5s ease';
        stat.style.opacity = '1';
        stat.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 1000);
});

// Advanced ML Features Simulation
function simulateMLPredictions() {
  const predictions = [
    { vehicle: 'V002', component: 'Brake Pads', days: 15, confidence: 87 },
    { vehicle: 'V005', component: 'Oil Change', days: 8, confidence: 92 },
    { vehicle: 'V006', component: 'Tire Rotation', days: 22, confidence: 78 }
  ];
  
  return predictions;
}

function simulateDriverBehaviorAnalysis() {
  return {
    harshBraking: Math.floor(Math.random() * 5) + 1,
    speedViolations: Math.floor(Math.random() * 3),
    idleTime: Math.floor(Math.random() * 20) + 5,
    fuelEfficiency: (Math.random() * 5 + 15).toFixed(1)
  };
}

// Initialize advanced features
setTimeout(() => {
  const behaviorData = simulateDriverBehaviorAnalysis();
  const metrics = document.querySelectorAll('.metric-value');
  
  if (metrics.length >= 4) {
    metrics[0].textContent = `${behaviorData.harshBraking} this week`;
    metrics[1].textContent = `${behaviorData.speedViolations} this week`;
    metrics[2].textContent = `${behaviorData.idleTime}% avg`;
    metrics[3].textContent = `${behaviorData.fuelEfficiency} km/L avg`;
  }
}, 2000);