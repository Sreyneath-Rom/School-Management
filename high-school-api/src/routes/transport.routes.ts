import { Router } from 'express'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess, sendCreated, sendNoContent } from '@/utils/apiResponse'

const router = Router()
router.use(authenticate)

let routes = [
  { id: 'RT-101', name: 'North Suburbs Express', startPoint: 'High School Campus', endPoint: 'North Hills Terminal', stops: ['Maple Square', 'Oak Ridge', 'Pine Crest Station', 'North Hills Mall'], totalDistance: '18.4 km', estimatedTime: '45 mins', assignedVehicle: 'Bus #04', assignedDriver: 'Robert Hayes', studentsCount: 38, isActive: true },
  { id: 'RT-102', name: 'Downtown & Metro Line', startPoint: 'High School Campus', endPoint: 'Central Metro Plaza', stops: ['City Library', 'Heritage Park', 'Riverwalk Bridge', 'Central Station'], totalDistance: '12.6 km', estimatedTime: '35 mins', assignedVehicle: 'Bus #07', assignedDriver: 'Carlos Santos', studentsCount: 42, isActive: true },
  { id: 'RT-103', name: 'West Valley & Highlands', startPoint: 'High School Campus', endPoint: 'Sunset Valley Estates', stops: ['Valley View Blvd', 'Greenwood Circle', 'Highland Park'], totalDistance: '22.1 km', estimatedTime: '55 mins', assignedVehicle: 'Bus #12', assignedDriver: 'David Kim', studentsCount: 32, isActive: true },
]

let vehicles = [
  { id: 'VEH-01', vehicleNumber: 'BUS-104-NY', model: 'Blue Bird All American HD', capacity: 54, type: 'Full Bus', fuelType: 'Diesel', status: 'ACTIVE', lastServiceDate: '2026-08-01', insuranceExpiry: '2027-05-15', gpsEnabled: true },
  { id: 'VEH-02', vehicleNumber: 'BUS-107-NY', model: 'Thomas Built Saf-T-Liner C2', capacity: 48, type: 'Full Bus', fuelType: 'Diesel', status: 'ACTIVE', lastServiceDate: '2026-07-20', insuranceExpiry: '2027-03-30', gpsEnabled: true },
  { id: 'VEH-03', vehicleNumber: 'VAN-112-NY', model: 'Ford Transit Passenger 350', capacity: 15, type: 'Mini Van', fuelType: 'Gasoline', status: 'MAINTENANCE', lastServiceDate: '2026-08-25', insuranceExpiry: '2026-12-10', gpsEnabled: true },
]

let drivers = [
  { id: 'DRV-01', name: 'Robert Hayes', licenseNumber: 'CDL-NY-8839210', phone: '+1 (555) 234-5678', experience: '12 Years', status: 'ON_DUTY', assignedRoute: 'North Suburbs Express', rating: 4.9 },
  { id: 'DRV-02', name: 'Carlos Santos', licenseNumber: 'CDL-NY-7721094', phone: '+1 (555) 345-6789', experience: '8 Years', status: 'ON_DUTY', assignedRoute: 'Downtown & Metro Line', rating: 4.8 },
  { id: 'DRV-03', name: 'David Kim', licenseNumber: 'CDL-NY-9912048', phone: '+1 (555) 456-7890', experience: '15 Years', status: 'STANDBY', assignedRoute: 'West Valley & Highlands', rating: 5.0 },
]

let assignments = [
  { id: 'ASN-001', studentId: 'std-1', studentName: 'Alexander Vance', class: 'Grade 10 - A', routeId: 'RT-101', routeName: 'North Suburbs Express', pickupStop: 'Pine Crest Station', pickupTime: '07:25 AM', dropStop: 'Pine Crest Station', dropTime: '04:15 PM', status: 'ACTIVE' },
  { id: 'ASN-002', studentId: 'std-2', studentName: 'Sophia Lin', class: 'Grade 10 - B', routeId: 'RT-102', routeName: 'Downtown & Metro Line', pickupStop: 'Heritage Park', pickupTime: '07:35 AM', dropStop: 'Heritage Park', dropTime: '04:05 PM', status: 'ACTIVE' },
]

/**
 * 1. Routes
 */
router.get('/routes', requirePermission('transport', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, routes)
}))

router.post('/routes', requirePermission('transport', 'create'), asyncHandler(async (req, res) => {
  const newRoute = {
    id: `RT-${Math.floor(100 + Math.random() * 900)}`,
    name: req.body.name || 'New Route',
    startPoint: req.body.startPoint || 'High School Campus',
    endPoint: req.body.endPoint || 'Destination',
    stops: req.body.stops || [],
    totalDistance: req.body.totalDistance || '10 km',
    estimatedTime: req.body.estimatedTime || '30 mins',
    assignedVehicle: req.body.assignedVehicle || 'Unassigned',
    assignedDriver: req.body.assignedDriver || 'Unassigned',
    studentsCount: 0,
    isActive: true,
  }
  routes.push(newRoute)
  sendCreated(res, newRoute)
}))

router.put('/routes/:id', requirePermission('transport', 'edit'), asyncHandler(async (req, res) => {
  const index = routes.findIndex((r) => r.id === req.params.id)
  if (index === -1) return res.status(404).json({ success: false, message: 'Route not found' })
  routes[index] = { ...routes[index], ...req.body }
  sendSuccess(res, routes[index])
}))

router.delete('/routes/:id', requirePermission('transport', 'delete'), asyncHandler(async (req, res) => {
  routes = routes.filter((r) => r.id !== req.params.id)
  sendNoContent(res)
}))

/**
 * 2. Vehicles
 */
router.get('/vehicles', requirePermission('transport', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, vehicles)
}))

router.post('/vehicles', requirePermission('transport', 'create'), asyncHandler(async (req, res) => {
  const newVehicle = {
    id: `VEH-${String(vehicles.length + 1).padStart(2, '0')}`,
    vehicleNumber: req.body.vehicleNumber || 'BUS-000',
    model: req.body.model || 'Standard Bus',
    capacity: Number(req.body.capacity) || 40,
    type: req.body.type || 'Full Bus',
    fuelType: req.body.fuelType || 'Diesel',
    status: req.body.status || 'ACTIVE',
    lastServiceDate: req.body.lastServiceDate || new Date().toISOString().split('T')[0],
    insuranceExpiry: req.body.insuranceExpiry || '2027-01-01',
    gpsEnabled: req.body.gpsEnabled !== false,
  }
  vehicles.push(newVehicle)
  sendCreated(res, newVehicle)
}))

router.put('/vehicles/:id', requirePermission('transport', 'edit'), asyncHandler(async (req, res) => {
  const index = vehicles.findIndex((v) => v.id === req.params.id)
  if (index === -1) return res.status(404).json({ success: false, message: 'Vehicle not found' })
  vehicles[index] = { ...vehicles[index], ...req.body }
  sendSuccess(res, vehicles[index])
}))

/**
 * 3. Drivers
 */
router.get('/drivers', requirePermission('transport', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, drivers)
}))

router.post('/drivers', requirePermission('transport', 'create'), asyncHandler(async (req, res) => {
  const newDriver = {
    id: `DRV-${String(drivers.length + 1).padStart(2, '0')}`,
    name: req.body.name || 'Driver Name',
    licenseNumber: req.body.licenseNumber || 'CDL-000000',
    phone: req.body.phone || '+1 (555) 000-0000',
    experience: req.body.experience || '5 Years',
    status: req.body.status || 'ON_DUTY',
    assignedRoute: req.body.assignedRoute || 'Unassigned',
    rating: 5.0,
  }
  drivers.push(newDriver)
  sendCreated(res, newDriver)
}))

/**
 * 4. Transport Assignments
 */
router.get('/assignments', requirePermission('transport', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, assignments)
}))

router.post('/assignments', requirePermission('transport', 'create'), asyncHandler(async (req, res) => {
  const newAssignment = {
    id: `ASN-${String(assignments.length + 1).padStart(3, '0')}`,
    studentId: req.body.studentId || 'std-1',
    studentName: req.body.studentName || 'Student',
    class: req.body.class || 'Grade 10',
    routeId: req.body.routeId || 'RT-101',
    routeName: req.body.routeName || 'Route Name',
    pickupStop: req.body.pickupStop || 'Main Stop',
    pickupTime: req.body.pickupTime || '07:30 AM',
    dropStop: req.body.dropStop || 'Main Stop',
    dropTime: req.body.dropTime || '04:15 PM',
    status: 'ACTIVE',
  }
  assignments.push(newAssignment)
  sendCreated(res, newAssignment)
}))

router.delete('/assignments/:id', requirePermission('transport', 'delete'), asyncHandler(async (req, res) => {
  assignments = assignments.filter((a) => a.id !== req.params.id)
  sendNoContent(res)
}))

export default router
